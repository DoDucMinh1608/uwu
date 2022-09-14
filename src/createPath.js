import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

function addFile(path, data) {
  fs.writeFileSync(path, data, { encoding: 'utf-8' })
}
const controllerData = dir => `import { Router } from 'express'
  const router = Router()

  router.route('/').get((req, res) => {
    res.render('pages/${dir}/index')
  })
  export default router`
const scssData = `body {
  width: 100vw;
  height: 100vh;
  background-color: black;
  color: white;
  overflow: hidden;
}`
const ejsData = dir => `<%- contentFor('title') %>
${dir.toUpperCase()}
<%- contentFor('init') %>
<link rel="stylesheet" href=".././../css/stylesheets/${dir}/style.css">
<script src=".././../js/${dir}/index.js" type="module" defer></script>

<%- contentFor('body') %>
<h1>${dir}</h1>`
function createDir(dir, file, data) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  addFile(join(dir, file), data)
}
function createFile(dir) {
  if (!dir) return
  const dirs = fs.readdirSync(__dirname)
  for (const link of dirs) {
    const file = join(__dirname, link)
    if (!(fs.lstatSync(file)).isDirectory()) continue
    if (link == 'controllers') {
      addFile(join(file, dir + '.js'), controllerData(dir))
      continue
    }
    if (link == 'public') {
      createDir(join(file, 'js', dir), 'index.js', '')
      fs.mkdirSync(join(file, 'imgs', dir))
      continue
    }
    if (link == 'scss') {
      createDir(join(file, 'stylesheets', dir), 'style.scss', scssData)
      continue
    }
    if (link == 'views') {
      createDir(join(file, 'pages', dir), 'index.ejs', ejsData(dir))
      continue
    }
  }
}

createFile('account')