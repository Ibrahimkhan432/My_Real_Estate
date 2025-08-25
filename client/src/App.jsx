import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignOut from './pages/SignOut'
import About from './pages/About'
import Header from './components/Header'
import SignIn from './pages/SignIn'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-out' element={<SignOut />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App