import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import HintButton from './components/HintButton'
import Hint from './components/Hint'
import Suggestions from './components/Suggestions'

// TODO:
// -Replace Suggestions with Downshift
// -Implement all the game logic
// -Expand map database
// -Have a finishGame() which brings up the map link and other conclusion info
//
// -Add a non-daily mode

function App() {

  const elapsed = dayjs().diff(dayjs('2023-08-12 00:00'), 'day')

  const [backendData, setBackendData] = useState([])
  const [infos, setInfos] = useState({mapInfo:null, score:0, hint:0})

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        //get max daily
        //const daily = data.reduce((prev, current) => (+prev.MOTD > +current.MOTD) ? prev : current)
        const daily = data.filter(dataRow => {return dataRow.MOTD === elapsed})[0]

        setBackendData(data)
        setInfos(oldInfos => {
          return {...oldInfos, mapInfo: daily}
        })
      }
    )
  }, [])

  const submitAnswer = (e) => {
    setInfos(oldInfos => {
      return {...oldInfos, score: infos.score+1}
    });

    var input = null

    if (input==backendData.title) {
      alert("Congrats! Your score was ".concat(infos.score.toString()))
    }
  }

  const changeHint = (e, id) => {
    setInfos(oldInfos => {
      return {...oldInfos, hint: id}
    });
  }

  return (
    <>
      <div>
        {(infos.mapInfo === null ) ? (<p>Loading</p>): (<Hint hintNumber={infos.hint} mapData={infos.mapInfo}/>)}
      </div>
      
      <div className='row justify-content-center'>
        <HintButton id={0} onClick={changeHint} score={infos.score}/>
        <HintButton id={1} onClick={changeHint} score={infos.score}/>
        <HintButton id={2} onClick={changeHint} score={infos.score}/>
        <HintButton id={3} onClick={changeHint} score={infos.score}/>
        <HintButton id={4} onClick={changeHint} score={infos.score}/>
        <HintButton id={5} onClick={changeHint} score={infos.score}/>
      </div>
      <Suggestions dataList={backendData} onClick={submitAnswer}/>
    </>
  )
  
}

export default App