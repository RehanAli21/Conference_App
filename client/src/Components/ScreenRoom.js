import React, { useState, useEffect } from 'react'
import { createClient, createScreenVideoTrack } from 'agora-rtc-react'

import Videos from './Videos'

const config = {
	mode: 'rtc',
	codec: 'vp8',
}

const useClient = createClient(config)
const useScreenVideoTrack = createScreenVideoTrack({}, 'disable')

const appId = process.env.REACT_APP_API_ID
const token = process.env.REACT_APP_API_TOKEN || null

const ScreenRoom = ({ room, setScreen, screen }) => {
	const client = useClient()
	let { ready, tracks } = useScreenVideoTrack()

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
			if (tracks) await client.publish(tracks)
			setStart(true)
		}

		if (ready && tracks) {
			init(room)
		}
	}, [room, client, ready, tracks])

	const Leavefunc = () => {
		window.location.reload()
	}

	const Screenfunc = async () => {
		tracks.close()
		await client.leave()
		setScreen(false)
	}

	return (
		<div className='videosection' id='videosection'>
			{start && tracks && <Videos users={users} tracks={tracks} />}

			<div className='controls'>
				<div></div>
				<div className='icon' style={{ backgroundColor: screen ? 'blueviolet' : '' }} onClick={Screenfunc}>
					<i className='gg-screen' style={{ transform: 'scale(1.3)', marginTop: '-3px' }}></i>
				</div>
				<div className='icon' style={{ backgroundColor: 'red', border: 'none' }} onClick={Leavefunc}>
					<i className='gg-export' style={{ transform: 'scale(1.3) rotate(-90deg)' }}></i>
				</div>
			</div>
		</div>
	)
}

export default ScreenRoom
