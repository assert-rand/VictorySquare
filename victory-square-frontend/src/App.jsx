import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router'

import NavbarV from './Components/Navbar'

import Signup from './Screens/Authscreens/Signup'
import Login from './Screens/Authscreens/Login'
import Home from './Screens/Home/Home'

import Notifications from './Screens/Multiplayer/Notifications'
import SendInvitation from './Screens/Multiplayer/SendInvitation'

import Game from './Screens/Game/Game'

import './App.scss'

function App() {

  return (
    <BrowserRouter className = "App">
      <NavbarV/>
      <Routes>
        <Route path = "/" element = {<Home/>} ></Route>
        <Route path = "/signup" element = {<Signup/>}></Route>
        <Route path = "/login" element = {<Login/>}></Route>
        <Route path = "/notifications" element = {<Notifications/>}></Route>
        <Route path = "/sendinvite" element = {<SendInvitation/>}></Route>
        <Route path = "/game" element = {<Game/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
