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

const remoteUsers = {}
let localTracks = []

const Room = ({ name, room, uid }) => {
	const client = useClient()
	const { ready, tracks } = useMicrophoneAndCameraTracks()
	// const [elementsId, setElementsId] = useState([])
	// const [tracks, setTracks] = useState([])
	const [start, setStart] = useState(true)
	const [users, setUsers] = useState([])

	useEffect(() => {
		// function to initialise the SDK
		let init = async name => {
			console.log('init', name)
			client.on('user-published', async (user, mediaType) => {
				await client.subscribe(user, mediaType)
				console.log('subscribe success')
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
				console.log('unpublished', user, type)
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
				console.log('leaving', user)
				setUsers(prevUsers => {
					return prevUsers.filter(User => User.uid !== user.uid)
				})
			})

			await client.join(appId, name, token, null)
			if (tracks) await client.publish([tracks[0], tracks[1]])
			setStart(true)
		}

		if (ready && tracks) {
			console.log('init ready')
			init(room)
		}
	}, [room, client, ready, tracks])

	return (
		<div className='room'>
			<div className='videosection' id='videosection'>
				{start && tracks && <Videos users={users} tracks={tracks} />}
			</div>
			<div className='msgsection'></div>
		</div>
	)
}

export default Room
