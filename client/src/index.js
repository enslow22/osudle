import React from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Game from './components/Game';
import "./index.css";
import PreviousMaps from "./components/PreviousMaps";
import dayjs from "dayjs";
import { Navbar, Nav, Container } from 'react-bootstrap';
import InfoModal from './components/InfoModal';

// Calculate the number of days since the start of osudle!
//const elapsed = dayjs().diff(dayjs('2023-08-11 00:00'), 'day');
const elapsed = dayjs().diff(dayjs('2023-09-08 00:00'), 'day')

// dailies is an araray of objects that stores all of hte daily maps
// allData is every row in the db (each row coreresponds to an osu map)
var dailies = null
var allData = null

// Get data from backend
await fetch('http://146.190.33.184:5000/api').then(
  response => response.json()
).then(
  data => {
    console.log(data)
    allData = data
    dailies = data.filter((row) => (row.MOTD !== -1 && row.MOTD < elapsed)).sort((a, b) => {return (a.MOTD > b.MOTD) ? 1 : -1})
  }
)

// Routes for each url
const router = createBrowserRouter([
  {
    path: "/",
    element: <Game backendData={allData} dailies={dailies}/>,
    errorElement: <h1>{"uwu sowwy we cuudent find youw page >ww<"}</h1>
  },
  {
    path: "previous-maps",
    element: <PreviousMaps dailies={dailies}/>,
  },
  {
    path: "/previous-maps/:MOTD",
    element: <Game backendData={allData} dailies={dailies}/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand href="/">
          <h1>osudle!</h1>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/previous-maps"><h2>Previous Days</h2></Nav.Link>
        </Nav>
        <InfoModal/>
      </Navbar>
      <Container>
        <RouterProvider router={router} />
      </Container>
  </React.StrictMode>
);

