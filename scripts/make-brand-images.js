// Generates the social share card and PNG icons from SVG.
// Run with `npm run brand` after changing the name, tagline or mark. Output is committed.
import sharp from "sharp";
import fs from "node:fs";

const mark = fs.readFileSync("src/static/favicon.svg", "utf8");

const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b1f4d"/>
  <circle cx="1090" cy="70" r="230" fill="#16307a"/><circle cx="1050" cy="120" r="64" fill="#facc15"/>
  <circle cx="120" cy="620" r="260" fill="#7c3aed" opacity=".35"/>
  <circle cx="1010" cy="520" r="120" fill="#1d4ed8" opacity=".6"/>
  <g transform="translate(96 150) scale(2.6)">${mark.replace(/<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="96" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="84" font-weight="700" fill="#ffffff">LightLearnTech</text>
  <text x="96" y="420" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="600" fill="#facc15">Education. Technology. Opportunity.</text>
  <text x="96" y="500" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#d9dff0">Reforming and Enhancing Futures through Technology and Education</text>
</svg>`;

fs.mkdirSync("src/assets/img", { recursive: true });
await sharp(Buffer.from(share)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile("src/assets/img/share-card.png");

const icon = (size, file, pad = 0) =>
  sharp(Buffer.from(mark), { density: 72 * (size / 40) * 1.2 })
    .resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(file);

await icon(32, "src/static/favicon-32.png");
await icon(180, "src/static/apple-touch-icon.png", 14);
await icon(512, "src/static/icon-512.png", 40);
console.log("Brand images written.");
