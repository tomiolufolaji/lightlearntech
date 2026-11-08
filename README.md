# LightLearnTech website (Phase 1)

Static website for **LightLearnTech Initiative**, built with [Eleventy](https://www.11ty.dev/) and hosted on Netlify.
All page copy lives in JSON and Markdown files, kept apart from the layout code, so it can move into a CMS in Phase 2.

- Live domain: https://lightlearntech.org
- Phase 2 CMS recommendation: [docs/PHASE-2-CMS.md](docs/PHASE-2-CMS.md)
- Assumptions and content still needed: [docs/ASSUMPTIONS-AND-CONTENT-NEEDED.md](docs/ASSUMPTIONS-AND-CONTENT-NEEDED.md)

---

## 1. Run, build and deploy

You need **Node.js 20 or newer**.

```bash
npm install        # once
npm start          # local preview with live reload at http://localhost:8080
npm run build      # production build into _site/
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run images` | Compresses photos placed in `photos-originals/` into WebP + JPEG at 800px and 1600px (see §5) |
| `npm run brand` | Regenerates the social share card and PNG icons from `src/static/favicon.svg` |

> Forms only send email once the site is deployed on Netlify. Locally they will show an error when submitted.

### Deploy to Netlify (first time)

1. Put this folder in a GitHub (or GitLab) repository.
2. In Netlify: **Add new site → Import an existing project** and choose the repository. The build settings come from `netlify.toml` (`npm run build`, publish `_site`).
3. **Domain:** Site configuration → Domain management → add `lightlearntech.org` (and `www.lightlearntech.org`). Follow Netlify's DNS instructions. HTTPS certificates are issued automatically. `www` redirects to the main domain.
4. **Forms:** Site configuration → Forms → **Enable form detection**, then redeploy. You should see three forms: `volunteer`, `partner`, `contact`.
5. **Email delivery:** Site configuration → Notifications → Emails and webhooks → **Form submission notifications** → add an email notification to `tomiolufolaji@gmail.com` for *Any form*.
6. Send one test submission from each form on the live site and confirm the emails arrive. The subject line comes from the hidden `subject` field, e.g. `Contact form – LightLearnTech website (Support)`.

After that, every push to the main branch rebuilds and redeploys automatically.

### Security

`netlify.toml` sets HTTPS-only (HSTS), a strict Content-Security-Policy (no third-party scripts, styles, fonts or frames), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`. There is no admin login in Phase 1.
If you ever add an external script (for example analytics), add its domain to the CSP in `netlify.toml` **and** update the Privacy Policy.

---

## 2. Where the content lives

All text a non-developer might change is in `src/_data/` (JSON) or in Markdown files. Layout code is in `src/_includes/` and the page templates in `src/*.njk`. You do not need to touch those to change wording.

| Page | URL | Content file(s) | Template |
|---|---|---|---|
| Site-wide (name, tagline, contact details, social links, registration number, menu, footer links) | all pages | `src/_data/site.json` | `src/_includes/components/header.njk`, `footer.njk` |
| Home | `/` | `src/_data/pages/home.json`, `src/_data/focusAreas.json`, `src/_data/pathway.json` (`summary`) | `src/index.njk` |
| About Us | `/about/` | `src/_data/pages/about.json` | `src/about.njk` |
| What We Do | `/what-we-do/` | `src/_data/pages/whatWeDo.json`, `src/_data/focusAreas.json` | `src/what-we-do.njk` |
| Our Programme | `/our-programme/` | `src/_data/pages/programme.json`, `src/_data/pathway.json` (`full`) | `src/our-programme.njk` |
| Projects (list) | `/projects/` | `src/_data/pages/projects.json` | `src/projects.njk` |
| Project pages | `/projects/<file-name>/` | `src/projects/*.md` (one file per project) | `src/_includes/layouts/project.njk` |
| Get Involved | `/get-involved/` | `src/_data/pages/getInvolved.json`, forms in `src/_data/forms.json` | `src/get-involved.njk` |
| Contact | `/contact/` | `src/_data/pages/contact.json`, `src/_data/forms.json`, details in `site.json` | `src/contact.njk` |
| Privacy Policy | `/privacy-policy/` | `src/legal/privacy-policy.md` | `src/_includes/layouts/legal.njk` |
| Safeguarding Statement | `/safeguarding/` | `src/legal/safeguarding.md` | `src/_includes/layouts/legal.njk` |
| 404 page | any unknown URL | `src/404.njk` | |
| Form “thank you” page (used only without JavaScript) | `/thank-you/` | `src/thank-you.njk` | |

Each page's **search title and description** are in the `meta` block of its JSON file (or the `metaTitle` / `metaDescription` front matter in Markdown files). The share image is `src/assets/img/share-card.png`.

Most homepage sections have a `"show": true` switch in `home.json`. Set it to `false` to hide a section.

**Reusable components** live in `src/_includes/components/ui.njk`: `hero`, `sectionHead`, `card`, `projectCard`, `status`, `imageSlot`, `pathwaySummary`, `pathwayFull`, `ctaBand` and `form`. Styles are in `src/assets/css/main.css` (colour tokens at the top). The JavaScript, `src/assets/js/main.js`, only adds the mobile menu, form validation and in-page form success messages. The site works without it.

---

## 3. Add a new project

1. Copy `src/projects/idp-camp-education-initiative.md` and rename it, e.g. `src/projects/school-robotics-club.md`. The file name becomes the URL: `/projects/school-robotics-club/`.
2. Edit the fields at the top:

```yaml
title: School Robotics Club
order: 3                      # position in the list
icon: bot                     # any icon name from https://lucide.dev/icons
status: Planned               # Planned | Ongoing | Completed | In development
location: Makurdi, Benue State, Nigeria
projectDate: "January 2027"
summary: One or two sentences for the project card.
purpose: Why the project exists.
findings: ""                  # optional "What we found" paragraph
activitiesHeading: Activities
activities:
  - First activity
  - Second activity
progress: ""
media: []                     # photos, see §5
description: Sentence used for search engines and social sharing.
```

3. Any field left empty (`""` or `[]`) is not shown. You can also write extra paragraphs in Markdown below the closing `---`.
4. Save, commit and push. The project appears on `/projects/` automatically.

To change which project is featured on the home page, set `featuredProject.projectSlug` in `src/_data/pages/home.json` to the project's file name (without `.md`).

---

## 4. Change contact details, social links or registration number

Edit `src/_data/site.json`:

```json
"contact": {
  "email": "tomiolufolaji@gmail.com",
  "phoneDisplay": "+234 901 907 2073",
  "phoneHref": "+2349019072073"
},
"registrationNumber": "",
"social": { "instagram": "", "linkedin": "", "x": "", "facebook": "" }
```

- Leave a value empty (`""`) and it disappears from the site. Fill in a full URL (e.g. `"https://www.instagram.com/…"`) and the icon appears in the footer and on the Contact page.
- The registration number appears in the footer once filled in.
- The email is also used in the Privacy Policy and Safeguarding Statement automatically.
- **If the contact email changes**, also update the email notification in Netlify (§1, step 5).

---

## 5. Photos and image slots

Phase 1 uses illustrations and icons only. **Image slots** are marked in the HTML with comments such as `<!-- IMAGE SLOT: About – Our Story … -->`. Until a photo is added, each slot shows a decorative brand panel.

To add a photo:

1. Make sure it follows the Safeguarding Statement: no identifiable children without recorded guardian consent, and never with names or exact locations.
2. Put the original file in `photos-originals/` and run `npm run images`. Compressed WebP and JPEG versions appear in `src/assets/img/photos/`, and the command prints the width and height.
3. Reference it in the slot's content field (`photo` in `home.json` / `about.json`, or `media` in a project file):

```json
"photo": { "file": "textbooks-delivery", "alt": "Boxes of new Mathematics textbooks", "width": 1600, "height": 1067 }
```

Photos are lazy-loaded, use WebP with a JPEG fallback, and are served at the right size for the screen.

---

## 6. Forms and spam protection

- All three forms are defined in `src/_data/forms.json` (labels, options, required fields, success messages and email subject line) and rendered by the `form` component.
- Submissions go to **Netlify Forms**, which emails them to the contact address. Nothing is stored on the website itself. Netlify keeps a copy in its dashboard: **delete these at least every 30 days** (Forms → select form → delete submissions), as the Privacy Policy commits to.
- Spam protection: a hidden **honeypot** field (`bot-field`; submissions that fill it are discarded), Netlify's built-in **Akismet spam filtering**, and a light per-visitor limit of one submission per form every 30 seconds. If spam becomes a problem, add Netlify's reCAPTCHA (`data-netlify-recaptcha="true"`) or move to a serverless function with Cloudflare Turnstile and IP rate limiting.
- With JavaScript on, errors are shown next to each field with a summary at the top, and a success message replaces the form. Without JavaScript, the browser's own validation applies and the visitor lands on `/thank-you/`.
- The Support button on Get Involved links to `/contact/?enquiry=Support#contact-form`, which pre-selects "Support". Any option can be pre-selected the same way.

---

## 7. Hosting recommendation

**Netlify (free Starter plan)** is recommended:

- Free hosting for a site of this size, global CDN (fast for Nigerian mobile users and international funders), automatic HTTPS, and automatic deploys from Git.
- Built-in form handling with email notifications and spam filtering, so no server or paid form service is needed. Check Netlify's current free-tier form limits. If volumes grow, a paid plan or a different form backend can be added without changing the design.
- **Phase 2 fit:** a Git-based CMS (recommended: Decap CMS, see [docs/PHASE-2-CMS.md](docs/PHASE-2-CMS.md)) runs on the same host at `/admin/`, edits these same JSON and Markdown files, and triggers a rebuild on every save. No database or new hosting is needed.

Cloudflare Pages is a good free alternative, but it has no built-in form handling, so forms would need a small Pages Function plus an email-sending service.

---

## 8. Quality checks performed

- Built pages checked at **360px, 768px and 1280px**: no horizontal scrolling on any page. Mobile menu tested (opens, closes, closes with Escape).
- Forms tested end to end against a local mock: required-field errors and the error summary, email format errors, the success message, the Support pre-fill, and the email subject including the form name.
- Lighthouse (mobile, simulated slow 4G, run locally): **Accessibility 100, Best Practices 100, SEO 100** on all pages tested. **Performance 90–100** on the inner pages. The home page scored **86–99** across runs on the test machine; the variation came from the machine, and the page weight did not change between runs. Re-run PageSpeed Insights on the live site, where Netlify's compression and CDN apply.
- Page weight is about 100 KB per page (one 40 KB font, no images to download, about 5 KB of JavaScript).
