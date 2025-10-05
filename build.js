// build.js (ESM) — genera HTML estático en /docs para GitHub Pages
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas base
const DOCS_DIR   = path.join(__dirname, "docs");
const VIEWS_DIR  = path.join(__dirname, "views");
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR   = path.join(__dirname, "data");

// Cargar datos
const site     = JSON.parse(await fs.readFile(path.join(DATA_DIR, "site.json"), "utf8"));
const projects = JSON.parse(await fs.readFile(path.join(DATA_DIR, "projects.json"), "utf8"));

// Limpiar/copiar assets
await fs.emptyDir(DOCS_DIR);
await fs.copy(PUBLIC_DIR, DOCS_DIR);

// Render de páginas
async function renderPage(bodyTpl, outName, locals = {}) {
  const body = await ejs.renderFile(path.join(VIEWS_DIR, bodyTpl), { site, projects, ...locals }, { async: true });
  const html = await ejs.renderFile(path.join(VIEWS_DIR, "layout.ejs"), { site, body }, { async: true });
  await fs.outputFile(path.join(DOCS_DIR, outName), html, "utf8");
}

// Construir todas las vistas
await renderPage("index.body.ejs",      "index.html");
await renderPage("projects.body.ejs",   "projects.html");
await renderPage("experience.body.ejs", "experience.html");
await renderPage("contact.body.ejs",    "contact.html");

// Desactivar Jekyll en GitHub Pages
await fs.outputFile(path.join(DOCS_DIR, ".nojekyll"), "");

// Listo
console.log("Build listo en /docs");
