import React, { useState, useEffect } from 'react'
import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import Videos from '../Components/Videos'

const config = {
	mode: 'rtc',
	codec: 'vp8',
}

const useClient = createClient(config)
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

const appId = process.env.REACT_APP_API_ID
const token = process.env.REACT_APP_API_TOKEN || null

const Room = ({ name, room, uid }) => {
	const client = useClient()
	const { ready, tracks } = useMicrophoneAndCameraTracks()

	const [video, setVideo] = useState(true)
	const [audio, setAudio] = useState(true)
	const [screen, setScreen] = useState(false)

	const [start, setStart] = useState(true)
	const [users, setUsers] = useState([])

	useEffect(() => {
		let init = async name => {
			client.on('user-published', async (user, mediaType) => {
				await client.subscribe(user, mediaType)

				if (mediaType === 'video') {
					setUsers(prevUsers => {
						return [...prevUsers, user]
					})
				}
				if (mediaType === 'audio') {
					user.audioTrack?.play()
				}
			})

			client.on('user-unpublished', (user, type) => {
				if (type === 'audio') {
					user.audioTrack?.stop()
				}
				if (type === 'video') {
					setUsers(prevUsers => {
						return prevUsers.filter(User => User.uid !== user.uid)
					})
				}
			})

			client.on('user-left', user => {
				setUsers(prevUsers => {
					return prevUsers.filter(User => User.uid !== user.uid)
				})
			})

			await client.join(appId, name, token, null)
			if (tracks) await client.publish([tracks[0], tracks[1]])
			setStart(true)
		}

		if (ready && tracks) {
			init(room)
		}
	}, [room, client, ready, tracks])

	const Videofunc = async () => {
		await tracks[1].setEnabled(!video)
		setVideo(!video)
	}

	const Audiofunc = async () => {
		await tracks[0].setEnabled(!audio)
		setVideo(!audio)
	}

	const Leavefunc = () => {
		window.location.reload()
	}

	return (
		<div className='room'>
			<div className='videosection' id='videosection'>
				{start && tracks && <Videos users={users} tracks={tracks} />}
				<div className='controls'>
					<div className='icon' style={{ backgroundColor: video ? 'blueviolet' : '' }} onClick={Videofunc}>
						<i className='gg-webcam' style={{ scale: '1.5' }}></i>
					</div>
					<div className='icon' style={{ backgroundColor: audio ? 'blueviolet' : '' }} onClick={Audiofunc}>
						<i className='gg-mic' style={{ transform: 'scaleY(0.9)', marginTop: '2px' }}></i>
					</div>
					<div className='icon' style={{ backgroundColor: screen ? 'blueviolet' : '' }}>
						<i className='gg-screen' style={{ transform: 'scale(1.3)', marginTop: '-3px' }}></i>
					</div>
					<div className='icon' style={{ backgroundColor: 'red', border: 'none' }} onClick={Leavefunc}>
						<i className='gg-export' style={{ transform: 'scale(1.3) rotate(-90deg)' }}></i>
					</div>
				</div>
			</div>
			<div className='msgsection'></div>
		</div>
	)
}

export default Room
