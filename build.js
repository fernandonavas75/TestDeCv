import path from 'path'
const VIEWS_DIR = path.join(__dirname, 'views')
const PUBLIC_DIR = path.join(__dirname, 'public')
const DATA_DIR = path.join(__dirname, 'data')


const site = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'site.json'), 'utf8'))
const projects = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'projects.json'), 'utf8'))


await fs.emptyDir(DOCS_DIR)
await fs.copy(PUBLIC_DIR, DOCS_DIR)


async function renderPage(bodyTpl, outName, locals = {}) {
const body = await ejs.renderFile(path.join(VIEWS_DIR, bodyTpl), { site, projects, ...locals }, { async: true })
const html = await ejs.renderFile(path.join(VIEWS_DIR, 'layout.ejs'), { site, body }, { async: true })
await fs.outputFile(path.join(DOCS_DIR, outName), html, 'utf8')
}


await renderPage('index.body.ejs', 'index.html')
await renderPage('projects.body.ejs', 'projects.html')
await renderPage('experience.body.ejs', 'experience.html')
await renderPage('contact.body.ejs', 'contact.html')


console.log('Build listo en /docs')