import { useState } from 'react'
import Room from './Routes/Room'
import Main from './Routes/Main'

let run = 0
const App = () => {
	const [name, setName] = useState('')
	const [room, setRoom] = useState('')

	return (
		<div className='App'>
			{name !== '' && room !== '' ? (
				<Room name={name} room={room} />
			) : (
				<Main setName={setName} setRoom={setRoom} />
			)}
		</div>
	)
}

export default App
