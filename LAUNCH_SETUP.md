# Opening the BrandMyReach proposal

The website starts behind a server-rendered lock. The owner can open or re-lock it
from `/admin`. When open, any suitable company can send a private proposal without
an invitation code. The invite code is used only to open the locked site.

## One-time Vercel configuration

Connect a persistent Upstash Redis database in Vercel's Storage/Marketplace, then
set these server-only environment variables for the intended environment:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, or Vercel's
  `KV_REST_API_URL` and `KV_REST_API_TOKEN`: the database REST credentials.
- `SPONSOR_INVITE_CODE`: a random private code of at least 12 characters.
- `SPONSOR_SESSION_SECRET`: an independent random secret of at least 32 characters.
- `CAMPAIGN_NAMESPACE`: `postiz-preview` for Preview and `postiz-production` for Production.

Use separate databases for preview and production when possible. Never use the
same namespace across them: preview testing must not launch the public campaign.
Never prefix these variables with `NEXT_PUBLIC_`, commit real values, or send them
in chat. Redeploy after setting them. Missing configuration or a storage outage
fails closed and displays the invitation screen.

Keep the complete invite code only in Vercel. Do not put it in public website copy.

Optional notification settings: `OFFER_EMAIL`, `RESEND_API_KEY`, and
`RESEND_FROM_EMAIL` (a verified sender). The complete offer is stored regardless
of email delivery. There is no background email retry worker; failed notifications
can be checked in the database and followed up manually. No real email was sent
during testing.

## Admin portal, sponsor manager and analytics

The protected dashboard is available at `/admin`. Add these server-only variables
to both Preview and Production, then redeploy:

- `ADMIN_EMAIL`: the email address permitted to sign in. If omitted, `OFFER_EMAIL`
  is used.
- `ADMIN_PASSWORD`: a strong, unique password. Never prefix it with `NEXT_PUBLIC_`.
- `ADMIN_SESSION_SECRET`: an independent random secret of at least 32 characters.

The existing Redis connection and `CAMPAIGN_NAMESPACE` are reused. No additional
service or client-side analytics key is required. Analytics stores only a random
first-party visitor identifier, aggregated page/referral counters and a five-minute
recent-activity window; it does not store visitor names, email addresses or raw IPs.

Sponsor drafts and the published sponsor are stored separately. The default is a
generic “Your Brand” placeholder until a draft is explicitly published. The manager
also stores the confirmed sponsorship amount and currency; it defaults to USD 0 and
should be changed only after an agreement is confirmed. Uploaded logos are limited
to validated PNG, WebP or restricted SVG files of at most 350 KB. The public website
loads the published sponsor configuration at request time, so publishing does not
require redesigning or rebuilding its sections.

## Preview review

1. Configure the Preview environment with a separate namespace and private test code.
2. Open the branch deployment. Before entering a code, only the gate should appear.
3. Enter the test code or use `/admin` to unlock the Preview namespace.
4. Open another browser or an incognito window. The proposal should be visible and
   the private offer form should accept a proposal without an invite code.
5. Test an offer using non-sensitive test details. The success reference identifies
   its database entry. Test offers stay in Preview; they are not production bids.
6. Review the mobile orbit, timeline, book movement and logo links, then approve
   the branch before merging into the production branch.

## Stored records

- `<namespace>:published`: original activation timestamp, with no expiry.
- `<namespace>:offer:<reference>`: a private JSON offer, with no expiry.
- `<namespace>:offer:<reference>:notification`: `sent` or `failed`, when available.
- `<namespace>:rate:*`: short-lived rate-limit counters, expiring after 15 minutes.

Use the provider dashboard to inspect offers. No public API exposes bidder details.
Choose a retention period and remove records when they are no longer needed.
Use durable storage with eviction disabled for these records; keep backups.
Use the `/admin` access control to re-lock the site. This does not erase offers.

## Reporting assets

The reporting timeline is an interactive preview of planned milestones, not a
claim of completed activity. Its cards currently contain report titles, not stock
photos. Supply Deepak's portrait and actual campaign photos to replace the final
branded panel and report covers. The BrandMyReach wordmark is used for site identity;
sponsor marks are loaded from the published sponsor configuration.

## Verification

Run `node --test tests/*.test.cjs` and `npm run build`. The tests use an
in-memory mock of Redis and mock email transport, never live credentials.
