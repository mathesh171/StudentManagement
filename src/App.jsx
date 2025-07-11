import React,{ useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import SubmitStudent from "./pages/SubmitStudent";
import GetStudent from "./pages/GetStudent";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";
import Score from "./pages/Score";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";


const isAuthenticated = () =>{
  return localStorage.getItem("isLoggedIn") === "true";
}



const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, []);

  return isAuthenticated() ? children : null;
};

const App = () => {
  const navigate = useNavigate();
  const handleClick = () =>{
      navigate('/home');
  }

  
  return (
    <Routes>
      <Route path={"/"} element={<Login/>}/>
      <Route path={"/home"} element={<PrivateRoute> <Home/> </PrivateRoute>}/>
      <Route path={"/submit"} element={<PrivateRoute> <SubmitStudent/> </PrivateRoute>}/>
      <Route path={"/get"} element={<PrivateRoute> <GetStudent/> </PrivateRoute>}/>
      <Route path={"/update"} element={<PrivateRoute> <UpdateStudent/> </PrivateRoute>}/>
      <Route path={"/delete"} element={<PrivateRoute> <DeleteStudent/> </PrivateRoute>}/>
      <Route path={"/score"} element={<PrivateRoute> <Score/> </PrivateRoute>}/>
      <Route path={"/attendance"} element={<PrivateRoute> <Attendance/> </PrivateRoute>}/>
      <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={handleClick}>Return to Home</button>
      </div>} />
    </Routes>
  );
}

export default App;

