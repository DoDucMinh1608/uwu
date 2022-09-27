const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const expressEjsLayouts = require('express-ejs-layouts')
const { Server } = require('socket.io')
const { createServer } = require('http')

try { require('dotenv').config() } catch (error) { }
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressEjsLayouts)

app.set("view engine", "ejs");
app.set('layout', path.join('layouts', 'layout'))

const httpServer = createServer(app)
const io = new Server(httpServer)

function listen() {
  mongoose.connect(process.env[app.get('env') == 'development' ? 'TESTDB' : 'DB'], { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the db...'))
  httpServer.listen(process.env.PORT, () => console.log(`Listen on port ${process.env.PORT}`))
}
module.exports = { app, io, listen }