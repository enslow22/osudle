import React, { useState, useContext } from 'react'
import { AuthContext } from '../index'
import { Nav, Dropdown, Modal, Button, Form } from 'react-bootstrap'

export default function SignIn() {

    const {loggedIn, checkLoginState, user} = useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)
    const [sugFields, setSugFields] = useState({mapId: '', userId: '', times: '', notes: ''})

    async function postSuggestion(data) {
        var postUrl = 'api/submitTip/'
        const res = await fetch(postUrl, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "manual",
            referrerPolicy: 'same-origin',
            body: JSON.stringify(data),
        });
        if (res.status === 200) {
            alert('Thank you for your contribution!')
            setShowModal(false)
        }
        else if (res.status === 500) {
            alert('Something went wrong, submission may be closed for now :(')
        }
    }

    function isInt(value) {
        return !isNaN(value) && parseInt(value) == value && !isNaN(parseInt(value, 10));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Ensure both fields are integers
        const mapId = sugFields.mapId
        const times = sugFields.times
        const notes = sugFields.notes
        console.log(mapId)
        if (isInt(mapId)) {
            await postSuggestion({mapId: mapId, userId: user.id, times: times, notes: notes})
            setSugFields({mapId: '', userId: '', times: '', notes: ''})
        }
        else {
            alert("One or more of your inputs was not a valid integer")
        }
    }

    const handleLogout = async () => {

        try {
    
            await fetch(`auth/logout/`, 
            {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'same-origin'
            });
    
          // Check login state again to update context
    
          checkLoginState();
    
        } catch (err) {
    
          console.error(err);
    
        }
    
    }

    return (
        <>
            {(!loggedIn || user === null) ? 
            <Nav>
                <Nav.Link variant='primary' className='ml-1 text-nowrap me-auto' href='https://osu.ppy.sh/oauth/authorize?client_id=27333&redirect_uri=https://www.osudle.com/callback&response_type=code'>
                    <h2 className='align-bottom'>
                        Sign In
                    </h2>
                </Nav.Link>
            </Nav> 
            : 
            <>
                <Dropdown align='start' drop='down-centered'>
                    <Dropdown.Toggle as='image'>
                        <img className='rounded-5 img-fluid mx-1' alt='you!' style={{maxHeight: '64px'}} src={user.avatar_url}></img>
                    </Dropdown.Toggle >
                    <Dropdown.Menu align={{ lg: 'end' }}>
                        <Dropdown.Item onClick={() => setShowModal(true)}>Submissions</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Modal show={showModal} onHide={() => {setShowModal(false)}} size='md' dialogClassName="py-5" aria-labelledby="Suggestions">
                    <Modal.Header closeButton>
                        <Modal.Title id="Suggestions" >
                            Suggestions Box
                        </Modal.Title>
                    </Modal.Header>
                    <Form method='POST' onSubmit={(e)=>{handleSubmit(e);}} autoComplete='off'>
                        <Modal.Body>
                            <h5>Feel free to use this to suggest any maps you would like to see featured in osudle!</h5>

                                <Form.Group controlId='link' className='pb-2'>
                                    <Form.Label>Map Id:</Form.Label>
                                    <Form.Control type={'text'} placeholder='ex: 4148965' autoFocus onChange={(e) => setSugFields({...sugFields, mapId: e.target.value})}/>
                                </Form.Group>
                                <Form.Group controlId='times'>
                                    <Form.Label>Times for the video to start in seconds (optional):</Form.Label>
                                    <Form.Control type={'text'} placeholder='ex: [14, 50, 71]' onChange={(e) => setSugFields({...sugFields, times: e.target.value})}/>
                                </Form.Group>
                                <Form.Group controlId='times'>
                                    <Form.Label>Any other details (optional):</Form.Label>
                                    <Form.Control type={'text'} onChange={(e) => setSugFields({...sugFields, notes: e.target.value})}/>
                                </Form.Group>
                            
                        </Modal.Body>
                        <Modal.Footer>
                                <Button variant="secondary" onClick={() => {setShowModal(false)}}>
                                    Close
                                </Button>
                                <Button variant="primary" type='submit'>
                                    Submit
                                </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

            </>
            }
        </>
    )
}
