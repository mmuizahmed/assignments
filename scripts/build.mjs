import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

function run(command, cwd) {
  execSync(command, { cwd, stdio: "inherit", shell: true });
}

function copyStatic(name) {
  fs.cpSync(path.join(root, "assignment", name), path.join(dist, "assignment", name), { recursive: true });
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "assignment"), { recursive: true });

run("npm install", path.join(root, "assignment", "shop-co"));
run("npm run build", path.join(root, "assignment", "shop-co"));

run("npm install", path.join(root, "assignment", "saylani-lms"));
run("npm run build", path.join(root, "assignment", "saylani-lms"));

run("npm install", path.join(root, "assignment", "berry-dashboard"));
run("npm run build", path.join(root, "assignment", "berry-dashboard"));

fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(root, "logos.png"), path.join(dist, "logos.png"));
fs.cpSync(path.join(root, "security"), path.join(dist, "security"), { recursive: true });

fs.copyFileSync(path.join(root, "assignment", "index.html"), path.join(dist, "assignment", "index.html"));
fs.copyFileSync(path.join(root, "assignment", "style.css"), path.join(dist, "assignment", "style.css"));

for (const folder of ["html", "css", "javascript", "amazon", "budget", "furniro", "marketing", "nasa"]) {
  copyStatic(folder);
}

fs.cpSync(path.join(root, "assignment", "shop-co", "dist"), path.join(dist, "assignment", "shop-co"), { recursive: true });
fs.cpSync(path.join(root, "assignment", "saylani-lms", "dist"), path.join(dist, "assignment", "saylani-lms"), { recursive: true });
fs.cpSync(path.join(root, "assignment", "berry-dashboard", "out"), path.join(dist, "assignment", "berry-dashboard"), { recursive: true });

console.log("Site assembled in dist/");
