# Postiz × Deepak — Partnership Proposal Site

A premium, single-page proposal site pitching a 12-month sponsorship: all 16
branding surfaces of Deepak's MacBook Air, dedicated entirely to Postiz.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion,
and React Three Fiber for the interactive MacBook visualization.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying

The project is a standard Next.js app and deploys to Vercel with no extra
configuration:

```bash
npm run build
```

Push to a Git repo and import it in Vercel, or run `vercel` from the CLI.

## Before this goes live

**Branding placeholders.** The site currently uses generic wordmark text
("POSTIZ") in plain type — not Postiz's actual logo, colors, or brand assets.
Do not swap in Postiz's real logo, brand color, or trademarked assets until
Postiz has given explicit permission to use them in this proposal. Once
approved, the two places to update are:

- `components/MacBookScene.tsx` — the `<Text>` on the laptop screen inside
  the 3D scene, and the fallback in `components/StaticMacBook.tsx`.
- The favicon/metadata in `app/layout.tsx`, if you add one.

**Photo and copy placeholders.** These are intentionally unfilled and should
stay that way until real content exists:

- `components/About.tsx` — swap the placeholder box for an actual photo
  of Deepak.
- `components/MonthlyReports.tsx` — the `METRICS` array and photo grid are
  built to be edited every month. Never fill in a number that hasn't
  actually happened; leave it as "Coming soon" until it has.

**Contact link.** The final CTA in `components/FinalCTA.tsx` currently points
to a placeholder `mailto:` address — replace it with Deepak's real contact
email or a scheduling link.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx           Composes all sections in order
  globals.css        Design tokens, base styles, reduced-motion handling
components/
  Nav.tsx                  Sticky nav with scroll-aware background
  Hero.tsx                 Full-screen hero, closed MacBook, cursor parallax
  MacBookScene.tsx         R3F/Three.js MacBook — hinge, 16 hoverable spots
  StaticMacBook.tsx        Lightweight SVG fallback for mobile / reduced motion
  InteractiveMacBook.tsx   Scroll-driven open/close + branding reveal
  Differentiator.tsx       4×4 grid animating numbers into "POSTIZ"
  WhereItTravels.tsx       Abstract map visualization, no fabricated stats
  About.tsx                Deepak's introduction + photo placeholder
  PostizPresence.tsx       Laptop / Apparel / Documentation pillars
  MonthlyReports.tsx       Editable monthly reporting dashboard
  LongTerm.tsx             1 MacBook → entire team progression
  Proposal.tsx             Stats summary + CTA
  FAQ.tsx                  Accordion
  FinalCTA.tsx             Closing full-screen CTA
  Footer.tsx
  Reveal.tsx               Shared scroll-reveal + section primitives
lib/
  useMediaQuery.ts   Mobile + prefers-reduced-motion detection
```

## Notes on the 3D scene

`MacBookScene.tsx` is an original, procedurally built laptop (no external
model or scanned assets), so there's nothing to license or attribute. It:

- Renders closed in the hero, floating gently and tilting toward the cursor.
- Opens progressively as the visitor scrolls through the "16 spots" section,
  driven by a single scroll-linked value rather than scroll-jacking.
- Falls back to a static SVG on mobile and when the visitor has
  `prefers-reduced-motion` enabled, per the brief's performance and
  accessibility requirements.
