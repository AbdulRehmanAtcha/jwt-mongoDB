import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import {
  Route, Routes
} from "react-router-dom";

function App() {
  return (
   <body>
   <Routes>
    <Route  path='/' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
   </Routes>
   </body>
  );
}

export default App;
