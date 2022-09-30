import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import Room from './Routes/Room'
import Main from './Routes/Main'

let run = 0
const App = () => {
	const [name, setName] = useState('')
	const [room, setRoom] = useState('')
	const [uid, setUid] = useState('')

	useEffect(() => {
		if (run === 0) {
			setUid(uuid())
			run++
		}
	}, [])

	return (
		<div className='App'>
			{name !== '' && room !== '' && uid !== '' ? (
				<Room name={name} room={room} uid={uid} />
			) : (
				<Main setName={setName} setRoom={setRoom} />
			)}
		</div>
	)
}

export default App
