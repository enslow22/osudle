import { ListGroup, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap'
import { useState } from 'react'

function MapLinkFromLocal(props) {

  const saveData = JSON.parse(localStorage.getItem('DailyMap'.concat(props.MOTD)))

  const mapPreview = (
    <Popover id='popover-basic' key={props.id}>
      <Popover.Body>
        <a href={props.link} target="_blank" rel='noopener noreferrer'><h4>{props.title}</h4></a>
      </Popover.Body>
    </Popover>)

  const scores = (guesses, won) => {

    let scoreList = []

    for (var i = 0; i < guesses; i++) {
      scoreList.push(<div className='bg-danger rounded-2 d-inline px-3 py-2 m-1'></div>)
    }

    if (won) {
      scoreList.pop()
      scoreList.push(<div className='bg-success rounded-2 d-inline px-3 py-2 m-1'></div>)
    }

    while (scoreList.length < 6) {
      scoreList.push(<div className='bg-secondary rounded-2 d-inline px-3 py-2 m-1'></div>)
    }

    return(
      scoreList
    )
  }

  var col2 = scores(0, false)
  var col3 = <>Not Played!</>

  if (saveData !== null) {
    col2 = scores(saveData.guesses.length,saveData.won)
    col3 = saveData.won === null ? (<>Not Finished!</>) : (props.hidden) ? <>Spoilers!</> : (<OverlayTrigger placement='right' delay={{ show: 100, hide: 400 }} overlay={mapPreview}><img alt='' className='img-thumbnail' src={props.mapBG}></img></OverlayTrigger>)
  }

  return(
      <ListGroup.Item action>
        <a className='text-decoration-none text-center' href={"/"+props.MOTD}>
          <Row className='justify-content-md-center align-items-center' style={{height: '70px'}}>
            <Col className='fs-3'>
              Map Number {props.MOTD}
            </Col>
            <Col>
              {col2}
            </Col>
            <Col className='fs-3 align-items-center'>
              {col3}
            </Col>
          </Row>
        </a>
      </ListGroup.Item>
  )
}

export default function PreviousMaps(props) {

  const [hidden, setHidden] = useState(true)

  const dayList = props.dailies.map((mapinfo, index) => {return <MapLinkFromLocal key={mapinfo.map_id} MOTD={mapinfo.MOTD} mapBG={mapinfo.background} title={mapinfo.title} link={mapinfo.map_url} hidden={hidden}/>})

  return (
    <div className='row justify-content-md-center'>
      <button className='col-5 btn btn-primary m-3 p-1' onClick={() => {setHidden(!hidden)}}>{(hidden) ? 'Show Maps' : 'Hide Maps'}</button>
      <div className='col-7 list-group'>
        {dayList}
      </div>
      <div style={{height:'50px'}}></div>
    </div>
  )
}
