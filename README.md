# BrandMyReach

A twelve-month exclusive sponsorship opportunity: all sixteen laptop placements,
apparel and accessories, with monthly documentation of real activity. Companies
can submit private proposals; one confirmed sponsor receives the complete presence.

Built with Next.js 14, TypeScript, Framer Motion and React Three Fiber.

## Run locally

Install dependencies with `npm install`, copy `.env.example` to `.env.local`,
configure the server values, then run `npm run dev` and open localhost:3000.
The page remains behind the owner-controlled lock until it is opened.

## Configure and launch

Read [LAUNCH_SETUP.md](LAUNCH_SETUP.md) before deploying. A persistent Redis
database, private invitation code and session secret are required. Preview and
Production must have separate namespaces. The server never ships these secrets
to the browser.

Opening the site makes the proposal public. Any suitable company can submit an
offer while it is open; offers are rate limited and stored privately. Email
notifications are optional. The invitation code controls access to the locked
site and is not required to submit a proposal after the site is open.

## Experience

- The BrandMyReach wordmark appears in the site identity and social preview.
- A scroll-controlled laptop opens to reveal a detailed keyboard and branded lid.
- Sponsor name, URL and logo come from one published sponsor configuration and
  update across the site's placements after publishing.
- Five branded objects rotate around a common vertical axis. Visitors can drag
  or pause the carousel. Reduced motion shows a static collection preview.
- The reporting timeline is clearly labelled as planned until real content exists.
- Live visitor and online counts use first-party aggregate analytics; no sample
  numbers are shown.

## Verification

```bash
node --test tests/*.test.cjs
npm run build
```

The automated route tests use mocked storage and email. They do not publish a real
campaign or send emails. Visual review is still useful on the configured preview,
particularly for 3D logo placement and the mobile layout.
