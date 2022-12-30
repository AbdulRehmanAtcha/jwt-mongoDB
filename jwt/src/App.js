import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from 'axios';
import {
  Route, Routes
} from "react-router-dom";
import { GlobalContext } from './context/Context';
import { useContext } from "react";
import { useEffect } from 'react';

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = `http://localhost:5001/api/v1`;
}
else {
  baseURL = `https://spring-bud-pike-coat.cyclic.app/api/v1`;
}

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    
    const getHome = async () => {
      try {
        let response = await axios.get(`${baseURL}/home`, {
          withCredentials: true
        })
        dispatch({
          type: "USER_LOGIN"
        })
        console.log("Yes Login");
      }
      catch (error) {
        console.log(error);
        console.log("no Login");
        dispatch({
          type: 'USER_LOGOUT'
        })
      }
    }
    getHome();

  }, [])

  const logoutHandler = async() => {
    
    try {
        let response = await axios.post(`${baseURL}/logout`, {
          withCredentials: true
        })
        dispatch({
          type: "USER_LOGOUT"
        })
        console.log("Yes Login");
      }
      catch (error) {
        console.log(error);
      }
  }
  return (
    <body>
      {
        (state.isLogin === true) ?
          <Routes>
            <Route path='/' element={<h2 style={{ color: "white" }}>
              Home.
              <br />
              <button onClick={logoutHandler} style={{ width: "160px", height: "60px", backgroundColor: "white", border: "none", marginTop: "10px" }}>Logout</button>
            </h2>
            } />
          </Routes>

          :
          null
      }
      {
        (state.isLogin === false) ?
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
          :
          null
      }

      {
        (state.isLogin === null) ?
          <Routes>
            <Route path='/' element={
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", minWidth: "100vw" }}>
                <div className="spinner-border" role="status">
                </div>
              </div>
            } />
          </Routes>
          :
          null
      }
    </body>
  );
}

export default App;
