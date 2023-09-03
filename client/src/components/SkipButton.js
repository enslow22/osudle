import React from 'react'

export default function SkipButton(props) {
  return (
    <button className='btn btn-primary btn-lg' style={{margin:'20px 15px'}} onClick={(e) => {props.onClick(e, 'Skipped!')}}>Skip</button>
  )
}
