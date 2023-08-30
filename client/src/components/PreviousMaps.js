import React, { useState, useEffect } from 'react'


function MapLink(props) {
  return <a style={{textAlign:'center', padding:'15px', fontSize:'22px'}} class="list-group-item list-group-item-action" href={"previous-maps/"+props.MOTD}>Map Number {props.MOTD}</a>
}

export default function PreviousMaps(props) {

  const [backendData, setBackendData] = useState([])

  useEffect(() => {
    setBackendData(props.dailies)
  }, [])


  
  let dayList = backendData.map((mapinfo, index) => {return <MapLink MOTD={mapinfo.MOTD}/>})

  /** 
  let dayList = backendData.map((mapinfo, index) => {return <li key={mapinfo.MOTD} style={{color:'#FF8EE6'}}><MapLink MOTD={mapinfo.MOTD}/></li>})
  

  return (
    <div  className='row justify-content-md-center'>
      <ol style={{listStyle:'none', fontSize:'20px'}}>
        {dayList}
      </ol>
    </div>
  )
  */

  return (
    <div className='row justify-content-md-center'>
      <div className='col-5 list-group'>
        {dayList}
      </div>
    </div>
  )
}
