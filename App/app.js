const { readFileSync, existsSync, writeFileSync, mkdirSync } = require('fs')
const { join, sep, dirname } = require('path')
class File {
  // relative path
  constructor(path) {
    this.path = join(__dirname, path) // project absolute dir
    // this._makeDir(path)
    this.projectDir = this.path.split(sep).at(-1)
  }
  // relative path
  _makeDir(dir = '') {
    const dirs = join(dir).split(sep)
    dirs.reduce((main, dir) => {
      const path = join(main, dir)
      if (!existsSync(path)) mkdirSync(path)
      return path
    }, this.path)
  }
  _makeFile(path, data, force = true) {
    this._makeDir(dirname(path))
    const dir = join(this.path, path)
    if (!force && existsSync(dir)) return
    writeFileSync(dir, data, { encoding: 'utf-8' })
  }
}
class RouteTemplate extends File {
  constructor(path, { sta = 'public', scss = 'scss', views = 'views', database = 'database', route = 'routes' }) {
    super(path)
    this.static = sta
    this.route = route
    this.scss = scss
    this.views = views
    this.databse = database
  }
  ejsTemplate = readFileSync(join(__dirname, 'static_file', 'layout.ejs'))
  expressApp = readFileSync(join(__dirname, 'static_file', 'expressApp.js'))
  resetScss = readFileSync(join(__dirname, 'static_file', 'reset.scss'))
  addNamespace(namespace) {
    return name => name || namespace
  }
  jsNamespace = this.addNamespace('index')
  cssNamespace = this.addNamespace('style')
  _ejsFile(path, route = '') {
    return `<%- contentFor('title') %>
${(route || path).toUpperCase()}

<%- contentFor('init') %>
<link rel="stylesheet" href=".././../css/stylesheets/${path}/${this.cssNamespace(route)}.css">
<script src=".././../js/${path}/${this.jsNamespace(route)}.js" type="module" defer></script>

<%- contentFor('body') %>
<h1>${path}/${route}</h1>`
  }
  _routeFile(path, ...routes) {
    return (
      `const { Router } = require('express')\nconst router = Router()\n\n`
      + this._createRouteFile(path)
      + routes.reduce((main, route) => main + this._createRouteFile(path, route), '')
      + '\nmodule.exports = router')
  }
  _createRouteFile(path, route = '') {
    return `router.route('/${route}').get((req, res) => {
  res.render('pages/${path}/${this.jsNamespace(route)}')\n})\n`
  }
  _createClientJSFile(route) {
    return `console.log('${route.toUpperCase()}')`
  }
  _initPathFile(route = '') {
    return `app.use('/${route}', require('./${this.projectDir}/${this.route}/${this.jsNamespace(route)}'))\n`
  }
  _createExpressFile(...routes) {
    return (
      `const { app, io, listen } = require('./${this.projectDir}/app')\n\n` +
      routes.reduce((main, route) => main + this._initPathFile(route), '') + `\nlisten()`)
  }
}
class FolderTemplate extends RouteTemplate {
  constructor(path, { sta = 'public', scss = 'scss', views = 'views', database = 'database', route = 'routes' }) {
    super(path, { sta, scss, views, database, route })
  }
  _createScssDir() {
    this._makeDir(join(this.scss, 'stylesheets'))
    this._makeFile(join(this.scss, 'reset.scss'), this.resetScss)
  }
  _createStaticDir() {
    this._makeDir(join(this.static, 'imgs'))
    this._makeDir(join(this.static, 'js'))
  }
  _createRoutesDir() {
    this._makeDir(this.route)
  }
  _createDatabaseDir() {
    this._makeDir(this.databse)
  }
  _createViewsDir() {
    this._makeFile(join(this.views, 'layouts', 'layout.ejs'), this.ejsTemplate)
    this._makeDir(join(this.views, 'partials'))
    this._makeDir(join(this.views, 'pages'))
  }
  initFolder() {
    this._makeDir()

    this._createScssDir()
    this._createViewsDir()
    this._createRoutesDir()
    this._createStaticDir()
    this._createDatabaseDir()
  }
  paths = {};
  _addRoute(path = '', ...routes) {
    this.routes[this.jsNamespace(path)] = routes
  }
  _generatePath(route) {
  }
}
const a = new FolderTemplate('../src', {})

a.initFolder()