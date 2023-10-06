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

await fetch('api/titles/').then(
  response => response.json()
).then(
  data => {
    titles = data
  }
)

await fetch('api/dailies/').then(
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
  },
  {
    path: "/:MOTD",
    element: <Game backendData={titles} dailies={dailies}/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" className='bg-body-tertiary rounded-3 rounded-top-0'>
        <Container>
          
          <Navbar.Brand href="/">
            <h1>osudle!</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/previous-maps"><h2>Previous Days</h2></Nav.Link>
            </Nav>

            <InfoModal/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br></br>
      <Container fluid>
        <RouterProvider router={router} />
      </Container>
  </React.StrictMode>
);

