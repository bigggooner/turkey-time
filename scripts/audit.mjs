// Compares this folder with the latest build and reports what is missing, changed or extra.
// Run it from the project folder:  node scripts/audit.mjs
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "scripts", "manifest.json"), "utf8"));
const SKIP = new Set(["node_modules", ".git", "pnpm-lock.yaml", "package-lock.json"]);

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(relative(root, full).split(sep).join("/"));
  }
  return out;
}
const show = (title, rows) => {
  console.log(`\n${title}: ${rows.length}`);
  rows.slice(0, 25).forEach((r) => console.log("  " + r));
  if (rows.length > 25) console.log(`  ...and ${rows.length - 25} more`);
};

console.log("Folder:      ", root);
console.log("Branch:      ", git("branch --show-current") || "(not a git repo)");
console.log("Last commit: ", git("log -1 --oneline") || "(none)");
show("Uncommitted changes", git("status --short").split("\n").filter(Boolean));

// Quick test of whether each turkey file is the newest version.
const MARKERS = {
  "static/index.html": 'data-act="strut"',
  "static/thanksgiving.css": "@property --spread",
  "static/thanksgiving.js": "documentLink",
};
console.log("\nTurkey files");
for (const [file, marker] of Object.entries(MARKERS)) {
  const full = join(root, file);
  const state = !existsSync(full) ? "MISSING" : readFileSync(full, "utf8").includes(marker) ? "NEW" : "OLD or edited";
  console.log(`  ${file.padEnd(26)} ${state}`);
}

const missing = [], changed = [], extra = [];
let same = 0;
for (const [file, [sum, size]] of Object.entries(manifest)) {
  const full = join(root, file);
  if (!existsSync(full)) {
    missing.push(file);
    continue;
  }
  const buf = readFileSync(full);
  if (sha(buf) === sum) same++;
  else changed.push(`${file}  (here ${buf.length} bytes, latest ${size})`);
}
for (const f of walk(root)) if (!(f in manifest) && f !== "scripts/manifest.json") extra.push(f);

console.log(`\nIdentical to the latest build: ${same} of ${Object.keys(manifest).length} files`);
show("Missing (in the latest build, not here)", missing);
show("Changed (differs from the latest build)", changed);
show("Extra (here, not in the latest build)", extra);
