const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const expressEjsLayouts = require('express-ejs-layouts')
const { Server } = require('socket.io')
const { createServer } = require('http')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressEjsLayouts)

app.set("view engine", "ejs");
app.set('layout', path.join('layouts', 'layout'))

const httpServer = createServer(app)
const io = new Server(httpServer)

function listen(port = 3000) {
  mongoose.connect('mongodb://127.0.0.1:27017/____', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to the db...'))
  httpServer.listen(port, () => console.log(`Listen on port ${process.env.PORT || port}`))
}
module.exports = { app, io, listen }