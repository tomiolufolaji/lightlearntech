// Compresses real photos for the site.
// 1. Put original JPG/PNG files in photos-originals/ (this folder is not published).
// 2. Run `npm run images`.
// 3. Each photo is written to src/assets/img/photos/ as <name>-800 and <name>-1600 in .webp and .jpg.
// 4. Reference it in content as { "file": "<name>", "alt": "…", "width": 1600, "height": … }.
// Reminder: no identifiable photos of children without recorded guardian consent (see Safeguarding Statement).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "photos-originals";
const OUT = "src/assets/img/photos";
fs.mkdirSync(OUT, { recursive: true });

const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
if (!files.length) console.log(`No photos found in ${SRC}/`);

for (const f of files) {
  const name = path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  for (const width of [800, 1600]) {
    const img = sharp(path.join(SRC, f)).rotate().resize({ width, withoutEnlargement: true });
    await img.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${width}.webp`));
    await img.clone().jpeg({ quality: 74, mozjpeg: true }).toFile(path.join(OUT, `${name}-${width}.jpg`));
  }
  const meta = await sharp(path.join(OUT, `${name}-1600.jpg`)).metadata();
  console.log(`${name}: width ${meta.width}, height ${meta.height}`);
}
