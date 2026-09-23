import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "postiz_invitation";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export function namespace() {
  return process.env.CAMPAIGN_NAMESPACE || `postiz:${process.env.VERCEL_ENV === "production" ? "production" : `preview:${process.env.VERCEL_GIT_COMMIT_REF || "local"}`}`;
}

export function configured() {
  return !!(redisCredentials().url && redisCredentials().token &&
    process.env.SPONSOR_INVITE_CODE && process.env.SPONSOR_INVITE_CODE.length >= 12 &&
    process.env.SPONSOR_SESSION_SECRET && process.env.SPONSOR_SESSION_SECRET.length >= 32);
}

function redisCredentials() {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };
}

export async function redis<T>(command: (string | number)[]): Promise<T> {
  const { url, token } = redisCredentials();
  if (!url || !token) throw new Error("Campaign storage is unavailable");
  const response = await fetch(url, {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(6000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error("Campaign storage is unavailable");
  const body = await response.json();
  if (body.error) throw new Error("Campaign storage rejected the operation");
  return body.result as T;
}

export async function isPublished() {
  // Admin unlock depends on persisted state, not invitation credentials.
  // Redis failures propagate so callers keep the public site closed.
  return (await redis<string | null>(["GET", `${namespace()}:published`])) !== null;
}

export async function publishCampaign() {
  // NX preserves the original launch time across subsequent invitation logins.
  await redis(["SET", `${namespace()}:published`, new Date().toISOString(), "NX"]);
}

export async function lockCampaign() {
  await redis(["DEL", `${namespace()}:published`]);
}

export async function unlockCampaign() {
  await redis(["SET", `${namespace()}:published`, new Date().toISOString()]);
}

function digest(value: string) { return createHash("sha256").update(value).digest(); }
export function validCode(code: unknown) {
  return typeof code === "string" && code.length <= 256 && configured() &&
    timingSafeEqual(digest(code.trim()), digest(process.env.SPONSOR_INVITE_CODE!));
}

function signature(payload: string) {
  // Rotating either server secret or invitation code revokes existing sessions.
  return createHmac("sha256", process.env.SPONSOR_SESSION_SECRET!)
    .update(`${process.env.SPONSOR_INVITE_CODE}:${payload}`).digest("base64url");
}

export function createSession(now = Date.now()) {
  if (!configured()) throw new Error("Invitation not configured");
  const payload = Buffer.from(JSON.stringify({ role: "sponsor", id: randomUUID(), expires: now + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readSession(token?: string, now = Date.now()): { id: string } | null {
  if (!configured() || !token || token.length > 1024) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2 || !timingSafeEqual(digest(parts[1]), digest(signature(parts[0])))) return null;
    const data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return data.role === "sponsor" && typeof data.id === "string" && typeof data.expires === "number" && data.expires > now ? { id: data.id } : null;
  } catch { return null; }
}

export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function limited(request: Request, purpose: string, maximum: number, sessionId?: string) {
  // Vercel supplies x-vercel-forwarded-for; other hosts share a safe fallback bucket.
  const identity = sessionId || request.headers.get("x-vercel-forwarded-for") || "shared";
  const key = `${namespace()}:rate:${purpose}:${digest(identity).toString("hex").slice(0, 24)}`;
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
  const count = await redis<number>(["EVAL", script, 1, key, 900]);
  return count > maximum;
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Invalid content type");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty request");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 8192) { await reader.cancel(); throw new Error("Request too large"); }
    chunks.push(value);
  }
  const result = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("Invalid request");
  return result;
}
