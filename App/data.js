import fs from 'fs'
import { join, dirname, sep } from 'path'
import { fileURLToPath } from 'url'
import getDirname from './getPath.js'

const __dirname = getDirname()

class File {
  // layout = fs.readFileSync(join(__dirname, 'index.ejs'), { encoding: 'utf-8' })
  scssResetFile = '@import "../../node_modules/scss-reset/reset";'
  _createDir(dir) {
    const [, news] = dir.split(this.path)
    news.split(sep).reduce((dir, path) => {
      dir = join(dir, path)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir)
      return dir
    }, this.path)
  }
  _createFile(path, data = '') {
    this._createDir(path.split(sep).slice(0, -1).join(sep))
    // if (!force || fs.existsSync(path)) return
    fs.writeFileSync(path, data, { encoding: 'utf-8' })
  }
  _ejsFile(dir, path = '') {
    return `<%- contentFor('title') %>
${(path || dir).toUpperCase()}

<%- contentFor('init') %>
<link rel="stylesheet" href=".././../css/stylesheets/${dir}/${path || 'style'}.css">
<script src=".././../js/${dir}/${path || 'index'}.js" type="module" defer></script>

<%- contentFor('body') %>
<h1>${dir}/${path}</h1>`
  }
  _routeFile(dir, ...paths) {
    const a = [
      `import { Router } from 'express'
const router = Router()\n`,
      this._routePath(dir),
      ...paths.filter(i => i != 'index').map(i => this._routePath(dir, i)),
      `export default router`
    ].join('\n')
    return a
  }
  _routePath(dir, path = '') {
    return `router.route('/${path}').get((req, res) => {
  res.render('pages/${dir}/${path ? path : 'index'}')
})\n`
  }
  _clientJSFile(path) {
    return `console.log('${path.toUpperCase()}')`
  }
}
class Route extends File {
  constructor(path, dir) {
    super()
    // project/src 
    this.path = path
    this.dir = dir
  }
  _initRoute(route = '') {
    this._createFile(join(this.path, 'public', 'js', this.dir, `${route || 'index'}.js`), this._clientJSFile(route))
    this._createFile(join(this.path, 'scss', 'stylesheets', this.dir, `${route || 'style'}.scss`))
    this._createFile(join(this.path, 'views', 'pages', this.dir, `${route || 'index'}.ejs`), this._ejsFile(this.dir, route))
  }
  init(...routes) {
    this._initRoute()
    this._createFile(join(this.path, 'routes', `${this.dir}.js`), this._routeFile(this.dir, ...routes), true)
    this._createDir(join(this.path, 'public', 'imgs', this.dir))
    this._createFile(join(this.path, 'scss', 'stylesheets', this.dir, '_var.scss'))

    routes.forEach(route => this._initRoute(route))
  }

}
class App extends File {
  constructor(path) {
    super()
    // project/app/../src/
    this.path = join(__dirname, '../', path)
    this._createDir(this.path)
  }

  route(path, ...routes) {
    return new Route(this.path, path).init(...routes)
  }

  init() {
    // generate folder
    this._createDir(join(this.path, 'scss', 'stylesheets'))
    this._createDir(join(this.path, 'public', 'js'))
    this._createDir(join(this.path, 'public', 'imgs'))
    this._createDir(join(this.path, 'routes'))
    this._createDir(join(this.path, 'database'))
    this._createDir(join(this.path, 'views', 'pages'))
    this._createDir(join(this.path, 'views', 'partials'))

    // generate file
    this._createDir(join(this.path, 'views', 'layouts'))
    fs.copyFileSync(join(__dirname, 'layout.ejs'), join(this.path, 'views', 'layouts', 'layout.ejs'))
    fs.copyFileSync(join(__dirname, 'app.js'), join(this.path, 'app.js'))
    this._createFile(join(this.path, 'scss', 'reset.scss'), this.scssResetFile)

    return this
  }
}
const a = new App('src').init()

a.route('index')