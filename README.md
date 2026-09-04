# athang-kali

Personal portfolio, built as a working VS Code style editor. Every section is a
"file" in the workspace, with a real command palette, terminal, minimap and
theme switcher.

Live: https://www.athangkali.me

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Live statistics

LeetCode and GitHub numbers are never hardcoded. They refresh at two levels.

**At build time.** `scripts/sync-stats.mjs` pulls them into
`lib/live-stats.json`:

```bash
npm run sync
```

It runs as part of `build`, so the server rendered HTML always ships correct
numbers for SEO and for the first paint. If an API call fails, the previous
committed value for that source is kept, so a flaky network can never break a
build.

**At runtime.** A build time snapshot alone would freeze the LeetCode count
until the next deploy, so `app/api/stats/route.ts` refetches both APIs and the
client swaps the numbers in on mount. The route is an ISR endpoint with
`revalidate = 1800`, so LeetCode and GitHub see at most one round of calls
every 30 minutes no matter how much traffic arrives. Any source that fails
falls back to its build time value, so the payload is always complete.

`lib/use-site-data.ts` is the client half: one fetch per page load however many
components subscribe, the baked snapshot as both the server and first client
render so hydration matches exactly, and a silent fall back to that snapshot if
the fetch fails. Stale numbers beat a broken pane.

`GET /api/stats` reports which sources were live and which fell back:

```json
{ "sources": { "leetcode": "live", "kubernetes-sigs/headlamp": "live" },
  "complete": true }
```

Every number on the site is built by one of the small builder functions at the
bottom of `lib/ide-data.ts`. The exported constants are those builders applied
to the baked snapshot; `derive()` applies the same builders to the live payload.
Add a number in one place and both paths pick it up.

**Optional but recommended on Vercel:** set `GITHUB_TOKEN` (a classic token with
no scopes is enough) in the project's environment variables. Unauthenticated
GitHub search is rate limited to 10 requests a minute and shared across all of
Vercel's build IPs, so without a token the sync will sometimes fall back to the
committed values instead of refreshing.

## Contact form

Submissions go to Web3Forms from the browser. Configuration lives in
`.env.production` (committed, since the access key is public by design and
`NEXT_PUBLIC_*` is inlined into the bundle regardless):

```
NEXT_PUBLIC_CONTACT_ENDPOINT=https://api.web3forms.com/submit
NEXT_PUBLIC_WEB3FORMS_KEY=<key>
```

Two implementation notes:

- The request is sent as `FormData`, not JSON. A JSON content-type triggers a
  CORS preflight and Web3Forms answers `OPTIONS` with a 403, so the request
  would never leave the browser. `multipart/form-data` is a simple request and
  skips the preflight.
- Web3Forms' free tier only accepts requests from the client, not from a
  server, so this cannot be proxied through an API route without their Pro plan.

If a send fails for any reason the form offers a mailto fallback with the
message already composed, so a visitor is never stranded.

To switch providers, point `NEXT_PUBLIC_CONTACT_ENDPOINT` at something else and
drop `NEXT_PUBLIC_WEB3FORMS_KEY`. Formspree works unchanged:

```
NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/<form-id>
```

## Social card

`app/opengraph-image.tsx` and `app/twitter-image.tsx` both render
`lib/og-card.tsx` to a 1200x630 PNG at build time, which is what LinkedIn,
WhatsApp, Slack, X and the rest show when the link is shared. Nothing on the
site itself uses it.

The card reads from `lib/ide-data.ts`, so the name, roles, mentorship line and
the four statistics can never drift from the site. The stats sync runs before
the build, so the numbers in the image are as fresh as the deploy.

Fonts are committed under `assets/` as **woff**, deliberately:

- Satori, which renders the card, cannot parse woff2, so the files `next/font`
  already downloads are unusable here.
- Fetching from Google Fonts during the build would make deploys depend on a
  third party being reachable.

To change the design, edit `lib/og-card.tsx` and rebuild. Satori supports a
subset of CSS: flexbox only, and any element with more than one child needs an
explicit `display`, which is why the interpolated strings in that file are
single template literals rather than several adjacent expressions.

## Themes

Nine themes, six dark and three light, each redefining the same token contract
in `app/globals.css`. A first visit follows the reader's OS preference; after
that the choice persists in `localStorage`.

Every theme's `--dim`, `--gcm` and `--text` are tuned to clear WCAG AA against
that theme's own `--bg`, and `--on-accent` is picked per theme, because white
text fails on the pastel accents used by Catppuccin, Nord and Gruvbox. Hover and
selection washes go through `--hover`, `--active` and `--strong` rather than
hardcoded white, which would vanish on a light background.

## Keyboard

`Ctrl K` or `Ctrl P` command palette · `Ctrl /` shortcut list · `Ctrl B` sidebar
· `Ctrl \`` terminal · `Ctrl I` assistant · `Ctrl W` close tab · `Ctrl 1..9`
open a file · `Ctrl +/-/0` text size

The terminal is real. Type `help`.

## Layout

```
app/            shell, layout, 404
components/ide/ chrome, sidebar, panes, terminal, palette, assistant, minimap, cursor
lib/ide-data.ts all content, plus derived live stats
lib/live-stats.json  generated, do not edit by hand
scripts/        the stats sync
```

Content lives entirely in `lib/ide-data.ts`. Editing that file is enough to
update the whole site.
