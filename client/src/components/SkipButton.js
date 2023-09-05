import React from 'react'

export default function SkipButton(props) {
  return (
    <button className='btn btn-primary btn-lg mx-2 my-1' onClick={(e) => {props.onClick(e, {title:'Skipped!', diff: null, background: null})}}>Skip</button>
  )
}
