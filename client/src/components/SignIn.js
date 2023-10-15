import React, { useState } from 'react'
import { Nav, Modal, Form } from 'react-bootstrap'

export default function SignIn() {


    function handleClick() {
        const url = new URL(
            "https://osu.ppy.sh/oauth/authorize"
        )
        
        const params = {
            "client_id": '25172',
            "redirect_uri": "http://192.168.1.15:3000/",
            "response_type": "code",
            "scope": "public identify",
            "state": "randomval",
        }


        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        fetch(url, {
            method:'GET',
        }).then(response => {response.json()})

    }

    return (
        <>
        <Nav>
        <Nav.Link variant='primary' className='ml-1'><h2 className='align-bottom' onClick={() => {handleClick()}}>Log In</h2></Nav.Link>
        </Nav>
        </>
    )
}
