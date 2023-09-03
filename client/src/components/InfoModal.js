import { filter } from 'mathjs';
import React, { useState } from 'react'
import { Modal, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'

export default function InfoModal(props) {

    const [showModals, setShowModals] = useState([false, false])
    const openModal = (num) => {
        setShowModals(num === 0 ? [true, false] : [false, true])
    }
    const closeModal = () => {
        setShowModals([false, false])
    }

    const defaultColor = (e) => {e.target.style.fill = 'white'}
    const hoverColor = (e) => {e.target.style.fill = '#ffa4d6';}

    const discordName = (props) => (
        <Tooltip {...props}>
            Discord ID: enslow
        </Tooltip>
    )   

    return (
        <>
        <Button variant='primary' onClick={function() {openModal(0)}}>
            Info
        </Button>&emsp;
        <Button variant='primary' onClick={function() {openModal(1)}}>Me!</Button>

        <Modal show={showModals[0]} onHide={closeModal} size='md'>
            <Modal.Header closeButton centered>
                <Modal.Title id="info">
                    Info !
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You have 6 chances to deduce the title of the map based on the hints provided!</p>
                
            </Modal.Body>
        </Modal>

        <Modal show={showModals[1]} onHide={closeModal} size='md'>
            <Modal.Header closeButton centered>
                <Modal.Title id="me">
                    About Me
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>I'm enslow, and I built this as a side project for fun. It's heavily inspired by <a href='http://www.guessthe.game'>guessthe.game</a></p>
                <p>I plan on maintaining this for a while, so if you have suggestions (features, map suggestions, etc.) feel free to send me a message!</p>
                <h1>

                <a href='https://osu.ppy.sh/users/10651409' target='_blank' style={{textDecorationLine: 'none'}}>
                <svg onMouseOver={hoverColor} onMouseOut={defaultColor} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-osu" viewBox="0 0 300 300">
                <path d="M75.1 181.4c-4.7 0-8.8-.8-12.3-2.3s-6.4-3.7-8.6-6.4c-2.3-2.7-4-5.9-5.2-9.6s-1.7-7.6-1.7-11.9.6-8.3 1.7-12c1.2-3.7 2.9-7 5.2-9.7s5.2-4.9 8.6-6.5 7.6-2.4 12.3-2.4 8.8.8 12.3 2.4 6.4 3.7 8.8 6.5c2.3 2.7 4 6 5.2 9.7 1.1 3.7 1.7 7.7 1.7 12s-.6 8.2-1.7 11.9-2.8 6.9-5.2 9.6c-2.3 2.7-5.2 4.9-8.8 6.4-3.4 1.6-7.6 2.3-12.3 2.3zm0-12.1c4.2 0 7.2-1.6 9-4.7s2.7-7.6 2.7-13.4-.9-10.3-2.7-13.4-4.8-4.7-9-4.7c-4.1 0-7.1 1.6-8.9 4.7s-2.7 7.6-2.7 13.4.9 10.3 2.7 13.4c1.8 3.2 4.8 4.7 8.9 4.7zm51.8-14.5c-4.2-1.2-7.5-3-9.8-5.3-2.4-2.4-3.5-5.9-3.5-10.6 0-5.7 2-10.1 6.1-13.4 4.1-3.2 9.6-4.8 16.7-4.8 2.9 0 5.8.3 8.6.8s5.7 1.3 8.6 2.4c-.2 1.9-.5 4-1.1 6.1s-1.3 3.9-2.1 5.5c-1.8-.7-3.8-1.4-5.9-2-2.2-.6-4.5-.8-6.8-.8-2.5 0-4.5.4-5.9 1.2s-2.1 2-2.1 3.8c0 1.6.5 2.8 1.5 3.5s2.4 1.3 4.3 1.9l6.4 1.9c2.1.6 4 1.3 5.7 2.2s3.1 1.9 4.3 3.2 2.1 2.8 2.8 4.7 1 4.2 1 6.8c0 2.8-.6 5.3-1.7 7.7-1.2 2.4-2.8 4.5-5 6.2-2.2 1.8-4.9 3.1-8 4.2-3.1 1-6.7 1.5-10.7 1.5-1.8 0-3.4-.1-4.9-.2s-2.9-.3-4.3-.6-2.7-.6-4.1-1c-1.3-.4-2.8-.9-4.4-1.5.1-2 .5-4.1 1.1-6.1.6-2.1 1.3-4.1 2.2-6 2.5 1 4.8 1.7 7 2.2s4.5.7 6.9.7c1 0 2.2-.1 3.4-.3s2.4-.5 3.4-1 1.9-1.1 2.6-1.9 1.1-1.8 1.1-3.1c0-1.8-.5-3.1-1.6-3.9s-2.6-1.5-4.5-2.1zm39.3-32.7c2.7-.4 5.3-.7 8-.7 2.6 0 5.3.2 8 .7v30.7c0 3.1.2 5.6.7 7.6s1.2 3.6 2.2 4.7c1 1.2 2.3 2 3.8 2.5s3.3.7 5.3.7c2.8 0 5.1-.3 7-.8v-45.4c2.7-.4 5.3-.7 7.9-.7s5.3.2 8 .7v55.8c-2.4.8-5.6 1.6-9.5 2.4s-8 1.2-12.3 1.2c-3.8 0-7.5-.3-11-.9s-6.6-1.9-9.3-3.8-4.8-4.8-6.3-8.5c-1.6-3.7-2.4-8.7-2.4-14.9v-31.3zm65.9 58c-.4-2.8-.7-5.5-.7-8.2s.2-5.5.7-8.3c2.8-.4 5.5-.7 8.2-.7s5.5.2 8.3.7c.4 2.8.7 5.6.7 8.2 0 2.8-.2 5.5-.7 8.3-2.8.4-5.6.7-8.2.7-2.8-.1-5.5-.3-8.3-.7zm-.4-80.7c2.9-.4 5.8-.7 8.6-.7 2.9 0 5.8.2 8.8.7l-1.1 54.9c-2.6.4-5.1.7-7.5.7-2.5 0-5.1-.2-7.6-.7z M150 0C67.2 0 0 67.2 0 150s67.2 150 150 150 150-67.2 150-150S232.8 0 150 0zm0 285c-74.6 0-135-60.4-135-135S75.4 15 150 15s135 60.4 135 135-60.4 135-135 135z"/>
                </svg></a>&emsp;

                <a href='https://twitter.com/ensl0' target='_blank' style={{textDecorationLine: 'none', fill:"white"}}>
                <svg onMouseOver={hoverColor} onMouseOut={defaultColor} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-twitter" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg></a>&emsp;
                
                <OverlayTrigger placement='bottom' overlay={discordName} onMouseOver={hoverColor} onMouseOut={defaultColor}>
                    <svg  xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-discord" viewBox="0 0 16 16">
                        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                    </svg>
                </OverlayTrigger>

                </h1>
            </Modal.Body>
            
        </Modal>
        </>
    )
} 