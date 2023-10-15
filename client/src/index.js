import React from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Game from './components/Game';
import "./index.css";
import PreviousMaps from "./components/PreviousMaps";
import { Navbar, Nav, Container } from 'react-bootstrap';
import InfoModal from './components/InfoModal';

// dailies is an araray of objects that stores all of hte daily maps
// allData is every row in the db (each row coreresponds to an osu map)
var dailies = null
var titles = null

var titlesurl = '/api/titles/'
var dailiesurl = '/api/dailies/'

if (process.env.NODE_ENV === 'development') {
  titlesurl = 'http://localhost:5000/api/titles/'
  dailiesurl = 'http://localhost:5000/api/dailies/'
}

await fetch(titlesurl).then(
  response => response.json()
).then(
  data => {
    titles = data
  }
)

await fetch(dailiesurl).then(
  response => response.json()
).then(
  data => {
    dailies = data.sort((a, b) => {return (a.MOTD > b.MOTD) ? 1 : -1})
  }
)


// Routes for each url
const router = createBrowserRouter([
  {
    path: "/",
    element: <Game backendData={titles} dailies={dailies}/>,
    errorElement: <h1>{"uwu sowwy we cuudent find youw page >ww<"}</h1>
  },
  {
    path: "previous-maps",
    element: <PreviousMaps dailies={dailies}/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Container fluid>
        <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" className='bg-body-tertiary rounded-3 rounded-top-0 px-3'>
            
            <Navbar.Brand href="/">
              <h1>osudle!</h1>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/previous-maps"><h2>Previous Maps</h2></Nav.Link>
              </Nav>
              <InfoModal/>
            </Navbar.Collapse>
        </Navbar>
      
      <br></br>
      <RouterProvider router={router} />
      </Container>
  </React.StrictMode>
);

