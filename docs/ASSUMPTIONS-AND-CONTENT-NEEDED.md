# Assumptions and content still needed

## Assumptions made

1. **Social media links, logo and registration number were not provided**, so they are left off the site. The footer and Contact page show social icons automatically once URLs are added to `src/_data/site.json`. The header uses a text wordmark ("LightLearnTech") with a simple open-book icon in brand colours. Replace it when a logo exists.
2. **The 70% literacy statistic was removed** because no source or year was given, as the brief instructed. The Challenge section was lightly reworded so it still reads naturally. To restore the statistic, fill in `challenge.statistic` (text, source and year) in `src/_data/pages/home.json`. It only appears when both the text and the source are filled in.
3. **Phone number** 09019072073 is shown in international format (+234 901 907 2073) for international funders, and the link dials +2349019072073.
4. **Brand colours:** primary blue `#1d4ed8`, purple `#6d28d9`, yellow `#facc15`, plus deep navy `#0b1f4d` for headings and dark bands. Yellow is only used behind dark text, so all text meets WCAG AA.
5. **Fonts:** Lexend (self-hosted, about 40 KB, for headings) and the phone's or computer's own system font for body text. This avoids external font requests and saves mobile data.
6. **Project status:** the brief lists Planned / Ongoing / Completed, but the AI Learning Assistant is "In development", so that status was added as a fourth option.
7. **Project fields:** "What we found" was added as an optional project field (`findings`), because Project 1's content needs it. Project 1's "What we are providing" uses the Activities field with a custom heading.
8. **Home page "Read more"** links to the Projects page, as specified. Each project also has its own detail page.
9. **Get Involved buttons:** "Volunteer" and "Partner with us" link to the matching sections of Get Involved. Each option card's button scrolls to its form.
10. **Forms** use Netlify Forms with email notifications to tomiolufolaji@gmail.com. Spam protection is a honeypot, Netlify's Akismet filtering and a light per-browser limit. True per-IP rate limiting would need a serverless function. This is documented in the README as the next step if spam appears.
11. **Privacy Policy** names Netlify (hosting and forms) and Google/Gmail (inbox) as processors. It commits to deleting form-provider copies at least every 30 days, keeping enquiry emails for up to two years, and responding to data requests within 30 days. It states there are no cookies or analytics. **These are draft commitments for the team to confirm**, which is why the page carries a "Draft for review" HTML comment.
12. **Safeguarding Statement** adds a line about calling 112 if a child is in immediate danger. Remove it if not wanted.
13. **No analytics** are included. The brief marked analytics as optional, and leaving them out keeps the "no cookies" privacy position simple.
14. **Copyright year** is set when the site is built, so it updates on the next deploy each year.
15. Small headings were added to give pages structure, e.g. "Displacement makes learning gaps harder to close", "Five connected areas of work", "Join us in opening doors for children", and the closing calls to action on inner pages. They contain no new claims, figures or names.

## Content still needed

- [ ] **Logo** (SVG preferred) if one is created.
- [ ] **Social media URLs** (Instagram, LinkedIn, X, Facebook), if accounts exist.
- [ ] **CAC registration number**, if registered.
- [ ] **Source and year for the foundational literacy statistic**, to restore it on the home page.
- [ ] **Photos** (equipment, textbooks, projectors, classrooms without identifiable children) for the image slots: home featured project, About "Our Story", and project media.
- [ ] **Project 1 date and progress update**, when confirmed.
- [ ] **Privacy Policy review**: confirm the retention periods and processors, ideally with a data protection adviser.
- [ ] **Code of conduct / full safeguarding policy**, if it should be downloadable from the Safeguarding page.
- [ ] Optionally, a **dedicated organisational email** (e.g. hello@lightlearntech.org) instead of a personal Gmail address. This looks more credible to funders and keeps safeguarding reports in an organisational inbox.
