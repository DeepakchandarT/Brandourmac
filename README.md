# Postiz × Deepak

A twelve-month partnership proposal: all sixteen laptop placements, a T-shirt,
pen, notebook and water bottle, with monthly documentation of real activity.

Built with Next.js 14, TypeScript, Framer Motion and React Three Fiber.

## Run locally

Install dependencies with `npm install`, copy `.env.example` to `.env.local`,
configure the server values, then run `npm run dev` and open localhost:3000.
The page remains behind the invitation gate until it has been activated.

## Configure and launch

Read [LAUNCH_SETUP.md](LAUNCH_SETUP.md) before deploying. A persistent Redis
database, private invitation code and session secret are required. Preview and
Production must have separate namespaces. The server never ships these secrets
to the browser.

A valid code makes the campaign public for everyone. Only invitation holders
with an unexpired signed cookie can submit an offer. Offers are stored privately;
email notifications are optional. The shared code is an invitation credential,
not verification of the holder's identity.

## Experience

- The supplied Postiz logo links to `https://postiz.com/` in the navigation and
  product branding. The raster asset is preserved without alteration.
- A scroll-controlled laptop opens to reveal a detailed keyboard and branded lid.
- Four branded objects rotate around a common vertical axis. Visitors can drag,
  pause or use previous/next controls. Reduced motion shows one object at a time.
- The upright book leans into four staggered books; their labels appear as they settle.
- A six-chapter reporting timeline has a curved track, flat report covers and
  a recessed dial. Chapters are clearly labelled as planned until real content exists.
- A persistent offer link leads to the private form, which validates and saves
  offers on the server. Invitation sessions last seven days.

The final reporting chapter currently uses a tall branded report cover. A supplied
portrait and real campaign photos can replace the typographic covers; no fictional
activity or stock event photography is presented as completed work.

## Verification

```bash
node --test tests/campaign.test.cjs
npm run build
```

The automated route tests use mocked storage and email. They do not publish a real
campaign or send emails. Visual review is still required on the configured preview,
particularly for the 3D orbit, logo placement and mobile timeline.
