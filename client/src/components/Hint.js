import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import PropTypes from 'prop-types'


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

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

const StatsHint = (props) => {
  return(
  <>
    <p>Map Length: {props.length}</p>
    <p>Star Rating: {props.starRating}</p>
    <p>Language: {props.language}</p>
    <p>Genre: {props.genre}</p>
  </>)
}

const MapperHint = (props) => {
  return(
    <>
    <a href={props.mapperUrl}>{props.mapperName}</a>
    <br></br>
    <img src={props.mapperAvatar}></img>
    </>
  )
}

const BackgroundHint = (props) => {

  return(
  <>
  <p>Artist: {props.artistName}</p>
  <img src={props.bgUrl}></img>
  </>
  )
}

function HintInfo({render, id, data}) {
  if (!render) {
    return null
  }

  var play = {
    fill: true,
    fluid: true,
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources:
      {
        src: null,
        type: "application/x-mpegURL"
      }
  };

  switch (id) {
    case 0:
      play.sources['src'] =  data.cloudinary_link_3
      return <Video {...play} />
    case 1:
      play.sources['src'] =  data.cloudinary_link_2
      return <Video {...play} />
    case 2:
      const time = new Date(data.map_length * 1000).toISOString()
      return <StatsHint length={(data.map_length >= 600) ? time.slice(14, 19) : time.slice(15,19)} starRating={data.star_rating} language={data.language} genre={data.genre}/>
    case 3:
      return <MapperHint mapperName={data.mapper_name} mapperAvatar={data.mapper_avatar} mapperUrl={data.mapper_url} previousNames={data.mapper_previous_names}/>
    case 4:
      return <BackgroundHint artistName={data.artist} bgUrl={data.background}/>
    case 5:
      play.sources['src'] =  data.cloudinary_link_1
      return <Video {...play} />
  }
}


export default function Hint(props) {

  Hint.defaultProps = {
    type: "text",
    inactive: true
  }

  return (
    <div>
      <HintInfo render={props.hintNumber === 0} id={0} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 1} id={1} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 2} id={2} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 3} id={3} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 4} id={4} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 5} id={5} data={props.mapData}/>
    </div>
  )

}
