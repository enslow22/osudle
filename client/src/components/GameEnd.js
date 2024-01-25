import React, { useEffect } from 'react';
import { useState } from 'react';
import dayjs from 'dayjs'
import Confetti from 'react-confetti'



export default function GameEnd(props) {

    // Set timezone
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone')
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('America/Los_Angeles')

    // time is the seconds until the next day
    
    // Don't ask
    const [time, setTime] = useState(0);
    const [copied, setCopied] = useState(false)

    const getTime = () => {
        setTime(time-1000)
    }

    useEffect(() => {
        const now = dayjs()
        const deadline = now.add(1, 'day').set('hour', 19).set('minute', 27).set('second', 0)
        setTime(deadline.diff(now)+1000)
    }, [])


    // Update the time every 1000ms
    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    const boxes = () => {

        let boxList = []

        for (var i = 0; i < props.infos.score; i++) {
            boxList.push('\u{1F7E5}')
        }
        if (props.winner) {
            boxList.push('\u{1F7E9}')
        }
        while (boxList.length < 6) {
            boxList.push('\u2B1B')
        }
        return boxList

    }

    const shareIcon = () => {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16"><path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/></svg>
        )
    }
    
    return (
        <div className='bg-body-tertiary rounded-4 text-center'>
            {props.winner ? (<Confetti numberOfPieces={50} gravity={0.15} friction={0.98} recycle={false} height={window.innerHeight} tweenFunction={function easeOutQuad(t, b, _c, d) {var c = _c - b; return -c * (t /= d) * (t - 600) + b;}} confettiSource={{x:window.innerWidth/2 - 100, y:window.innerHeight, w:200, h:10}} initialVelocityX={window.innerWidth/80} initialVelocityY={{min: -1*window.innerHeight/30, max: -5}}/>
            ) : (<></>)}
            <h1 className='d-inline-flex text-center'>{(props.winner) ? ("Congrats!") : ("Better luck next time!")} The answer was:</h1>
            <br></br>
            <h1 className='m-1 mb-3 d-inline-flex mx-auto text-wrap'><a href={props.mapInfo.map_url} target="_blank" rel='noopener noreferrer'>{props.mapInfo.title} - [{props.mapInfo.diff_name}]</a></h1>

            <div className='row justify-content-center flex-nowrap align-items-center pb-2'>
                <div className='col d-flex align-items-center'>
                    {(props.winner) ? (<img className='rounded-4 d-block mx-auto pb-2' src={require('../3x.webp')} style={{width:'60%'}} alt='WYSI'></img>) : (<></>)}
                </div>
                <div className='col-md-4 pb-1'>

                    {(time === 0) ? (<h2>Next osudle! in: {"24:00:00"}</h2>) : (<h2 className='py-2'>Next osudle! in: {dayjs(time + 8*3600*1000).format("HH:mm:ss")} </h2>) }
                    <button className='btn btn-primary btn-lg' onClick={(e) => {navigator.clipboard.writeText("osudle! Day "+props.mapInfo.MOTD+": "+boxes().join('')); setCopied(true)}}>{(copied) ? <span>Copied to Clipboard!</span> : <span>Share Score &nbsp;{shareIcon()}</span>}</button>
                    
                </div>
                <div className='col d-flex align-items-center'>
                    {(props.winner) ? (<img className='rounded-4 d-block mx-auto pb-2' src={require('../3x.webp')} style={{width:'60%'}} alt='WYSI'></img>) : (<></>)}
                </div>
            </div>
        </div>
    )
}
