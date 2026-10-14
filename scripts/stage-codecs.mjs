import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const destination = path.join(root, "public", "codecs");
const packages = ["avif", "jpeg", "oxipng", "png", "webp"];

rmSync(destination, { recursive: true, force: true });
mkdirSync(path.join(destination, "vendor"), { recursive: true });

for (const name of packages) {
  const source = path.join(root, "node_modules", "@jsquash", name);
  cpSync(source, path.join(destination, name), {
    recursive: true,
    filter: (file) => {
      const base = path.basename(file);
      if (base === "node_modules" || base.endsWith(".map") || base.endsWith(".md")) return false;
      return true;
    },
  });
}

cpSync(
  path.join(root, "node_modules", "wasm-feature-detect", "dist", "esm", "index.js"),
  path.join(destination, "vendor", "wasm-feature-detect.js"),
);

const bareImport = "from 'wasm-feature-detect'";
const runtimeImport = "from '../vendor/wasm-feature-detect.js'";

function rewrite(directory) {
  for (const entry of readdirSync(directory)) {
    const file = path.join(directory, entry);
    if (statSync(file).isDirectory()) {
      rewrite(file);
      continue;
    }
    if (!file.endsWith(".js")) continue;
    const source = readFileSync(file, "utf8");
    if (!source.includes(bareImport)) continue;
    writeFileSync(file, source.replaceAll(bareImport, runtimeImport));
  }
}

rewrite(destination);
console.log("Staged image codecs in public/codecs");
