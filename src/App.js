import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import "./App.css";

import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import New from "./New";
import Event from "./Event";
import Edit from "./Edit";

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
      <Route path='/dashboard/events/:eventId/edit' element={<Edit />} />
      <Route path='/dashboard/events/:event' element={<Event />} />
      <Route path='/dashboard/events/new' element={<New />} />
      <Route path='/dashboard/events' element={<Dashboard />} />
      <Route path='/' element={<Redirect to='/login' />} />
    </Routes>
  );
}

export default App;
