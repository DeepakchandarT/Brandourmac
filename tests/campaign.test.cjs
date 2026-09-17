const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(id, ...args) {
  if (id === 'server-only') return path.join(root, 'tests/server-only.cjs');
  return resolve.call(this, id.startsWith('@/') ? path.join(root, id.slice(2)) : id, ...args);
};
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
}).outputText, file);
const { NextRequest } = require('next/server');
const campaign = require('../lib/campaign.ts');
const invite = require('../app/api/invite/route.ts');
const offer = require('../app/api/offer/route.ts');
const originalFetch = global.fetch;
let store, failedStorage, emailAttempts;
beforeEach(() => {
  Object.assign(process.env, {
    UPSTASH_REDIS_REST_URL: 'https://storage.test', UPSTASH_REDIS_REST_TOKEN: 'test-only',
    SPONSOR_INVITE_CODE: 'test-invitation-123456', SPONSOR_SESSION_SECRET: 'test-session-secret-with-more-than-32-characters',
    CAMPAIGN_NAMESPACE: 'test-campaign',
  });
  delete process.env.OFFER_EMAIL; delete process.env.RESEND_API_KEY; delete process.env.RESEND_FROM_EMAIL;
  store = new Map(); failedStorage = false; emailAttempts = 0;
  global.fetch = async (url, options) => {
    if (String(url) === 'https://api.resend.com/emails') { emailAttempts++; return new Response('{}', { status: 503 }); }
    assert.equal(url, 'https://storage.test');
    if (failedStorage) throw new Error('Simulated outage');
    const [cmd, ...args] = JSON.parse(options.body);
    let result;
    if (cmd === 'GET') result = store.get(args[0]) ?? null;
    else if (cmd === 'SET') {
      if (args.includes('NX') && store.has(args[0])) result = null;
      else { store.set(args[0], args[1]); result = 'OK'; }
    } else if (cmd === 'EVAL') {
      const key = args[2]; result = (store.get(key) || 0) + 1; store.set(key, result);
    } else throw new Error(`Unexpected command: ${cmd}`);
    return Response.json({ result });
  };
});
after(() => { global.fetch = originalFetch; Module._resolveFilename = resolve; });
function request(route, body, token, origin = 'https://campaign.test') {
  return new NextRequest(`https://campaign.test/api/${route}`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin,
      ...(token ? { cookie: `${campaign.SESSION_COOKIE}=${token}` } : {}) }, body: JSON.stringify(body),
  });
}
function validOffer() {
  return { contact: 'Test Sponsor', email: 'sponsor@example.com', amount: '1404.50', currency: 'USD', note: 'Test only', requestId: 'd9690c61-8c16-4432-beb0-1bd94c931488' };
}

test('unpublished by default; invalid code cannot launch or set a session', async () => {
  assert.equal(await campaign.isPublished(), false);
  const response = await invite.POST(request('invite', { code: 'wrong' }));
  assert.equal(response.status, 401); assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(await campaign.isPublished(), false);
});
test('valid invitation publishes persistently and issues an HttpOnly signed cookie', async () => {
  const response = await invite.POST(request('invite', { code: process.env.SPONSOR_INVITE_CODE }));
  assert.equal(response.status, 200); assert.equal(await campaign.isPublished(), true);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(response.headers.get('set-cookie'), /SameSite=lax/i);
  const token = response.cookies.get(campaign.SESSION_COOKIE).value;
  assert.ok(campaign.readSession(token));
  const timestamp = store.get('test-campaign:published');
  await invite.POST(request('invite', { code: process.env.SPONSOR_INVITE_CODE }));
  assert.equal(store.get('test-campaign:published'), timestamp);
});
test('tampered, expired and revoked sessions cannot authorize offers', () => {
  const now = Date.now(), token = campaign.createSession(now);
  assert.equal(campaign.readSession(token + 'x', now), null);
  assert.equal(campaign.readSession(token, now + campaign.SESSION_SECONDS * 1000 + 1), null);
  process.env.SPONSOR_INVITE_CODE = 'a-different-private-code';
  assert.equal(campaign.readSession(token, now), null);
});
test('cross-origin launch is rejected without publishing', async () => {
  const response = await invite.POST(request('invite', { code: process.env.SPONSOR_INVITE_CODE }, null, 'https://elsewhere.test'));
  assert.equal(response.status, 403); assert.equal(store.size, 0);
});
test('public site does not give anonymous visitors bidding permission', async () => {
  await campaign.publishCampaign();
  assert.equal(await campaign.isPublished(), true);
  assert.equal((await offer.POST(request('offer', validOffer()))).status, 401);
});
test('excessive invitation guesses are limited', async () => {
  for (let i = 0; i < 10; i++) assert.equal((await invite.POST(request('invite', { code: 'wrong' }))).status, 401);
  assert.equal((await invite.POST(request('invite', { code: 'wrong' }))).status, 429);
});
test('missing configuration and storage outages fail closed', async () => {
  failedStorage = true;
  assert.equal((await invite.POST(request('invite', { code: process.env.SPONSOR_INVITE_CODE }))).status, 503);
  delete process.env.SPONSOR_SESSION_SECRET;
  assert.equal(campaign.configured(), false);
  assert.equal(await campaign.isPublished(), false);
  assert.equal((await invite.POST(request('invite', { code: process.env.SPONSOR_INVITE_CODE }))).status, 503);
});
test('malformed and oversized input never publishes the campaign', async () => {
  assert.equal((await invite.POST(request('invite', { code: 'a'.repeat(9000) }))).status, 400);
  assert.equal((await invite.POST(request('invite', null))).status, 400);
  assert.equal(await campaign.isPublished(), false);
});
test('valid offer is private, durable and idempotent on retry', async () => {
  const token = campaign.createSession();
  const first = await offer.POST(request('offer', validOffer(), token));
  const second = await offer.POST(request('offer', validOffer(), token));
  const a = await first.json(), b = await second.json();
  assert.equal(first.status, 200); assert.equal(a.saved, true); assert.equal(a.reference, b.reference);
  const offers = [...store.keys()].filter(k => k.startsWith('test-campaign:offer:'));
  assert.equal(offers.length, 1);
  assert.equal(JSON.parse(store.get(offers[0])).amount, '1404.50');
  assert.equal(a.email, undefined); assert.equal(emailAttempts, 0);
});
test('email failure does not lose or duplicate a saved offer', async () => {
  Object.assign(process.env, { OFFER_EMAIL: 'owner@example.com', RESEND_API_KEY: 'test-only', RESEND_FROM_EMAIL: 'test@example.com' });
  const token = campaign.createSession();
  const response = await offer.POST(request('offer', validOffer(), token));
  const result = await response.json();
  assert.equal(response.status, 200); assert.equal(result.saved, true); assert.equal(emailAttempts, 1);
  assert.equal(store.get(`test-campaign:offer:${result.reference}:notification`), 'failed');
  await offer.POST(request('offer', validOffer(), token));
  assert.equal(emailAttempts, 1);
});
test('negative amounts, invalid email, unsupported currency and forged session are rejected', async () => {
  const token = campaign.createSession();
  for (const fields of [{ amount: '-1' }, { email: 'not-an-email' }, { currency: 'XYZ' }, { amount: 'Infinity' }]) {
    assert.equal((await offer.POST(request('offer', { ...validOffer(), ...fields }, token))).status, 400);
  }
  assert.equal((await offer.POST(request('offer', validOffer(), 'forged'))).status, 401);
  assert.equal([...store.keys()].filter(k => k.includes(':offer:')).length, 0);
});
