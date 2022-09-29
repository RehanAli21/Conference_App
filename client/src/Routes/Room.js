import React, { useState, useEffect } from 'react'
import ScreenRoom from '../Components/ScreenRoom'
import VideoRoom from '../Components/VideoRoom'
import io from 'socket.io-client'

let socket = io('http://localhost:5000')
let run = 0
const Room = ({ name, room, uid }) => {
	const [msg, setMsg] = useState('')
	const [screen, setScreen] = useState(false)
	const [members, setMembers] = useState([name])
	const [msgs, setMsgs] = useState([])

	const [showMembers, setShowMembers] = useState(false)

	useEffect(() => {
		if (run === 0) {
			socket.emit('join', { room, name })

			socket.on('user joined', ({ names }) => {
				setMembers(names)
			})

			socket.on('msg', ({ name, msg }) => {
				setMsgs(prevState => [...prevState, { name, msg }])
			})

			socket.on('user leave', ({ name }) => {
				const temp = members.filter(m => m !== name)
				setMembers(temp)
			})

			run++

			return () => {
				socket.emit('leave', { room, name })
			}
		}
	}, [])

	const sendMsg = () => {
		if (msg === '') {
			return alert('Fill All Fileds')
		}

		socket.emit('msg', { room, name, msg: msg })
		document.getElementById('msgInput').value = ''
	}

	let key = 0
	return (
		<div className='room'>
			{screen ? (
				<ScreenRoom setScreen={setScreen} screen={screen} room={room} />
			) : (
				<VideoRoom setScreen={setScreen} screen={screen} room={room} />
			)}
			<div className='msgsection'>
				<div className='members'>
					<div className='head'>
						<h1>Members</h1>
						{showMembers ? (
							<i className='float gg-arrow-up-r' onClick={() => setShowMembers(false)}></i>
						) : (
							<i className='float gg-arrow-down-r' onClick={() => setShowMembers(true)}></i>
						)}
					</div>
					<div
						className='membersDiv'
						style={{
							display: showMembers ? 'block' : 'none',
							transform: showMembers ? 'scaleY(1)' : 'scaleY(0)',
						}}>
						{members.map(member => (
							<p>{member}</p>
						))}
					</div>
				</div>
				<div className='msgs'>
					<div className='msgsDiv'>
						{msgs.map(msg => (
							<p key={key++} className={name === msg.name ? 'usermsg' : 'othermsg'}>
								<span>- {msg.name}</span>
								{msg.msg}
							</p>
						))}
					</div>
					<div style={{ borderTop: '2px solid blueviolet', paddingTop: '10px' }}>
						<input type='text' id='msgInput' placeholder='Message' onChange={e => setMsg(e.target.value)} />
						<button onClick={sendMsg}>Send</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Room
