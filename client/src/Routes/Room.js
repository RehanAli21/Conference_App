import React, { useState } from 'react'
import ScreenRoom from '../Components/ScreenRoom'
import VideoRoom from '../Components/VideoRoom'

const Room = ({ name, room, uid }) => {
	const [screen, setScreen] = useState(false)

	return (
		<div className='room'>
			{screen ? (
				<ScreenRoom setScreen={setScreen} screen={screen} room={room} />
			) : (
				<VideoRoom setScreen={setScreen} screen={screen} room={room} />
			)}
			<div className='msgsection'></div>
		</div>
	)
}

export default Room
