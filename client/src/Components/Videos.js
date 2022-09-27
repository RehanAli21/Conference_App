import React from 'react'
import { AgoraVideoPlayer } from 'agora-rtc-react'

const Videos = ({ users, tracks }) => {
	const videoTrack = tracks.length ? tracks[1] : tracks

	return (
		<React.Fragment>
			<AgoraVideoPlayer className='vid' videoTrack={videoTrack} style={{ height: '95%', width: '95%' }} />
			{users.length > 0 &&
				users.map(user => {
					if (user.videoTrack) {
						return (
							<AgoraVideoPlayer
								className='vid'
								videoTrack={user.videoTrack}
								style={{ height: '95%', width: '95%' }}
								key={user.uid}
							/>
						)
					} else return null
				})}
		</React.Fragment>
	)
}

export default Videos
