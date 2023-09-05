import { string } from 'mathjs'
import React from 'react'


export default function HintButton(props) {

  return (
    <button className={"btn btn-primary btn-lg px-4 mx-3 my-1 ".concat((props.id === props.infos.hint) ? 'border border-primary-subtle border-5': '')} disabled={props.infos.hintsUnlocked < props.id} onClick={(e) => props.onClick(e, props.id)}>
      {string(props.id+1)}
    </button>
  )
}
