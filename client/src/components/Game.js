import React, { useEffect, useState } from 'react'
import HintButton from './HintButton'
import Hint from './Hint'
import GameEnd from './GameEnd'
import SkipButton from './SkipButton'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import DownshiftSuggestions from './DownShiftSuggestions'
import Confetti from 'react-confetti'

// TODO:
// IMPORTANT  STUFF //
// change input submit answer box to empty after clicking submit

// LESS IMPORTANT STUFF //
// Add a windowsize hook for the confetti
// add a dt button
// Collect and download user scores for data analysis later?
// Add country code to db to include in Mapper Hint
// Add popovers for previous guesses (include map bg, title, and diff)
// Add popovers for the mapper's previous names
// Maybe change Buttons into a tabs component from bootstrap?
// Turn all Hint Buttons into a button group (Then we can style them easier)
 
/**
 * @param {object} props Component props
 * @param {Array} props.backendData An array of objects where each element represents an osu map
 * @param {Array} props.dailies An array of objbects where each element corresponds to a daily map (This is a subset of props.backendData)
 */
function Game(props) {

  // temp will be undefined if called from the home page. If it is called from /previous-games/:id, then it will have value :id
  // We can use this value to determine if the user entered from the home page or from the previous days

  // TODO MOVE ALL THESE INTO STATES
  const temp = useParams()
  const dayNumber = (temp.MOTD === undefined) ? props.dailies.length : Number(temp.MOTD)
  const storageName = 'DailyMap'.concat(dayNumber)

  // backendData  stores all the rows of maps in the database (Used for autosuggest)
  // infos        stores the gameState, including the answer, current score, hint number, and a list of incorrect guesses
  // mapInfo      stores the info for today game's current map
  const [backendData, setBackendData] = useState(null)
  const [infos, setInfos] = useState(null)
  const [mapInfo, setMapInfo] = useState(null)

  // initialize the game state
  useEffect(() => {
    // Grab the save data from localStorage. If it doesn't exist, then make a blank game state
    const saveData = localStorage.getItem(storageName)
    const defaultInfos = (saveData === null) ? {score:0, hint:0, won:null, guesses:[], hintsUnlocked: 0} : JSON.parse(saveData)
    setMapInfo(props.dailies[dayNumber-1])
    setBackendData(props.backendData)
    setInfos(defaultInfos)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set the currently viewed hint
  const changeHint = (e, id) => {
    setInfos(oldInfos => {
      return {...oldInfos, hint: id}
    });
  }

  // Handler to submit an answer (Checks if a game should be over)
  // Value is an object that represents a map {title, diff, background}
  const submitAnswer = (e, map) => {
    const value = map.title

    // Don't accept empty inputs
    if (value.trim() === '') {
      return
    }

    // Return a new info object
    var newInfos = {...infos, score: infos.score+1, hint: infos.hintsUnlocked+1, guesses: infos.guesses.concat(map), hintsUnlocked: infos.hintsUnlocked+1}
    
    // See if the game has ended
    if (mapInfo.title === value) {
      newInfos = {...newInfos, score: infos.score, won: true, hint: 5, hintsUnlocked: 6}
    }
    else if (infos.score+1 >= 6) {
      newInfos = {...newInfos, won: false, hint: 5, hintsUnlocked: 6}
    }
    setInfos(newInfos)
    localStorage.setItem(storageName, JSON.stringify(newInfos))
  }

  const correctIcon = (guess) => {
    return (guess === mapInfo.title) ? <><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
  </svg></> : <><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg></>
  } 

  // A list that stores all of the user's previous guesses
  const getGuessList = () => {
    return(infos.guesses.map((guess, index) => {return <li className="row text-primary border-bottom" key={index}><Col md='auto'>{guess.title}</Col><Col className='pb-2 text-end'>{correctIcon(guess.title)}</Col></li>}))
  }

  return (
    (infos === null || mapInfo === null || backendData === null || mapInfo === undefined) ? <h1>Loading!</h1> : 
    <>
      <Confetti run={(infos.won === true)} numberOfPieces={500} gravity={0.15} friction={0.98} recycle={false} height={window.innerHeight} tweenFunction={function easeOutQuad(t, b, _c, d) {var c = _c - b; return -c * (t /= d) * (t - 600) + b;}} confettiSource={{x:window.innerWidth/2 - 100, y:window.innerHeight, w:200, h:10}} initialVelocityX={window.innerWidth/80} initialVelocityY={{min: -1*window.innerHeight/30, max: -5}}/>
      
      <Row>
        <Col>
          <h1 className='text-primary'>Map #{dayNumber}</h1>
        </Col>
        <Col style={{textAlign:'end'}}>
          <h1 className='text-primary'>Score: {6-infos.score}</h1>
        </Col>
      </Row>

      <Hint hintNumber={infos.hint} mapData={mapInfo} won={infos.won}/>

      <div style={{textAlign: 'center', margin:'10px, 10px', padding:'10px 10px 10px 10px'}}>
        <HintButton id={0} onClick={changeHint} infos={infos}/>
        <HintButton id={1} onClick={changeHint} infos={infos}/>
        <HintButton id={2} onClick={changeHint} infos={infos}/>
        <HintButton id={3} onClick={changeHint} infos={infos}/>
        <HintButton id={4} onClick={changeHint} infos={infos}/>
        <HintButton id={5} onClick={changeHint} infos={infos}/>
        {(infos.won === null) ? (<SkipButton onClick={submitAnswer}/>) : (<></>)}
      </div>

      {(infos.won === null) ? (<DownshiftSuggestions dataList={backendData} onClick={submitAnswer} />) : (<GameEnd winner={infos.won} mapInfo={mapInfo}/>)}
      
      <br></br>
      {(getGuessList().length !== 0) ? (
      <> 
      
      <h1 className="text-primary" style={{fontSize:'80px'}}>Guesses</h1>
      <Row className='p-5 justify-content-md-center text-center'>
        {(<ol style={{listStyle:'none', fontSize:'40px'}} className='bg-body-tertiary'>{getGuessList()}</ol>)}
      </Row></>) : (null)}
      <QuickButtons dayNumber={dayNumber} maxDays={props.dailies.length}/>
    </>
  )
}

//Adds the next and previous day buttons in the bottom of the screen
function QuickButtons(props){
  return (
  <>
  <div className="row justify-content-between">
    <div className="col" style={{textAlign:"start"}}>
      {(props.dayNumber === 1) ? (<></>) : (<a href={"/previous-maps/"+(props.dayNumber-1).toString()}>
        <button className="btn btn-primary">Previous Day</button>
      </a>) }
    </div>
    <div className="col" style={{textAlign:"end"}}>
      {(props.dayNumber === props.maxDays) ? (<></>) : (<a href={"/previous-maps/"+(props.dayNumber - -1).toString()}>
        <button className="btn btn-primary">Next Day</button>
      </a>)}
    </div>
  </div>
  </>)
}

export default Game
