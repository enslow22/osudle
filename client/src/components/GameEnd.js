import React, { useEffect } from 'react';
import { useState } from 'react';
import dayjs from 'dayjs'

export default function GameEnd(props) {

    // time is the seconds until the next day
    const now = dayjs()
    const deadline = dayjs().endOf('day')

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
        <>
        <div className='col bg-body-tertiary'>
            <div><h1>{(props.winner) ? ("Congrats!") : ("Better luck next time!")} The answer was {props.mapInfo.title} - [{props.mapInfo.diff_name}]</h1></div>
            <h2>
            <a href={props.mapInfo.map_url} target="_blank" rel='noopener noreferrer'>Check out the map</a>
            </h2>
            {(time === 0) ? (<h2>Next map in: {"24:00:00"}</h2>) : (<h2>Next map in: {dayjs(time + 8*3600*1000).format("HH:mm:ss")}</h2>) }
            <h2>Also check out the previous days!</h2>
        </div>
        </>
    )
}
