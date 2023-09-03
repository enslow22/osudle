import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Image from 'react-bootstrap/Image'
import { Button, Col, Row } from 'react-bootstrap'
//import ReactCountryFlag from 'react-country-flag'

// TODO:
// Hide elements instead of unmounting them to save video bandwidth !!!!!!

const Video = (props) => {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (videoNode.current) {
      const _player = videojs(videoNode.current, props);
      setPlayer(_player);
      return () => {
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (player !== null) {
      player.pause();
    }
  }, [props.visible])

  return (
    <div className='data-vjs-player' style={{display:(props.visible) ? 'inline' : 'none'}}>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

const StatsHint = (props) => {
  return(
  <div className='col align-self-center p-3 mb-2 bg-body-tertiary' style={{display:(props.visible) ? 'block' : 'none'}}>
    <h2>Artist: {props.artistName}</h2>
    <h2>Map Length: {props.length}</h2>
    <h2>Star Rating: {props.starRating}</h2>
    <h2>Language: {props.language}</h2>
    <h2>Genre: {props.genre}</h2>
  </div>
  )
}

const MapperHint = (props) => {
  return(
    <Row className='p-3 mb-2 bg-body-tertiary' fluid="md" style={{display:(props.visible) ? '' : 'none'}}>
      <Col md="auto">
        <Image src={props.mapperAvatar} fluid rounded/>
      </Col>
      <Col>
        <h1 style={{fontSize:"80px"}}>{props.mapperName}</h1>
      </Col>
      <Col md="auto">
        <Button variant="outline-secondary" size='md' href={props.mapperUrl} target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
          </svg>
        </Button>
      </Col>
    </Row>
  )
}

const BackgroundHint = (props) => {

  return(
  <div className='col align-self-center p-3 mb-2 bg-body-tertiary' style={{display:(props.visible) ? 'block' : 'none'}}>
  <Image src={props.bgUrl} fluid rounded/>
  </div>
  )
}

export default function Hint(props) {

  var play = {
    fill: true,
    fluid: true,
    autoplay: false,
    controls: true,
    preload: "metadata",
    sources:
      {
        src: null,
        type: "application/x-mpegURL"
      }
  };

  const data = props.mapData
  const time = new Date(data.map_length * 1000).toISOString()

  return(
  <>
    <Video {...play} sources={{src: data.cloudinary_link_1, type: "application/x-mpegURL"}} visible={props.hintNumber === 0}/>
    <Video {...play} sources={{src: data.cloudinary_link_2, type: "application/x-mpegURL"}} visible={props.hintNumber === 1}/>
    <MapperHint  visible={props.hintNumber === 2} mapperName={data.mapper_name} mapperAvatar={data.mapper_avatar} mapperUrl={data.mapper_url} previousNames={data.mapper_previous_names}/>
    <StatsHint  visible={props.hintNumber === 3} artistName={data.artist} length={(data.map_length >= 600) ? time.slice(14, 19) : time.slice(15,19)} starRating={data.star_rating} language={data.language} genre={data.genre}/>
    <BackgroundHint  visible={props.hintNumber === 4} bgUrl={data.background}/>
    <Video {...play} sources={{src: data.cloudinary_link_3, type: "application/x-mpegURL"}} visible={props.hintNumber === 5}/>
  </>
  )
}
