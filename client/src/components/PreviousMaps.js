import React, { useState, useEffect } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'


//TODO: Add a popover for the thumbnail that contains the map name

// Takes the MOTD as well as the corresponds cookie in the props
function MapLinkFromLocal(props) {

  const saveData = JSON.parse(localStorage.getItem('DailyMap'.concat(props.MOTD)))

  const scores = (guesses, won) => {

    let scoreList = []

    for (var i = 0; i < guesses; i++) {
      scoreList.push(<div className='bg-danger rounded-2 d-inline px-2 m-1'></div>)
    }

    if (won) {
      scoreList.pop()
      scoreList.push(<div className='bg-success rounded-2 d-inline px-2 m-1'></div>)
    }

    while (scoreList.length < 6) {
      scoreList.push(<div className='bg-secondary rounded-2 d-inline px-2 m-1'></div>)
    }

    return(
      scoreList
    )
  }

  var col2 = scores(0, false)
  var col3 = <p>Not Played!</p>

  if (saveData !== null) {
    col2 = scores(saveData.guesses.length,saveData.won)
    col3 = saveData.won !== null ? <img className='img-thumbnail' src={props.mapBG}></img> : <p>Not Finished!</p>
  }

  return(
    <a className='text-decoration-none text-center' href={"previous-maps/"+props.MOTD}>
    <ListGroup.Item action>
      <Row className='justify-content-md-center align-items-center'>
        <Col>
          Map Number {props.MOTD}
        </Col>
        <Col>
          {col2}
        </Col>
        <Col>
          {col3}
        </Col>
      </Row>
    </ListGroup.Item>
    </a>
  )
}

export default function PreviousMaps(props) {

  const [backendData, setBackendData] = useState([])
  useEffect(() => {
    setBackendData(props.dailies)
  }, [])


  //let dayList = backendData.map((mapinfo, index) => {return <MapLink MOTD={mapinfo.MOTD}/>})
  let dayList = backendData.map((mapinfo, index) => {return <MapLinkFromLocal key={index} MOTD={mapinfo.MOTD} mapBG={mapinfo.background}/>})

  return (
    <div className='row justify-content-md-center'>
      <div className='col-5 list-group'>
        {dayList}
      </div>
      <div style={{height:'50px'}}></div>
    </div>
  )
}
