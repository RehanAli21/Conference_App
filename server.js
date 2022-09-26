const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

// middlewares
app.use(express.json())
app.use(cors())

////////////////////////////////////////
// Route for checking if server is running or not
////////////////////////////////////////
// app.get('/', (req, res) => {
// 	res.status(200).send('Yes! it is running')
// })

// sendFile will go here
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, './front-end/Main.html'))
})

// on socket connection
io.on('connection', socket => {
	socket.on('disconnect', () => {})
})

////////////////////////////////////////
// Server listening
////////////////////////////////////////
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log('Yes it is running'))
