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

const elapsed = dayjs().diff(dayjs('2023-08-11 00:00'), 'day');
var dailies = null
var allData = null

await fetch("/api").then(
  response => response.json()
).then(
  data => {
    allData = data
    dailies = data.filter((row) => (row.MOTD !== -1 && row.MOTD < elapsed)).sort((a, b) => {return (a.MOTD > b.MOTD) ? 1 : -1})
  }
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game backendData={allData} dailies={dailies}/>,
    errorElement: <h1>{"uwu sowwy we made a fuksy wucksies and we cuudent find youw page >ww<"}</h1>
  },
  {
    path: "previous-maps",
    element: <PreviousMaps dailies={dailies}/>,
  },
  {
    path: "/previous-maps/:MOTD",
    element: <><Game backendData={allData} dailies={dailies}/></>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

