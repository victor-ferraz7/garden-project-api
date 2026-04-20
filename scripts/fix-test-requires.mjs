import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
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
  c = c.replace(/require\("((?:\.\.\/)+)src\/([^"]+)"\)/g, (full, dots, p) => {
    if (p.endsWith(".ts")) return full;
    return `require("${dots}src/${p}.ts")`;
  });
  writeFileSync(f, c);
}
console.log("patched requires in tests");
