import React, { useEffect, useState } from 'react'
import HintButton from './HintButton'
import Hint from './Hint'
import GameEnd from './GameEnd'
import SkipButton from './SkipButton'
import { useSearchParams, Link } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import DownshiftSuggestions from './DownShiftSuggestions'

// TODO:
// IMPORTANT  STUFF //
// change input submit answer box to empty after clicking submit

// LESS IMPORTANT STUFF //
// add a dt button
// Add country code to db to include in Mapper Hint
// Add popovers for previous guesses (include map bg, title, and diff)
// Add popovers for the mapper's previous names
/**
 * @param {object} props Component props
 * @param {Array} props.backendData An array of objects where each element represents an osu map
 * @param {Array} props.dailies An array of objbects where each element corresponds to a daily map (This is a subset of props.backendData)
 */
function Game(props) {

  // searchParams is the query string ?D=x
  // dayNumber    is just a constant which holds the current day number. (This is also stored in infos as MOTD)
  // backendData  stores all the rows of maps in the database (Used for autosuggest)
  // infos        stores the gameState, including the answer, current score, hint number, and a list of incorrect guesses
  // mapInfo      stores the info for today game's current map
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [dayNumber, setDayNumber] = useState(searchParams.get('D') === null ? props.dailies.length : Number(searchParams.get('D')))
  const [backendData, setBackendData] = useState(null)
  const [infos, setInfos] = useState(null)
  const [mapInfo, setMapInfo] = useState(null)

  const storageName = 'DailyMap'.concat(dayNumber)

  // initialize the game state
  useEffect(() => {
    // Grab the save data from localStorage. If it doesn't exist, then make a blank game state
    const saveData = localStorage.getItem(storageName)
    const defaultInfos = (saveData === null) ? {score:0, hint:0, won:null, guesses:[], hintsUnlocked: 0} : JSON.parse(saveData)
    setMapInfo(props.dailies[dayNumber-1])
    setBackendData(props.backendData)
    setInfos(defaultInfos)

    if (searchParams.has('D')) {
      searchParams.delete('D');
      setSearchParams(searchParams);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    
    const handler = setTimeout(() => {
      const storageName = 'DailyMap'.concat(dayNumber)
      const saveData = localStorage.getItem(storageName)
      const defaultInfos = (saveData === null) ? {score:0, hint:0, won:null, guesses:[], hintsUnlocked: 0} : JSON.parse(saveData)
      setInfos(defaultInfos)
      setMapInfo(props.dailies[dayNumber-1]) // Need to DEBOUNCE THIS because the yt player SUCKS
    }, 700);

    // Cleanup function to clear the timeout if the effect is re-run before it completes
    return () => {
      clearTimeout(handler);
    };

  }, [dayNumber])

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
    return(infos.guesses.map((guess, index) => {return <li className={"row text-primary fs-1 justify-content-between border-" + (index!==0 ? "top" : "")} key={index}><Col md='auto' className='d-flex justify-content-center'>{guess.title}</Col><Col md='auto' className='py-2 d-flex justify-content-center'>{correctIcon(guess.title)}</Col></li>}))
  }

  return (
    (infos === null || mapInfo === null || backendData === null || mapInfo === undefined) ? <h1>Loading!</h1> : 
    <div className='px-3' style={{minHeight: "1130px"}}>
      
      <Row className='justify-content-between'>
        <Col md={4} className='bg-body-tertiary rounded-3 text-center text-nowrap clearfix'>
          <QuickButtons callback={setDayNumber} dayNumber={dayNumber} maxDays={props.dailies.length}/>
        </Col>
        <Col md={4} className='bg-body-tertiary rounded-3 text-center'>
          <span className='text-primary text-nowrap fs-2' >Score: {6-infos.score}</span>
        </Col>
      </Row>
      <br></br>
      
      <Row className='justify-content-center'>
        <Hint hintNumber={infos.hint} mapData={mapInfo} won={infos.won}/>
      </Row>
      <br></br>
      <Row className='justify-content-center'>
        <HintButton id={0} onClick={changeHint} infos={infos}/>
        <HintButton id={1} onClick={changeHint} infos={infos}/>
        <HintButton id={2} onClick={changeHint} infos={infos}/>
        <HintButton id={3} onClick={changeHint} infos={infos}/>
        <HintButton id={4} onClick={changeHint} infos={infos}/>
        <HintButton id={5} onClick={changeHint} infos={infos}/>
        {(infos.won === null) ? (<SkipButton onClick={submitAnswer}/>) : (<></>)}
      </Row>
      <br></br>
      {(infos.won === null) ? (<DownshiftSuggestions dataList={backendData} onClick={submitAnswer} />) : (<GameEnd winner={infos.won} mapInfo={mapInfo} infos={infos}/>)}
      
      <br></br>
      {(getGuessList().length !== 0) ? (
      <> 
      
      <h1 className="text-primary text-start text-center" style={{fontSize:'40px'}}>Guesses</h1>
      <Row className='p-2 justify-content-md-center text-center'>
        {(<ol style={{listStyle:'none', fontSize:'32px'}} className='bg-body-tertiary rounded-3 pb-1'>{getGuessList()}</ol>)}
      </Row></>) : (null)}
      
    </div>
  )
}

//Adds the next and previous day buttons in the bottom of the screen
function QuickButtons(props){

  return(
    <>

      {(props.dayNumber === 1) ? (<></>) : (<button className="btn float-start" onClick={() => props.callback(props.dayNumber - 1)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
      </svg></button>) }

      
      <span className='text-primary py-0 mb-0 fs-2 d-inline-flex'>Map #{props.dayNumber}</span>

      {(props.dayNumber === props.maxDays) ? (<></>) : (<button className="btn float-end" onClick={() => props.callback(props.dayNumber + 1)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
      </svg></button>)}

    </>
  )
  
}

export default Game
