import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import "./App.css";

import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import New from "./New";
import Event from "./Event";
import Edit from "./Edit";
import Admin from "./Admin";

function Redirect({to}) {
  const forward = useNavigate();
  useEffect(()=>{
    forward(to);
  },[to, forward])
}

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/events/:eventId/edit' element={<Edit />} />
      <Route path='/events/:event' element={<Event />} />
      <Route path='/events/new' element={<New />} />
      <Route path='/events' element={<Dashboard />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='/' element={<Redirect to='/login' />} />
    </Routes>
  );
}

export default App;
