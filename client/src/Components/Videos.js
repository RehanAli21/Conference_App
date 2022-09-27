import React from 'react'
import { AgoraVideoPlayer } from 'agora-rtc-react'

const Videos = ({ users, tracks }) => {
	const videoTrack = tracks.length ? tracks[1] : tracks

	const fullScreen = e => {
		const ele = document.getElementById(e.target.id)

		if (ele) {
			ele.requestFullscreen()
		}
	}

	let id = 1
	return (
		<React.Fragment>
			<AgoraVideoPlayer
				className='vid'
				id={`player${id++}`}
				videoTrack={videoTrack}
				style={{ height: '95%', width: '95%' }}
				onDoubleClick={fullScreen}
			/>
			{users.length > 0 &&
				users.map(user => {
					if (user.videoTrack) {
						return (
							<AgoraVideoPlayer
								className='vid'
								videoTrack={user.videoTrack}
								style={{ height: '95%', width: '95%' }}
								key={user.uid}
								id={`player${id++}`}
								onDoubleClick={fullScreen}
							/>
						)
					} else return null
				})}
		</React.Fragment>
	)
}

export default Videos
