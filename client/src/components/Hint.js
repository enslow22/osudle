import React, { useEffect, useState } from 'react'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Image from 'react-bootstrap/Image'
import { Col, Row } from 'react-bootstrap'
import YouTube from 'react-youtube'
//import ReactCountryFlag from 'react-country-flag'

const VideoYT = (props) => {
  
  // Get ID from link. Maybe go fix this in the DB
  const youtubeID = props.src.replace("https://youtu.be/", '')

  const [player, setPlayer] = useState(null);

  // Handle pause
  useEffect(() => {
    console.log(player)
    try {
    if (player) {player.pauseVideo()}}
    catch (err) {
      console.log(err)
    }
  // eslint-disable-next-line
  }, [props.visible])

  // When player is ready, save the player object into state
  const onPlayerReady = (event) => {
    setPlayer(event.target)
  }

  return(
    <div style={{display:(props.visible) ? 'inline' : 'none'}}>
      <div className='bg-body-tertiary p-2 rounded-3'>
        <YouTube className='ratio ratio-16x9' videoId={youtubeID} opts={props.opts} onReady={onPlayerReady}/>
  </div></div>)
}

const StatsHint = (props) => {

  const InfoRow = (key, value) => {
    return(
    <Row className='justify-content-center'>
      <Col className='text-end'>
        <h2 className='p-1 fs-1'>{key}:</h2>
      </Col>
      <Col>
        <h2 className='p-1 fs-1'>{value}</h2>
      </Col>
    </Row>)
  }

  return(
  <div className='overflow-auto' style={{display:(props.visible) ? 'inline' : 'none'}}>
    <div className='bg-body-tertiary rounded-3 p-3'>
      {InfoRow('Artist', props.artistName)}
      {InfoRow('Map Length', props.length)}
      {InfoRow('Star Rating', props.starRating+" \u2606 ")}
      {InfoRow('Language', props.language)}
      {InfoRow('Genre', props.genre  )}
    </div>
  </div>)

}

const MapperHint = (props) => {
  return(
      <div style={{display:(props.visible) ? 'inline' : 'none'}}>
        <div className='bg-body-tertiary rounded-3 px-4'>
          <Row className='justify-content-between'>
            <Col md='auto'>
              <h1 className='display-3 text-start d-inline-flex'>Mapper:</h1>
            </Col>

          </Row>

          <Row className='justify-content-center pb-3 '>
            <Image className='w-25' src={props.mapperAvatar} fluid rounded/>
          </Row>

          <Row className='justify-content-center pb-3'>
              <a href={props.mapperUrl} target="_blank" rel="noreferrer"><h1 className='p-2 fs-1 text-center'>{props.mapperName}</h1></a>
          </Row>
        </div>
      </div>
  )
}

const BackgroundHint = (props) => {

  var blurAmount = (props.blur === null ? 'blur(15px)' : 'blur(0px)')

  return(
  <div style={{display:(props.visible) ? 'block' : 'none'}}>
    <div className='bg-body-tertiary p-3 rounded-3' >
      <h1>Background:</h1>
      <br></br>
      <Image className='p-3' src={props.bgUrl} style={{filter: blurAmount}} fluid rounded/>
    </div>
  </div>
  )
}

export default function Hint(props) {

  var YTOptions = {
    playerVars : {rel: 0}
  }

  const data = props.mapData

  const time = new Date(data.map_length * 1000).toISOString()

  return(
    <div className='justify-content-center ratio ratio-16x9 pb-4 d-flex' style={{width:'1000px'}}>

        <VideoYT src={data.youtube_link_1} visible={props.hintNumber===0} opts={YTOptions}/>
        <VideoYT src={data.youtube_link_2} visible={props.hintNumber===1} opts={YTOptions}/>
        <MapperHint  visible={props.hintNumber === 2} mapperName={data.mapper_name} mapperAvatar={data.mapper_avatar} mapperUrl={data.mapper_url} previousNames={data.mapper_previous_names}/>
        <StatsHint  visible={props.hintNumber === 3} artistName={data.artist} length={(data.map_length >= 600) ? time.slice(14, 19) : time.slice(15,19)} starRating={data.star_rating} language={data.language} genre={data.genre}/>
        <BackgroundHint  visible={props.hintNumber === 4} bgUrl={data.background} blur={props.won}/>
        <VideoYT src={data.youtube_link_3} visible={props.hintNumber===5} opts={YTOptions}/>

    </div>
  )
}
