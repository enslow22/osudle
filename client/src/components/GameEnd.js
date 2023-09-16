import React, { useEffect } from 'react';
import { useState } from 'react';
import dayjs from 'dayjs'

// Set timezone
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Los_Angeles")

export default function GameEnd(props) {

    // time is the seconds until the next day
    const now = dayjs()
    const deadline = dayjs().add(1, 'day').set('hour', 19).set('minute', 27).set('second', 0)


    // Don't ask
    const [time, setTime] = useState(deadline.diff(now)+1000);

    const getTime = () => {
        setTime(deadline.diff(now))
    }


    // Update the time every 1000ms
    useEffect(()=>{
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    // Return a game-end message to the player and the time until the next map unlocks
    return (
        <div className='row justify-content-center flex-nowrap'>
        <div className='col bg-body-tertiary d-flex align-items-center'>
            {(props.winner) ? (<img className='rounded mx-auto d-block' src={require('../3x.webp')} style={{width: '150px', height: '150px'}} alt='WYSI'></img>) : (<></>)}
        </div>
        <div className='col-md-auto bg-body-tertiary text-center pb-1'>
        <div><h1>{(props.winner) ? ("Congrats!") : ("Better luck next time!")}</h1>
        <br></br>
        <h1>The answer was <a href={props.mapInfo.map_url} target="_blank" rel='noopener noreferrer'>{props.mapInfo.title} - [{props.mapInfo.diff_name}]</a></h1></div>
        <br></br>
        {(time === 0) ? (<h2>Next map in: {"24:00:00"}</h2>) : (<h2>Next map in: {dayjs(time + 8*3600*1000).format("HH:mm:ss")} </h2>) }
        <h2>Check out the previous days!</h2>
        </div>
        <div className='col bg-body-tertiary d-flex align-items-center'>
            {(props.winner) ? (<img className='rounded mx-auto d-block' src={require('../3x.webp')} style={{width: '150px', height: '150px'}} alt='WYSI'></img>) : (<></>)}
        </div>
        </div>
    )
}
