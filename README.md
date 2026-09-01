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

LeetCode and GitHub numbers are not hardcoded. `scripts/sync-stats.mjs` pulls
them into `lib/live-stats.json`:

```bash
npm run sync
```

It also runs automatically as `prebuild`, so every deploy ships fresh numbers.
If an API call fails the previous committed values are kept, so a flaky network
can never break a build.

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
