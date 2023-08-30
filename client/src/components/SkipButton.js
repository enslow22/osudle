import React from 'react'

export default function SkipButton(props) {
  return (
    <button className='btn btn-primary btn-lg' style={{margin:'5px 20px 25px'}} onClick={(e) => {props.onClick(e, 'Skipped!')}}>Skip</button>
  )
}
