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

    var boxParams = 'col rounded-3 mx-1 '
    var boxStyle = {paddingBottom:"28%", maxHeight:'0px'}
    for (var i = 0; i < guesses; i++) {
      scoreList.push(<div style={boxStyle} className={boxParams+'bg-danger'}></div>)
    }

    if (won) {
      scoreList.pop()
      scoreList.push(<div style={boxStyle} className={boxParams+'bg-success'}></div>)
    }

    while (scoreList.length < 6) {
      scoreList.push(<div style={boxStyle} className={boxParams+'bg-secondary'}></div>)
    }

    return(
      scoreList
    )
  }

  var col2 = scores(0, false)
  var col3 = <span className='fs-3'>Not Played!</span>

  if (saveData !== null) {
    col2 = scores(saveData.guesses.length,saveData.won)
    col3 = saveData.won === null ? (<span className='fs-3'>Not Finished!</span>) : (props.hidden) ? <span className='fs-3'>Spoilers!</span> : (<OverlayTrigger placement='right' delay={{ show: 100, hide: 400 }} overlay={mapPreview}><img alt='' className='img-thumbnail img-fluid' style={{maxHeight:'100px'}} src={props.mapBG}></img></OverlayTrigger>)
  }

  return(
    <ListGroup.Item action>
      <a className='text-decoration-none text-center' href={"/?D="+props.MOTD}>
        <Row className='justify-content-between align-items-center flex-nowrap' style={{minHeight: '80px'}}>
          <Col className='fs-4'>
            Map Number {props.MOTD}
          </Col>
          <Col className='col-md-4'>
            <Row>
              <Col md={6}>
                <Row className='flex-nowrap justify-content-center my-1'>
                  {col2.slice(0,3)}
                </Row>
              </Col>
              <Col md={6}>
                <Row className='flex-nowrap justify-content-center my-1'>
                  {col2.slice(3,6)}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className='fs-4 col-md-4'>
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
  var stringList = saveDatas.map((save, index) => {return ('Day ' + parseInt(index+1) + ':\t' +  getBoxes(save).join(''))})
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
    <><div className='row justify-content-center'>
      <button className='col-3 btn btn-primary m-3 p-1' onClick={() => {handleOpen();}}>Export All Scores</button>
      <button className='col-3 btn btn-primary m-3 p-1' onClick={() => {setHidden(!hidden)}}>{(hidden) ? 'Show BGs' : 'Hide BGs'}</button>
      </div>
      <div className='row justify-content-md-center'>
        <div className='col list-group pb-3'>
          {props.dailies.map((mapinfo, index) => {return <MapLinkFromLocal key={mapinfo.map_id} save={saveDataList[index]} MOTD={mapinfo.MOTD} mapBG={mapinfo.background} title={mapinfo.title} link={mapinfo.map_url} hidden={hidden}/>})}
        </div>
        <Modal size='sm' scrollable='true' show={modalView} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Your Scores:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{fontSize : "16px"}}>It takes you {mean} guesses on average to figure out the map.</p>
            {scoreList.map((score, index) => {return<p className='text-center text-nowrap fs-5' key={index}>{score}</p>})}
          </Modal.Body>
          <Modal.Footer className='justify-content-center'>
            <Button variant="primary" onClick={() => {navigator.clipboard.writeText("Average guesses: " + parseFloat(mean) + "\n" + scoreList.join('\n')); setCopied(true)}}>
                {copied ? "Copied!" : "Copy to Clipboard" }
            </Button>
          </Modal.Footer>
        </Modal>
    </div></>
  )
}
