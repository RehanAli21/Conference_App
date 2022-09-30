import React, { useState } from 'react'

const Main = ({ setName, setRoom }) => {
	const [n, setN] = useState('')
	const [r, setR] = useState('')

	const enter = () => {
		if (n !== '' && r !== '') {
			setName(n)
			setRoom(r)
		} else {
			alert('Show all fields')
		}
	}

	return (
		<div className='Main'>
			<h1>Conference App</h1>
			<div>
				<input type='text' placeholder='Enter Name' onChange={e => setN(e.target.value)} />
				<input type='text' placeholder='Enter Room' onChange={e => setR(e.target.value)} />
				<button onClick={enter}>Enter</button>
			</div>
		</div>
	)
}

export default Main
