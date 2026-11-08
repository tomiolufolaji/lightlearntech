// Eleventy configuration for the LightLearnTech website.
// Layout code lives in src/_includes; all copy lives in src/_data (JSON)
// and in Markdown files (projects, legal pages). See README.md.
import fs from "node:fs";
import path from "node:path";

const ICON_DIR = path.resolve("node_modules/lucide-static/icons");
const iconCache = new Map();

// Inline a Lucide line icon. Decorative by default (aria-hidden).
function icon(name, className = "icon") {
  if (!iconCache.has(name)) {
    const file = path.join(ICON_DIR, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Unknown icon: ${name}`);
    const raw = fs
      .readFileSync(file, "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s*\n\s*/g, " ")
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .trim();
    iconCache.set(name, raw);
  }
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconCache.get(name)}</svg>`;
}

export default function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/lexend/files/lexend-latin-wght-normal.woff2":
      "assets/fonts/lexend-latin-wght.woff2",
  });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addShortcode("icon", icon);
  eleventyConfig.addNunjucksGlobal("iconSvg", icon);

  // Projects collection: one Markdown file per project, ordered by `order`
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  eleventyConfig.addFilter("findBySlug", (items, slug) =>
    (items || []).find((p) => p.fileSlug === slug)
  );

  // Slugify helper for anchor ids
  eleventyConfig.addFilter("anchor", (str) =>
    String(str)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );

  // Turn a status into a CSS modifier
  eleventyConfig.addFilter("statusClass", (s) =>
    "status--" + String(s || "").toLowerCase().replace(/\s+/g, "-")
  );

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());
  eleventyConfig.addGlobalData("buildDate", () => new Date().toISOString().slice(0, 10));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
}
