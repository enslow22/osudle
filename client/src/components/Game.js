import React, { useEffect, useState } from 'react'
import HintButton from './HintButton'
import Hint from './Hint'
import GameEnd from './GameEnd'
import SkipButton from './SkipButton'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import DownshiftSuggestions from './DownShiftSuggestions'

// TODO:
// IMPORTANT  STUFF //
// -make it so that the hint container has constant size
// MAKE EVERYTHING PIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINK
// Add info modal in top right
// -add user cookies
// Display guesses even after win
// change input submit answer box to empty after clicking submit
// Move headers from index.html into index.js

// LESS IMPORTANT STUFF //
// -add a dt button
// -Collect and download user scores for data analysis later?
// Add country code to db to include in Mapper Hint
// Add popovers for previous guesses (include the diff they chose and mapper maybe idk)
// Maybe change Buttons into a tabs component from bootstrap?
// Turn all Hint Buttons into abutton group
 
/**
 * @param {object} props Component props
 * @param {Array} props.backendData An array of objects where each element represents an osu map
 * @param {Array} props.dailies An array of objbects where each element corresponds to a daily map (This is a subset of props.backendData)
 */
function Game(props) {

  // backendData  stores all the rows of maps in the database (Used for autosuggest)
  // infos        stores the gameState, including the answer, current score, hint number, and a list of incorrect guesses
  const backendData = props.backendData
  const [infos, setInfos] = useState({mapInfo:null, score:0, hint:0, won:null, guesses:[]})

  // temp will be undefined if called from the home page. If it is called from /previous-games/:id, then it will have value :id
  // We can use this value to determine if the user entered from the home page or from the previous days
  const temp = useParams()
  const dayNumber = (temp.MOTD === undefined) ? props.dailies.length : Number(temp.MOTD)

  // A list that stores all of the user's previous guesses
  let guessList = infos.guesses.map((guess, index) => {return <li className="text-primary" key={index}>{guess}</li>})
  
  // initialize the game by setting the map to the appropiate row in dailies
  useEffect(() => {
    setInfos(oldInfos => {return {...oldInfos, mapInfo: props.dailies[dayNumber-1]}})
  }, [])

  // Set the hint
  const changeHint = (e, id) => {
    setInfos(oldInfos => {
      return {...oldInfos, hint: id}
    });
  }

  // Handler to submit an answer (Checks if a game should be over)
  const submitAnswer = (e, value) => {

    // Don't accept empty inputs
    if (value.trim() === '') {
      return
    }

    // Return a new info object
    var newInfos = {...infos, score: infos.score+1, hint: infos.score+1, guesses: infos.guesses.concat([value])}
    
    // See if the game has ended
    if (infos.mapInfo.title === value) {
      newInfos = {...newInfos, won: true}
    }
    else if (infos.score+1 >= 6) {
      newInfos = {...newInfos, won: false}
    }

    setInfos(newInfos)
  }

  return (
    <> 
      <Row>
        <Col>
          <h1 className='text-primary'>Map #{dayNumber}</h1>
        </Col>
        <Col style={{textAlign:'end'}}>
          <h1 className='text-primary'>Score: {6-infos.score}</h1>
        </Col>
      </Row>

      {(infos.mapInfo === null ) ? (<p>Loading</p>): (<Hint hintNumber={infos.hint} mapData={infos.mapInfo}/>) /* Hint window */}

      <Row>
        <div style={{textAlign: 'center', margin:'10px'}}>
          <HintButton id={0} onClick={changeHint} infos={infos}/>
          <HintButton id={1} onClick={changeHint} infos={infos}/>
          <HintButton id={2} onClick={changeHint} infos={infos}/>
          <HintButton id={3} onClick={changeHint} infos={infos}/>
          <HintButton id={4} onClick={changeHint} infos={infos}/>
          <HintButton id={5} onClick={changeHint} infos={infos}/>
          <SkipButton onClick={submitAnswer} />
        </div>
      </Row>

      {(infos.won === null) ? (<DownshiftSuggestions dataList={backendData} onClick={submitAnswer} />) : (<GameEnd winner={infos.won} mapInfo={infos.mapInfo}/>)}
      
      <br></br>
      {(guessList.length !== 0 && !infos.won) ? (
      <Row className='justify-content-md-center'>
        <h1 className="text-primary" style={{fontSize:'80px', textAlign:'left'}}>Current Guesses</h1>
        {(<ol style={{listStyle:'none', fontSize:'40px'}} className='v bg-body-tertiary'>{guessList}</ol>)}
      </Row>) : (null)}
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