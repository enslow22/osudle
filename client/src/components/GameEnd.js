import React, { useEffect } from 'react';
import { useState } from 'react';
import dayjs from 'dayjs'

export default function GameEnd(props) {

    // time is the seconds until the next day
    const [time, setTime] = useState(0);
    const now = dayjs()
    const deadline = dayjs().endOf('day')

    const getTime = () => {
        setTime(deadline.diff(now))
    }

    // Set initial time (might be unnecessary)
    useEffect(() => {
        getTime()
    }, [])

    // Update the time every 1000ms
    useEffect(()=>{
        const interval = setInterval(() => getTime(), 1000);

        return () => clearInterval(interval)
    }, [time])

    // Return a game-end message to the player and the time until the next map unlocks
    return (
        <>
        <div className='col'>
            <div><h1>{(props.winner) ? ("Congrats!") : ("Better luck next time!")} The answer was {props.mapTitle}</h1></div>
            <h2>
            <a href={props.mapLink}>Check out the map</a>
            </h2>
            {(time === 0) ? (<h2>Next map in: {"24:00:00"}</h2>) : (<h2>Next map in: {dayjs(time + 8*3600*1000).format("HH:mm:ss")}</h2>) }
            <h2>Also check out the previous days!</h2>
        </div>
        </>
    )
}
