const express = require('express')
const path = require('path')
const { app, listen } = require('./src/app')

app.use(express.static(path.join('src', 'public')))

app.set("views", path.join(__dirname, 'src', 'views'))
app.use('/', require('./src/routes/index'))
app.use('/asdf', require('./src/routes/asdf'))
app.use('/_ee', require('./src/routes/_ee'))
app.use('/asfaf', require('./src/routes/asfaf'))

listen()