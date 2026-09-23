import "server-only";
import { redis, namespace } from "./campaign";
import { DEFAULT_SPONSOR, SponsorConfig } from "./sponsor-types";

const publishedKey = () => `${namespace()}:sponsor:published`;
const draftKey = () => `${namespace()}:sponsor:draft`;

function parse(value: string | null): SponsorConfig | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value) as Partial<SponsorConfig>;
    if (typeof data.name !== "string" || typeof data.website !== "string" || typeof data.version !== "number") return null;
    return {
      ...DEFAULT_SPONSOR,
      ...data,
      fundsRaised: typeof data.fundsRaised === "number" && Number.isFinite(data.fundsRaised) && data.fundsRaised >= 0 ? data.fundsRaised : 0,
      fundingCurrency: data.fundingCurrency && ["USD", "EUR", "INR"].includes(data.fundingCurrency) ? data.fundingCurrency : "USD",
    };
  } catch { return null; }
}

export async function getPublishedSponsor() {
  try { return parse(await redis<string | null>(["GET", publishedKey()])) || DEFAULT_SPONSOR; }
  catch { return DEFAULT_SPONSOR; }
}

export async function getDraftSponsor() {
  try { return parse(await redis<string | null>(["GET", draftKey()])) || await getPublishedSponsor(); }
  catch { return DEFAULT_SPONSOR; }
}

export function validateSponsorDetails(nameValue: unknown, websiteValue: unknown, fundsRaisedValue: unknown = 0, currencyValue: unknown = "USD") {
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const website = typeof websiteValue === "string" ? websiteValue.trim() : "";
  if (!name || name.length > 80) throw new Error("Company name must be between 1 and 80 characters.");
  let url: URL;
  try { url = new URL(website); } catch { throw new Error("Enter a valid sponsor website URL."); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error("Sponsor URL must use HTTP or HTTPS.");
  const rawAmount = typeof fundsRaisedValue === "number" ? String(fundsRaisedValue) : typeof fundsRaisedValue === "string" ? fundsRaisedValue.trim() : "";
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(rawAmount)) throw new Error("Confirmed sponsorship amount must be a non-negative amount with up to two decimals.");
  const fundsRaised = Number(rawAmount);
  if (!Number.isFinite(fundsRaised) || fundsRaised > 1_000_000_000_000) throw new Error("Confirmed sponsorship amount is too large.");
  if (!["USD", "EUR", "INR"].includes(String(currencyValue))) throw new Error("Choose USD, EUR or INR for the confirmed amount.");
  return { name, website: url.toString(), fundsRaised, fundingCurrency: currencyValue as SponsorConfig["fundingCurrency"] };
}

export async function saveSponsorDraft(update: Partial<SponsorConfig>) {
  const current = await getDraftSponsor();
  const next: SponsorConfig = { ...current, ...update, version: current.version + 1, updatedAt: new Date().toISOString() };
  await redis(["SET", draftKey(), JSON.stringify(next)]);
  return next;
}

export async function publishSponsor() {
  const draft = await getDraftSponsor();
  const published = { ...draft, version: draft.version + 1, updatedAt: new Date().toISOString() };
  await redis(["SET", publishedKey(), JSON.stringify(published)]);
  await redis(["SET", draftKey(), JSON.stringify(published)]);
  return published;
}

export function validateSponsorLogo(file: File) {
  const allowed = new Set(["image/png", "image/webp", "image/svg+xml"]);
  if (!allowed.has(file.type)) throw new Error("Use a PNG, WebP or SVG logo.");
  if (file.size < 1 || file.size > 350_000) throw new Error("Logo must be smaller than 350 KB.");
}

export async function logoData(file: File) {
  validateSponsorLogo(file);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (file.type === "image/png" && !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error("That file is not a valid PNG.");
  if (file.type === "image/webp" && (bytes.toString("ascii",0,4)!=="RIFF" || bytes.toString("ascii",8,12)!=="WEBP")) throw new Error("That file is not a valid WebP.");
  if (file.type === "image/svg+xml") {
    const svg=bytes.toString("utf8");
    if (!/^\s*<svg[\s>]/i.test(svg) || /<\/?(?:script|foreignObject|iframe|object|embed)|\son\w+\s*=|\b(?:href|xlink:href)\s*=|<!DOCTYPE|<!ENTITY|url\s*\(/i.test(svg)) throw new Error("SVG contains unsupported or unsafe content.");
  }
  return `data:${file.type};base64,${bytes.toString("base64")}`;
}
