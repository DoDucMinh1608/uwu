const { readFileSync, existsSync, writeFileSync, mkdirSync } = require('fs')
const { join, sep, dirname } = require('path')
const _ = undefined
class File {
  // relative path
  constructor(path) {
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
  res.render('pages/${path}/${this.jsNamespace(route)}')\n})\n`
  }
  _writeClientJS(route) {
    return `console.log('${route.toUpperCase()}')`
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

app.set("views", path.join(__dirname, '${this.projectDir}', '${this.views}'))\n` +
      routes.reduce((main, route) => main + this._createPathSection(route), '') + `\nlisten()`)
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
  createProject() {
    this._makeDir()
    this._makeFile('app.js', this.expressApp)
    this._makeFile('../index.js', this._writeMainApp(...Object.keys(this.paths)), true)

    Object.keys(this.paths).forEach(i => this._makeFile(join(this.route, i + '.js'), this._writeRoute(i, ...this.paths[i])))

    this._createScssDir()
    this._createViewsDir()
    this._createRoutesDir()
    this._createStaticDir()
    this._createDatabaseDir()

    for (const [path, routes] of Object.entries(this.paths)) {
      this._generateRoute(path)
      routes.forEach(route => this._generateRoute(path, route))
    }
  }
  paths = {};
  addRoute(path = '', ...routes) {
    this.paths[this.jsNamespace(path)] ??= []
    this.paths[this.jsNamespace(path)].push(...routes)
  }
  _generateRoute(path = '', route = '') {
    // this._makeFile(join(this.route, route + '.js'), this._routeFile(path, ...this.paths[path]))
    const js = this.jsNamespace(route)
    this._makeFile(join(this.views, 'pages', path, js + '.ejs'), this._writeEjs(path, route))

    this._makeFile(join(this.scss, 'stylesheets', path, this.cssNamespace(route) + '.scss'))
    this._makeFile(join(this.scss, 'stylesheets', path, '_var.scss'))

    this._makeFile(join(this.static, 'js', path, js + '.js'), this._writeClientJS(route))
    this._makeFile(join(this.views, 'pages', path, js + '.ejs'), this._writeEjs(path, route))
  }
}
const a = new FolderTemplate('../src', {})

a.addRoute(_, 'a', 'b', 'c')
a.addRoute('asdf', 'asdf', 'b', 'c')
a.addRoute('_ee', 'a', 'b', 'c')
a.addRoute('asfaf', 'a', 'b', 'c')
a.createProject()