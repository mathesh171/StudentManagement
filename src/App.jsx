import React,{ useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import SubmitStudent from "./pages/SubmitStudent";
import GetStudent from "./pages/GetStudent";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";
import Login from "./pages/Login";

const App = () => {
  const navigate = useNavigate();
  const handleClick = () =>{
      navigate('/home');
  }
  return (
    <Routes>
      <Route path={"/"} element={<Login/>}/>
      <Route path={"/home"} element={<Home/>}/>
      <Route path={"/submit"} element={<SubmitStudent/>}/>
      <Route path={"/get"} element={<GetStudent/>}/>
      <Route path={"/update"} element={<UpdateStudent/>}/>
      <Route path={"/delete"} element={<DeleteStudent/>}/>
      <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={handleClick}>Return to Home</button>
      </div>} />
    </Routes>
  );
}

export default App;

