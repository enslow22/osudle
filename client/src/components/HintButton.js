import { string } from 'mathjs'
import React from 'react'


export default function HintButton(props) {

  return (
    <div className='col'>
    <button className={"btn btn-primary"} disabled={props.score < props.id} onClick={(e) => props.onClick(e, props.id)}>
      {string(props.id)}
    </button>
   </div>
  )
}
