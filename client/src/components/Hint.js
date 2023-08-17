import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

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
  <div className='col align-self-center p-3 mb-2 bg-body-tertiary'>
    <h2>Map Length: {props.length}</h2>
    <h2>Star Rating: {props.starRating}</h2>
    <h2>Language: {props.language}</h2>
    <h2>Genre: {props.genre}</h2>
  </div>
  )
}

const MapperHint = (props) => {
  return(
    <>
    <div className='col align-self-start p-3 mb-2 bg-body-tertiary'>
      <img className='rounded-5' src={props.mapperAvatar}></img>  
      <h2><a href={props.mapperUrl}>{props.mapperName}</a></h2>
    </div>
    </>
  )
}

const BackgroundHint = (props) => {

  return(
  <div className='col align-self-center p-3 mb-2 bg-body-tertiary'>
  <img src={props.bgUrl}></img>
  <h2>Artist: {props.artistName}</h2>
  </div>
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
      play.sources['src'] =  data.cloudinary_link_1
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
      play.sources['src'] =  data.cloudinary_link_3
      return <Video {...play} />
  }
}

export default function Hint(props) {

  return (
    <>
      <HintInfo render={props.hintNumber === 0} id={0} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 1} id={1} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 2} id={2} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 3} id={3} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 4} id={4} data={props.mapData}/>
      <HintInfo render={props.hintNumber === 5} id={5} data={props.mapData}/>
    </>
  )

}
