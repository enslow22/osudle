import React from 'react'

export default function SubmitForm(props) {
  return (
    <>
    <input className={"form-control"} placeholder={"Map Title"} />
    <button className={"btn btn-primary"} onClick={props.onClick}>
        Submit
    </button>
    </>
  )
}
