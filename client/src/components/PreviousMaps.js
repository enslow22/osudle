import { ListGroup, Row, Col, OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'

function MapLinkFromLocal(props) {
  const saveData = props.save

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


function getBoxes(saveData) {
  
  if (saveData === null) {
    return ['\u2B1B','\u2B1B','\u2B1B','\u2B1B','\u2B1B','\u2B1B']
  }
  
  let scoreList = []

  for (var i = 0; i < saveData.guesses.length; i++) {
    scoreList.push('\u{1F7E5}')
  }

  if (saveData.won) {
    scoreList.pop()
    scoreList.push('\u{1F7E9}')
  }

  while (scoreList.length < 6) {
    scoreList.push('\u2B1B')
  }

  return scoreList

}

function ExportAll(saveDatas) {
  var stringList = saveDatas.map((save, index) => {return ('Day ' + parseInt(index+1) + ': ' +  getBoxes(save).join(''))})
  return stringList
}

function getStats(saveDatas) {
  var scoresList = []
  var numScores = saveDatas.length
  saveDatas.map((save, index) => {(save != null && save.won != null) ? scoresList.push(save.score) : numScores--})
  
  // Returns mean
  var mean = (1+scoresList.reduce((a, b) => a + b, 0)/scoresList.length).toFixed(2)
 
  return  isNaN(mean) ? 0 : mean
}

export default function PreviousMaps(props) {

  const [hidden, setHidden] = useState(true)
  const [modalView, setModalView] = useState(false)
  const [saveDataList, setSaveDataList] = useState([])
  const [scoreList, setScoreList] = useState([])
  const [copied, setCopied] = useState(false)
  const [mean, setMean] = useState(0)
  
  useEffect(() => {
    var tempSaveList = []
    for (var i = 1; i <= props.dailies.length; i++) {
      tempSaveList.push( JSON.parse(localStorage.getItem('DailyMap'.concat(i))) )
    }
    
    // List of all scores
    setScoreList(ExportAll(tempSaveList))
    setSaveDataList(tempSaveList)
    setMean(getStats(tempSaveList))
  }, [])


  const handleOpen = () => {
    setModalView(true)
  }
  
  const handleClose = () => {
    setModalView(false)
  }

  return (
    (saveDataList.length == 0) ? <></> :
    <div className='row justify-content-md-center'>
      <button className='col-3 btn btn-primary m-3 p-1' onClick={() => {handleOpen();}}>Export Scores</button>
      <button className='col-3 btn btn-primary m-3 p-1' onClick={() => {setHidden(!hidden)}}>{(hidden) ? 'Show Thumbnails' : 'Hide Thumbnails'}</button>
      <div className='col-7 list-group'>
        {props.dailies.map((mapinfo, index) => {return <MapLinkFromLocal key={mapinfo.map_id} save={saveDataList[index]} MOTD={mapinfo.MOTD} mapBG={mapinfo.background} title={mapinfo.title} link={mapinfo.map_url} hidden={hidden}/>})}
      </div>
      <div style={{height:'50px'}}></div>
      <Modal size='sm' scrollable='true' show={modalView} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Scores:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{fontSize : "18px"}}>It takes you {mean} guesses on average to figure out the map.</p>
          {scoreList.map((score, index) => {return<p className='text-center' style={{fontSize: "22px"}} key={index}>{score}</p>})}
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
          <Button variant="primary" onClick={() => {navigator.clipboard.writeText("Average guesses: " + parseFloat(mean) + "\n" + scoreList.join('\n')); setCopied(true)}}>
              {copied ? "Copied!" : "Copy to Clipboard" }
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
