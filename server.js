const express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// middlewares
app.use(express.json())
app.use(cors())

////////////////////////////////////////
// Serve Static assests in production
////////////////////////////////////////
if (process.env.NODE_ENV === 'production') {
	//set static folder
	app.use(express.static('client/build'))

	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const rooms = {}
// on socket connection
io.on('connection', socket => {
	socket.on('join', ({ room, name }) => {
		if (rooms[room]) {
			rooms[room].push({ name: name, id: socket.id })
		} else {
			rooms[room] = [{ name: name, id: socket.id }]
		}

		socket.join(room)

		let names = []

		rooms[room].forEach(obj => names.push(obj.name))

		io.to(room).emit('user joined', { names: names })
	})

	socket.on('msg', ({ room, name, msg }) => {
		io.to(room).emit('msg', { name, msg })
	})

	socket.on('leave', ({ room, name }) => {
		if (rooms[room]) {
			rooms[room] = rooms[room].filter(obj => obj.name !== name)
		}

		io.to(room).emit('user leave', { name })
		socket.leave(room)
		socket.disconnect(true)
	})

	socket.on('disconnect', () => {
		let r = ''
		let name = ''

		for (const room in rooms) {
			rooms[room].forEach(obj => {
				if (obj.id === socket.id) {
					r = room
					name = obj.name
				}
			})
		}

		io.to(r).emit('user leave', { name })

		if (rooms[r]) {
			rooms[r] = rooms[r].filter(obj => obj.id !== socket.id)
		}

		socket.disconnect(true)
	})
})

////////////////////////////////////////
// Server listening
////////////////////////////////////////
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log('Yes it is running'))
