import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

function addFile(path, data = '') {
  if (!fs.existsSync(path)) return fs.appendFileSync(path, data)
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

const layout = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%- defineContent('title') %></title>

  <link rel="stylesheet" href=".././../css/reset.css">
  <script src="/socket.io/socket.io.js" defer></script>
  <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js" defer type="module"></script>

  <%- defineContent('init') %>
</head>
<body>
  <%- body %>
</body>
</html>
`
const indexJSData = dir => `const socket = io()
console.log('${dir.toUpperCase()}')`
function createDir(dir, file, data) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  addFile(join(dir, file), data)
}
function checkFolder(path) {
  const dir = join(path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

function initProject() {
  checkFolder(join(__dirname, 'controllers'))

  checkFolder(join(__dirname, 'scss'))
  checkFolder(join(__dirname, 'scss', 'stylesheets'))
  addFile(join(__dirname, 'scss', 'reset.scss'), `@import "../../node_modules/scss-reset/reset";`)

  checkFolder(join(__dirname, 'public'))
  checkFolder(join(__dirname, 'public', 'js'))
  checkFolder(join(__dirname, 'public', 'imgs'))

  checkFolder(join(__dirname, 'views'))
  checkFolder(join(__dirname, 'views', 'pages'))
  checkFolder(join(__dirname, 'views', 'layouts'))
  checkFolder(join(__dirname, 'views', 'partials'))
  addFile(join(__dirname, 'views', 'layouts', 'layout.ejs'), layout)
}
function createFile(dir) {
  if (!dir) return
  initProject()
  let dirs = fs.readdirSync(__dirname)
  for (const link of dirs) {
    const file = join(__dirname, link)
    if (!(fs.lstatSync(file)).isDirectory()) continue
    if (link == 'controllers') {
      addFile(join(file, dir + '.js'), controllerData(dir))
      continue
    }
    if (link == 'public') {
      createDir(join(file, 'js', dir), 'index.js', indexJSData(dir))
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
createFile('index')