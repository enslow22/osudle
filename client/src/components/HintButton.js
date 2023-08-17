import { string } from 'mathjs'
import React from 'react'


export default function HintButton(props) {

  return (
    <button className={"btn btn-primary"} style={{margin:'5px 10px 25px'}} disabled={props.infos.score < props.id} onClick={(e) => props.onClick(e, props.id)}>
      {string(props.id+1)}
    </button>
  )
}
