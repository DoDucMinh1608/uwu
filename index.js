import { app, io, listen } from './src/app.js'
import index from './src/controllers/index.js'

app.use('/', index)
io.on('connection', () => {
  console.log('New connect')
})

listen(3000)