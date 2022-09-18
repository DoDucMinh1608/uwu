const { readFileSync, existsSync, writeFileSync, mkdirSync } = require('fs')
const { join, sep, dirname } = require('path')
const _ = undefined
class File {
  // relative path
  constructor(path = '../src') {
    this.path = join(__dirname, path) // project absolute dir
    this.projectDir = this.path.split(sep).at(-1)
  }
  // relative path
  _makeDir(dir = '') {
    const dirs = join(dir).split(sep)
    dirs?.reduce((main, dir) => {
      const path = join(main, dir)
      if (!existsSync(path)) mkdirSync(path)
      return path
    }, this.path)
  }
  _makeFile(path, data = '', force = false) {
    this._makeDir(dirname(path))
    const dir = join(this.path, path)
    if (!force && existsSync(dir)) return
    writeFileSync(dir, data, { encoding: 'utf-8' })
  }
}
class RouteTemplate extends File {
  constructor(path, options = { static: 'public', scss: 'scss', views: 'views', database: 'database', route: 'routes' }) {
    super(path)
    this.static = options.static
    this.route = options.route
    this.scss = options.scss
    this.views = options.views
    this.databse = options.database
  }
  ejsTemplate = readFileSync(join(__dirname, 'static_file', 'layout.ejs'))
  expressApp = readFileSync(join(__dirname, 'static_file', 'expressApp.js'))
  resetScss = readFileSync(join(__dirname, 'static_file', 'reset.scss'))
  addNamespace(namespace) {
    return name => name || namespace
  }
  jsNamespace = this.addNamespace('index')
  cssNamespace = this.addNamespace('style')
  _writeEjs(path, route = '') {
    return `<%- contentFor('title') %>
${(route || path).toUpperCase()}

<%- contentFor('init') %>
<link rel="stylesheet" href=".././../css/stylesheets/${this.jsNamespace(path)}/${this.cssNamespace(route)}.css">
<script src=".././../js/${this.jsNamespace(path)}/${this.jsNamespace(route)}.js" type="module" defer></script>

<%- contentFor('body') %>
<h1>${path}/${route}</h1>`
  }
  _writeRoute(path, ...routes) {
    return (
      `const { Router } = require('express')\nconst router = Router()\n\n`
      + this._createRouteSection(path)
      + routes.reduce((main, route) => main + this._createRouteSection(path, route), '')
      + '\nmodule.exports = router')
  }
  _createRouteSection(path, route = '') {
    return `router.route('/${route}').get((req, res) => {
  res.render('pages/${this.jsNamespace(path)}/${this.jsNamespace(route)}')\n})\n`
  }
  _writeClientJS(route) {
    return `console.log('${this.jsNamespace(route).toUpperCase()}')`
  }
  _createPathSection(route = '') {
    return `app.use('/${route == 'index' ? '' : route}', require('./${this.projectDir}/${this.route}/${this.jsNamespace(route)}'))\n`
  }
  _writeMainApp(...routes) {
    return (
      `const express = require('express')
const path = require('path')
const { app, listen } = require('./${this.projectDir}/app')\n\n` +
      `app.use(express.static(path.join('${this.projectDir}', '${this.static}')))

app.set("views", path.join(__dirname, '${this.projectDir}', '${this.views}'))\n\n` +
      routes.reduce((main, route) => main + this._createPathSection(route), '') +
      `\n\nlisten()`)
  }
}
class FolderTemplate extends RouteTemplate {
  constructor(path, options = { static: 'public', scss: 'scss', views: 'views', database: 'database', route: 'routes' }) {
    super(path, options)
  }
  _createMainDir() {
    this._makeDir()
    this._makeDir(join(this.scss, 'stylesheets'))
    this._makeFile(join(this.scss, 'reset.scss'), this.resetScss)

    this._makeDir(join(this.static, 'imgs'))
    this._makeDir(join(this.static, 'js'))

    this._makeDir(this.route)
    this._makeDir(this.databse)

    this._makeFile(join(this.views, 'layouts', 'layout.ejs'), this.ejsTemplate)
    this._makeDir(join(this.views, 'partials'))
    this._makeDir(join(this.views, 'pages'))
  }
  createProject() {
    const paths = Object.keys(this.#paths)

    this._createMainDir()
    this._makeFile('app.js', this.expressApp)
    this._makeFile('../index.js', this._writeMainApp(...paths.filter(i => !this.#paths[i].options.subDir)), true)

    for (const [path, { routes }] of Object.entries(this.#paths)) {
      const js = this.jsNamespace(path)

      this._generateRoute(path)

      this._makeFile(join(this.route, js + '.js'), this._writeRoute(path, ...this.#paths[path].routes))
      routes.forEach(route => this._generateRoute(js, route)
      )
    }
  }
  #paths = {};
  addRoute(path = '', routes = [], options = { subDir: false }) {
    this.#paths[path] ??= { routes: new Set(routes), options }
    routes.forEach(i => this.#paths[path].routes.add(i))
  }
  _generateRoute(path = '', route = '') {
    // this._makeFile(join(this.route, route + '.js'), this._routeFile(path, ...this.paths[path]))
    const js = this.jsNamespace(path)
    this._makeFile(join(this.views, 'pages', js, this.jsNamespace(route) + '.ejs'), this._writeEjs(path, route))

    this._makeFile(join(this.scss, 'stylesheets', js, this.cssNamespace(route) + '.scss'))
    this._makeFile(join(this.scss, 'stylesheets', js, '_var.scss'))

    this._makeFile(join(this.static, 'js', js, this.jsNamespace(route) + '.js'), this._writeClientJS(route))
  }
}
const a = new FolderTemplate()

a.addRoute(_)
a.addRoute('account', ['register', 'login'],)
a.createProject()