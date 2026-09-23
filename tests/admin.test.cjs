const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(id, ...args) {
  if (id === 'server-only') return path.join(root, 'tests/server-only.cjs');
  return resolve.call(this, id.startsWith('@/') ? path.join(root, id.slice(2)) : id, ...args);
};

require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
}).outputText, file);

const auth = require('../lib/admin-auth.ts');
const sponsor = require('../lib/sponsor.ts');

beforeEach(() => {
  Object.assign(process.env, {
    ADMIN_EMAIL: 'admin@example.com',
    ADMIN_PASSWORD: 'test-password-that-is-not-committed',
    ADMIN_SESSION_SECRET: 'test-admin-session-secret-over-32-characters',
  });
});

test('admin credentials are checked server-side and normalized safely', () => {
  assert.equal(auth.validAdmin(' ADMIN@example.com ', process.env.ADMIN_PASSWORD), true);
  assert.equal(auth.validAdmin('other@example.com', process.env.ADMIN_PASSWORD), false);
  assert.equal(auth.validAdmin(process.env.ADMIN_EMAIL, 'wrong'), false);
});

test('admin sessions reject tampering and expiry', () => {
  const now = Date.now();
  const token = auth.createAdminSession(now);
  assert.ok(auth.readAdminSession(token, now));
  assert.equal(auth.readAdminSession(`${token}x`, now), null);
  assert.equal(auth.readAdminSession(token, now + auth.ADMIN_SESSION_SECONDS * 1000 + 1), null);
});

test('sponsor URLs reject executable protocols and embedded credentials', () => {
  assert.equal(sponsor.validateSponsorDetails('Postiz', 'https://postiz.com').website, 'https://postiz.com/');
  assert.throws(() => sponsor.validateSponsorDetails('Postiz', 'javascript:alert(1)'));
  assert.throws(() => sponsor.validateSponsorDetails('Postiz', 'https://user:pass@example.com'));
  assert.equal(sponsor.validateSponsorDetails('Example', 'https://example.com', '1250.50', 'USD').fundsRaised, 1250.5);
  assert.throws(() => sponsor.validateSponsorDetails('Example', 'https://example.com', '-1', 'USD'));
  assert.throws(() => sponsor.validateSponsorDetails('Example', 'https://example.com', '1', 'GBP'));
});

test('unsafe SVG uploads are rejected while a simple logo is accepted', async () => {
  const safe = new File(['<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10z"/></svg>'], 'logo.svg', { type: 'image/svg+xml' });
  const unsafe = new File(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'], 'bad.svg', { type: 'image/svg+xml' });
  assert.match(await sponsor.logoData(safe), /^data:image\/svg\+xml;base64,/);
  await assert.rejects(() => sponsor.logoData(unsafe), /unsafe content/);
});
