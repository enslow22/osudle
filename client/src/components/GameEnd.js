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


    useEffect(()=>{
        const interval = setInterval(() => getTime(), 1000);

        return () => clearInterval(interval)
    }, [time])

    return (
        <>
        <div className='col'>
            <div>{(props.winner) ? (<h1>Congrats!</h1>) : (<h2>Better luck next time!</h2>)}</div>
            <h2>
            <a href={props.mapLink}>Check out the map</a>
            </h2>
            {(time === 0) ? (<></>) : (<h2>{dayjs(time + 8*3600*1000).format("HH:mm:ss")}</h2>) }
        </div>
        </>
    )
}
