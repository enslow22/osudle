import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import HintButton from './components/HintButton'
import Hint from './components/Hint'
import Suggestions from './components/Suggestions'
import GameEnd from './components/GameEnd'
// TODO:
// -Replace Suggestions with Downshift
// -Load all videos exactly once instead of grabbing them over and over again
// -Add more to finishGame()
//
// -Add a non-daily mode

function App() {

  const elapsed = dayjs().diff(dayjs('2023-08-12 00:00'), 'day');

  const [backendData, setBackendData] = useState([])
  const [infos, setInfos] = useState({mapInfo:null, score:0, hint:0, won:null})

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

  const finishGame = (winner) => {
    if (winner) {
      console.log("congrats")
    }
    else {
      console.log("u suck")
    }
    // Unlock all hints
    setInfos({...infos, score: 6, won:winner})
  }

  const changeHint = (e, id) => {
    setInfos(oldInfos => {
      return {...oldInfos, hint: id}
    });
  }

  const submitAnswer = (e, value) => {

    if (value === '') {
      return
    }

    if (infos.mapInfo.title === value) {
      finishGame(true)
      return
    }
    else if (infos.score+1 >= 6) {
      finishGame(false)
      return
    }

    const newInfos = {...infos, score: infos.score+1, hint: infos.hint+1}

    setInfos(newInfos)
  }

  return (
    <>
      <div className='row' style={{maxHeight:'95%'}}>
        {(infos.mapInfo === null ) ? (<p>Loading</p>): (<Hint hintNumber={infos.hint} mapData={infos.mapInfo}/>)}
      </div>
      
      <div style={{textAlign: 'center'}}>
        <HintButton id={0} onClick={changeHint} infos={infos}/>
        <HintButton id={1} onClick={changeHint} infos={infos}/>
        <HintButton id={2} onClick={changeHint} infos={infos}/>
        <HintButton id={3} onClick={changeHint} infos={infos}/>
        <HintButton id={4} onClick={changeHint} infos={infos}/>
        <HintButton id={5} onClick={changeHint} infos={infos}/>
      </div>
      <div style={{textAlign: 'center'}} className='row justify-content-md-center'>
        {(infos.won === null) ? (<Suggestions dataList={backendData} onClick={submitAnswer}/>) : (<GameEnd winner={infos.won} mapLink={infos.mapInfo.map_url}/>)}
      </div>
    </>
  )
  
}

export default App