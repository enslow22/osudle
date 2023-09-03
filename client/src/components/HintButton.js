import { string } from 'mathjs'
import React from 'react'


export default function HintButton(props) {

  return (
    <button className={"btn btn-primary btn-lg"} style={{margin:'5px 15px 5px'}} disabled={props.infos.hintsUnlocked < props.id} onClick={(e) => props.onClick(e, props.id)}>
      {string(props.id+1)}
    </button>
  )
}
