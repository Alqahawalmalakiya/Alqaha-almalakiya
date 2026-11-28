# Royal Coffee Hospitality Loyalty — PWA v2

A **mobile-first Arabic RTL** customer-card and two-admin system for ضيافة القهوة الملكية. This replaces the earlier customer password flow with **private, revocable QR card links**.

## Admin workflow

1. Log in at the application root `/` using one of the two administrator Supabase Auth accounts.
2. Add a customer name, optional phone/contact and zero to six qualifying past events.
3. Download/share the generated **private QR** or copy the card URL.
4. Add qualifying occasions, correct individual points, and record the redemption of a two-coffee reward after six approved events.
5. If a link is exposed, rotate the card QR; rotation invalidates the previous link and existing push subscriptions.

## Customer workflow

- Open the private `/card#card=<64-hex-token>` link, see name, six-point progress, total events, and available reward; no customer login, account creation or password.
- A prominent installation callout appears in the browser. Browser and OS installation dialogs cannot be forced; iOS requires Share → Add to Home Screen.
- After installation a separate, explicit notification-permission action appears when push is configured. Separate marketing consent is optional.
- Link readers can **view the minimal card** but cannot modify points or redeem rewards. Anyone with a copy of the link can read the minimal card; share it privately.
- Some iOS installation flows isolate storage; if the installed app opens without its card, open the link again or paste it inside the app.

## Project layout

- `web/`: static Cloudflare Pages PWA for administrator and card reader.
- `edge/loyalty-card/index.ts`: independently deployed Supabase Edge Function, verified at gateway with a 256-bit private card token and service-role-only RPCs.
- `db/003_direct_card_links.sql`: additive migration already applied to separate loyalty Supabase project `qkretlvladsfnecnqyca` (not WebFrame).
- `worker/`: Cloudflare cron Web Push worker. **NOT YET DEPLOYED.**
- `tests/`: Node crypto, static validation, and HTTP mocked tests.

## Deployment

1. **Do not reapply** `db/001_initial.sql` or `db/003_direct_card_links.sql` to the already configured loyalty database.
2. The `loyalty-card` Supabase Edge Function was deployed and returned `ACTIVE` version 1. Its real device/browser endpoint must still be checked.
3. Upload `Royal_Coffee_Card_Pages_v2.zip` to a **dedicated Cloudflare Pages** app, or replace only the old loyalty Pages deployment. This archive contains web static assets at the ZIP root. Do not upload the full source ZIP to Pages.
4. Admin should log in at the root `/`. Customers should use their **private** QR URLs. Avoid creating any real customer until the updated Pages app is active and the Edge Function has been verified.
5. For notifications: generate VAPID keys with `npm run vapid`, configure `worker/wrangler.toml`, deploy the Worker with private secrets in Cloudflare only, set its Cron trigger, and set **only the public VAPID key** in `web/config.js`, then redeploy Pages. Notification delivery to devices remains **NOT TESTED**.
6. Cloudflare installation HTTPS URL and physical iPhone/Android push delivery remain unverified until external deployment and device tests.

## Test command

```bash
npm test
```

The present tests use Node 22 experimental TypeScript stripping for the Edge Function test module. Actual database privilege checks and smartphone tests are distinct and must not be claimed to pass based on this command.

## Security note

The Edge Function is unauthenticated at the HTTP gateway so it can accept a private card-token; it validates a random 256-bit capability before returning read-only minimal details. Protect those links like personal credentials. Admin RPCs require Supabase Auth and active server-side staff roles; the service-role key and VAPID private JWK must NEVER be embedded in the PWA or shared ZIP. This code is suitable for controlled testing, not a legal certification or a completed production security audit.
