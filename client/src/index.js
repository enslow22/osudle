import React, { useEffect, useState, useContext, createContext, useCallback, useRef } from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, useNavigate, } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';
import PreviousMaps from "./components/PreviousMaps";
import Tutorial from './components/Tutorial';   
import SignIn from './components/SignIn';
import About from './components/About';
import Game from './components/Game';
import "./index.css";
import Privacy from './components/Privacy';

// dailies is an araray of objects that stores all of hte daily maps
// allData is every row in the db (each row coreresponds to an osu map)
var dailies = null
var titles = null

var titlesurl = 'api/titles/'
var dailiesurl = 'api/dailies/'


// Get data from backend
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


export const AuthContext = createContext();

const AuthContextProvider = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  const checkLoginState = useCallback(async () => {
    try {
      const data = await fetch(`auth/logged_in/`, { credentials: 'same-origin', }).then(response => response.json());
      setLoggedIn(data.loggedIn)
      setUser(data.user)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return(
    <AuthContext.Provider value={{loggedIn, checkLoginState, user}}>
      {children}
    </AuthContext.Provider>
  )
}


// If the oauth reponse is good, store the access token in a cookie? Then we can use the cookie to make any requests
function Authenticate() {
  const {checkLoginState, loggedIn} = useContext(AuthContext)
  const urlparams = new URLSearchParams(window.location.search)
  const authCode = urlparams.get('code')
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      if (loggedIn === false) {
        try {
          const data = await fetch(`auth?code=${authCode}`, {credentials: 'same-origin'}).then(
          response => response.json())
	  checkLoginState()
          navigate('/')
        }
        catch (err) {
          console.log(err)
          navigate('/')
        }
      } else if (loggedIn === true) {
        navigate('/')
      }
    })();
  }, [checkLoginState, loggedIn, navigate])

  return(<></>)
}

// Routes for each url
const router = createBrowserRouter([
  {
    path: "",
    element: <Game backendData={titles} dailies={dailies}/>,
    errorElement: <h1>{"uwu sowwy we cuudent find youw page >ww<"}</h1>
  },
  {
    path: "previous-maps",
    element: <PreviousMaps dailies={dailies}/>,
  },
  {
    path: "callback",
    element: <Authenticate/>,
  },
  {
    path: "about",
    element: <About/>,
  },
  {
    path: "tutorial",
    element: <Tutorial/>
  },
  {
    path: "privacy",
    element: <Privacy/>
  }
]);


function App() {

  return(
    <RouterProvider router={router} />
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
          <Container fluid className='bg-dark shadow-lg' style={{overflow:'hidden', maxWidth:'1000px'}}>
            <AuthContextProvider>
              <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" className='bg-body-tertiary px-4 d-flex' style={{margin : '0px -20px'}}>
                <Navbar.Brand href="/">
                  <h1>osudle!</h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="/previous-maps" className='text-nowrap'><h2>Previous Maps</h2></Nav.Link>
                  </Nav>
		  <SignIn/>
                </Navbar.Collapse>
              </Navbar>
              <br></br>
              <App/>
            </AuthContextProvider>
          </Container>
          <nav className="navbar bg-body-tertiary mx-auto">
              <div className="container mx-auto" style={{justifyContent:'center'}}>
                <a className="navbar-text px-4" href="tutorial">Tutorial</a>
                <a className="navbar-text px-4" href="about">About</a>
                <a className="navbar-text px-4" href="privacy">Privacy Policy</a>
              </div>
          </nav>
      </React.StrictMode>
);
