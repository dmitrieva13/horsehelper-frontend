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
import TrainerCalendar from './TrainerCalendar'
import NewsPage from './NewsPage'
import ProfileEdit from './ProfileEdit'
import Trainers from './Trainers'
import TodayTrainings from './TodayTrainings'
import StudentBookings from './StudentBookings'
import HomePage from './HomePage'

const App = () => {
  return(
    <Routes>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/news' element={<NewsPage/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/book' element={<OnlineBooking/>}/>
        <Route path='/addtrainer' element={<AddTrainer/>}/>
        <Route path='/addhorse' element={<AddHorse/>}/>
        <Route path='/horses' element={<Horses/>}/>
        <Route path='/horses/:horseId/calendar' element={<HorseCalendar/>}/>
        <Route path='/user/:userId' element={<Profile/>}/>
        <Route path='/user/:userId/edit' element={<ProfileEdit/>}/>
        <Route path='/trainers' element={<Trainers/>}/>
        <Route path='/tcalendar/:userId' element={<TrainerCalendar/>}/>
        <Route path='/todayschedule/:userId' element={<TodayTrainings/>}/>
        <Route path='/bookings/:userId' element={<StudentBookings/>}/>
    </Routes>
  )
}

export default App;