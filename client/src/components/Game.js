import React, { useEffect, useState } from 'react'
import HintButton from './HintButton'
import Hint from './Hint'
import Suggestions from './Suggestions'
import GameEnd from './GameEnd'
import SkipButton from './SkipButton'
import { useParams } from 'react-router-dom'

// TODO:
// -Replace Suggestions with Downshift
// -Load all videos exactly once instead of grabbing them over and over again
// -Add more to finishGame()
// -Mess with App.css
// -cahnges i think !!!!!!!!! guesses after game end
// -add a dt button
// -make it so that the hint container has constant size
// -add user cookies
// -fix video player default volume level
// figure out how to use tailwind
// Add info modal
// MAKE EVERYTHING PIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINK

/**
 * @param {object} props Component props
 * @param {Array} props.backendData An array of objects where each element represents an osu map
 * @param {Array} props.daliies An array of objbects where each element corresponds to a daily map (This is a subset of props.backendData)
 */
function Game(props) {

  // backendData  stores all the rows of maps in the database (Used for autosuggest)
  // infos        stores the gameState, including the answer, current score, hint number, and a list of incorrect guesses
  const [backendData, setBackendData] = useState(props.backendData)
  const [infos, setInfos] = useState({mapInfo:null, score:0, hint:0, won:null, guesses:[]})

  // temp will be undefined if called from the home page. If it is called from /previous-games/:id, then it will have value :id
  // We can use this value to determine if the user entered from the home page or from the previous days
  const temp = useParams()
  const dayNumber = (temp.MOTD == undefined) ? props.dailies.length : temp.MOTD

  // A list that stores all of the user's previous guesses
  let guessList = infos.guesses.map((guess, index) => {return <li style={{color:'#FF8EE6'}} key={index}>{guess}</li>})
  
  // initialize the game by setting the map to the appropiate row in dailies
  useEffect(() => {
    setInfos(oldInfos => {return {...oldInfos, mapInfo: props.dailies[dayNumber-1]}})
  }, [])

  // The handler to finish the game after a user has lost or won
  const finishGame = (winner) => {
    // TODO: Add more stuff here
    if (winner) {
      console.log("congrats")
    }
    else {
      console.log("u suck")
    }
    // Unlock all hints
    setInfos({...infos, score: 6, won:winner})
  }

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

    // End the game if necessary
    if (infos.mapInfo.title === value) {
      finishGame(true)
      return
    }
    else if (infos.score+1 >= 6) {
      finishGame(false)
      return
    }

    // Return a new info object
    const newInfos = {...infos, score: infos.score+1, hint: infos.score+1, guesses: infos.guesses.concat([value])}
    setInfos(newInfos)
  }

  return (
    <> 
      <h3>Map #{dayNumber}</h3>

      <div className='row' style={{maxHeight:'95%'}}>
        {(infos.mapInfo === null ) ? (<p>Loading</p>): (<Hint hintNumber={infos.hint} mapData={infos.mapInfo}/>) /* Hint window */}
      </div>

      <div className='row'>
        <div style={{textAlign: 'center', margin:'10px'}}>
          <HintButton id={0} onClick={changeHint} infos={infos}/>
          <HintButton id={1} onClick={changeHint} infos={infos}/>
          <HintButton id={2} onClick={changeHint} infos={infos}/>
          <HintButton id={3} onClick={changeHint} infos={infos}/>
          <HintButton id={4} onClick={changeHint} infos={infos}/>
          <HintButton id={5} onClick={changeHint} infos={infos}/>
          <SkipButton onClick={submitAnswer} />
        </div>
      </div>
      <div style={{textAlign: 'center'}} className='row justify-content-md-center'>
        {(infos.won === null) ? (<Suggestions dataList={backendData} onClick={submitAnswer}/>) : (<GameEnd winner={infos.won} mapLink={infos.mapInfo.map_url} mapTitle={infos.mapInfo.title}/>)}
      </div>
      <br></br>
      {(guessList.length !== 0 && !infos.won) ? (
      <div style={{textAlign: 'center'}} className='row justify-content-md-center'>
        <h1 style={{fontSize:'80px', textAlign:'left', color:'#FF66AA'}}>Current Guesses</h1>
        {(<ol style={{listStyle:'none', fontSize:'40px'}} className='v bg-body-tertiary'>{guessList}</ol>)}
      </div>) : (null)}
      <QuickButtons dayNumber={dayNumber} maxDays={props.dailies.length}/>
    </>
  )
}

//Adds the next and previous day buttons in the bottom of the screen
function QuickButtons(props){
  return (
  <>
  <div className="row justify-content-between" style={{marginTop:"-100px"}}>
    <div className="col" style={{textAlign:"start"}}>
      {(props.dayNumber == 0) ? (<></>) : (<a href={"/previous-maps/"+(props.dayNumber-1).toString()}>
        <button className="btn btn-primary">Previous Day</button>
      </a>) }
    </div>
    <div className="col" style={{textAlign:"end"}}>
      {(props.dayNumber == props.maxDays) ? (<></>) : (<a href={"/previous-maps/"+(props.dayNumber - -1).toString()}>
        <button className="btn btn-primary">Next Day</button>
      </a>)}
    </div>
  </div>
  </>)
}

export default Game