import React from 'react'
import {Routes, Route} from 'react-router-dom'

import './style/App.css'

import SignUp from './SignUp'
import SignIn from './SignIn'
import OnlineBooking from './OnlineBooking'
import AddTrainer from './AddTrainer'
import AddHorse from './AddHorse'
import Horses from './Horses'
import HorseCalendar from './HorseCalendar'
import Profile from './Profile'

const App = () => {
  return(
    <Routes>
        <Route path='/' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/book' element={<OnlineBooking/>}/>
        <Route path='/addtrainer' element={<AddTrainer/>}/>
        <Route path='/addhorse' element={<AddHorse/>}/>
        <Route path='/horses' element={<Horses/>}/>
        <Route path='/horses/:horseId/calendar' element={<HorseCalendar/>}/>
        <Route path='/user/:userId' element={<Profile/ >}/>
    </Routes>
  )
}

export default App;