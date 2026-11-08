# Phase 2: recommended CMS / admin dashboard

## Recommendation: Decap CMS (Git-based), on the existing Netlify site

Phase 2 needs non-technical staff to edit page content, add projects and stories, manage a media library, and show or hide sections. Decap CMS (formerly Netlify CMS) fits this build best.

**Why Decap**

- **It edits the files this site already uses.** Page copy is already in `src/_data/pages/*.json`, projects are in `src/projects/*.md`, and sections have `"show"` switches. Decap reads and writes exactly these files, so there is almost no content migration.
- **It is free and needs no server or database.** It is a single admin page at `lightlearntech.org/admin/`. Every save is a Git commit that triggers a Netlify rebuild, so the public site stays a fast, secure static site, which matters for low-cost Android phones.
- **It has the features Phase 2 needs:** form-based editing with field validation, a media library (uploads go to `src/assets/img/`, or to Cloudinary if preferred), list editing (activities, stages), drafts and an editorial review workflow, and show/hide toggles as boolean fields.
- **Full history:** every change is versioned in Git and can be rolled back.

**Trade-offs**

- Changes take about a minute to appear (the rebuild time).
- Login needs a Git provider. Netlify Identity is deprecated, so use either GitHub login (each editor needs a free GitHub account) or a hosted bridge such as DecapBridge for email and password logins.
- Image optimisation needs one extra step: either an Eleventy image plugin at build time, or a Cloudinary media library.

## Alternatives considered

| Option | Fit | Notes |
|---|---|---|
| **Decap CMS** | ✅ Best fit | Free, uses existing files, no hosting change |
| **Sanity** (headless) | Good | Excellent editor and media handling, generous free tier. Content moves to Sanity's cloud, so templates must fetch from its API at build time. Moderate migration effort. |
| **Strapi** (headless) | Possible | Self-hosted Node app plus database: needs a paid server, updates and backups. Too much running cost and maintenance for a small non-profit right now. |
| **WordPress** | Possible | Familiar to many people, but it means rebuilding the theme in PHP, paying for managed hosting, and keeping plugins up to date for security. It also tends to be slower on mobile data. |

## What migration to Decap involves (about 2–4 days of developer time)

1. **Add the admin page:** `src/admin/index.html` (loads Decap from a CDN) and `src/admin/config.yml`. Exclude `/admin/` from `robots.txt` and the sitemap.
2. **Describe the content in `config.yml`:**
   - a **files** collection for `site.json` and each `pages/*.json` (one form per page, mirroring the existing fields and `show` switches);
   - **folder** collections for `src/projects/` (fields: title, status [select], location, projectDate, summary, purpose, findings, activities [list], progress, media [image list]) and, later, `src/stories/`;
   - `focusAreas.json` and `pathway.json` as list widgets.
3. **Set up authentication:** a GitHub OAuth app (or DecapBridge), plus editor accounts.
4. **Media library:** set `media_folder: src/assets/img/uploads`, and add `@11ty/eleventy-img` so uploaded photos are automatically resized and converted to WebP/AVIF.
5. **Update security headers:** add the Decap CDN and the auth endpoint to the CSP for `/admin/*` only.
6. **New Phase 2 sections** (team, gallery, stories, impact statistics, partner logos): add each one as a Decap collection, a data file and a template using the existing components. Hidden sections simply aren't rendered.
7. **Train staff:** a 1-hour walkthrough plus a short editor guide covering the safeguarding rules for photos.

No changes are needed to page URLs, design or hosting.
