import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import expressEjsLayouts from 'express-ejs-layouts'
import { Server } from 'socket.io'
import { createServer } from 'http'

export const app = express()

app.use(express.static(path.join('src', 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressEjsLayouts)

app.set("view engine", "ejs");
app.set("views", "views");
app.set('layout', path.join('layouts', 'layout'))

const httpServer = createServer(app)
export const io = new Server(httpServer)

export function listen(port = 3000) {
  mongoose.connect('mongodb://127.0.0.1:27017/____', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to the db...'))
  httpServer.listen(port, () => console.log(`Listen on port ${port}`))
}