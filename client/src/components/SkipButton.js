import React from 'react'

export default function SkipButton(props) {
  return (
    <button style={{maxWidth:'100px'}} className='col btn btn-primary btn-lg m-4' onClick={(e) => {props.onClick(e, {title:'Skipped!', diff: null, background: null})}}>Skip</button>
  )
}
