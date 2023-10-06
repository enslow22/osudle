import React from 'react'

export default function HintButton(props) {

  return (
    <button style={{maxWidth: '70px'}} className={"col btn btn-primary btn-lg m-4 ".concat((props.id === props.infos.hint) ? 'border border-primary-subtle border-5': '')} disabled={props.infos.hintsUnlocked < props.id} onClick={(e) => props.onClick(e, props.id)}>
      {props.id+1}
    </button>
  )
}
