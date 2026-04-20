import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function walk(d, files = []) {
  for (const n of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, n.name);
    if (n.isDirectory()) walk(p, files);
    else if (n.name.endsWith(".test.ts")) files.push(p);
  }
  return files;
}

for (const f of walk("tests")) {
  let c = readFileSync(f, "utf8");
  c = c.replace(/require\("((?:\.\.\/)+)src\/([^"]+)\.ts"\)/g, 'require("$1dist/$2.js")');
  writeFileSync(f, c);
}
console.log("tests now require dist/*.js (run npm run build before vitest)");
