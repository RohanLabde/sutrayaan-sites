# Sutrayaan sites

Websites built by Sutrayaan. Each folder is one static site, deployed on Render.

| Folder | Site | Address |
|---|---|---|
| `meru/` | Meru Precision Components (demo, fictional company) | meru.sutrayaan.com |
| `apps-script/` | Google Apps Script that saves quote requests to a Google Sheet and emails the owner | — |

## Deploying a site

Render static site settings: **Publish directory** = the site's folder (e.g. `meru`), **Build command** = none. Every push to `main` redeploys automatically.

## Connecting the quote form

1. Create a Google Sheet, open **Extensions → Apps Script**, paste `apps-script/Code.gs`, save.
2. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Authorise.
3. Copy the web app URL (ends in `/exec`) and set it as `window.MERU_API` at the top of `meru/index.html`.
