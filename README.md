# Sutrayaan sites

Websites built by Sutrayaan. Each top-level folder is one static site, deployed on Render.

| Folder | Site | Industry | Address |
|---|---|---|---|
| `meru/` | Meru Precision Components | CNC machining, Thane | meru.sutrayaan.com |
| `polyvasa/` | Polyvasa Moulding Works | Plastic injection moulding, Vasai | polyvasa.sutrayaan.com |
| `orvella/` | Orvella Fine Chemicals | Specialty chemicals, Taloja MIDC | orvella.sutrayaan.com |
| `boxworks/` | Bhiwandi Boxworks | Corrugated packaging, Bhiwandi | boxworks.sutrayaan.com |

All companies are fictional demos. Photos are from Unsplash (free licence).

## The framework (`_framework/`)

Every site after Meru is generated from one settings file:

```
_framework/
  build.py           builds sites: python3 _framework/build.py [name]
  template.html.j2   page structure (home, products, quality, about, quote, tracker)
  app.js             navigation, quote form, inquiry tracker
  extra.css          extra components (bar scale, COA, dieline)
  sites/<name>.py    one file per company: content, colours, fonts, photos, form fields
```

The design system (layout CSS and motion) is read from `meru/index.html`, so fixes there flow to every site on the next build.

**New site:** copy a file in `_framework/sites/`, change the content, run `python3 _framework/build.py <name>`, commit, then create a Render static site with publish directory `<name>`.

## Quote form and tracker (`apps-script/Code.gs`)

One Google Sheet collects inquiries from every site (column **Site** says which), emails the owner, and serves each site's tracker. After changing `Code.gs`: Apps Script → **Deploy → Manage deployments → Edit → Version: New version → Deploy** (the URL stays the same).
