import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router'

import NavbarV from './Components/Navbar'

import Signup from './Screens/Authscreens/Signup'
import Login from './Screens/Authscreens/Login'
import Home from './Screens/Home/Home'

import NotificationDisplay from './Screens/Multiplayer/NotificationDisplay'
import SendInvitation from './Screens/Multiplayer/SendInvitation'

import Game from './Screens/Game/Game'

import './App.scss'

import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <BrowserRouter className = "App">
      <NavbarV/>
      <Routes>
        <Route path = "/" element = {<Home/>} ></Route>
        <Route path = "/signup" element = {<Signup/>}></Route>
        <Route path = "/login" element = {<Login/>}></Route>
        <Route path = "/notifications" element = {<NotificationDisplay/>}></Route>
        <Route path = "/sendinvite" element = {<SendInvitation/>}></Route>
        <Route path = "/game" element = {<Game/>}></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
