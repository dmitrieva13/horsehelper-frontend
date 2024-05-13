import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';

import './style/App.css'
import './style/Calendar.css'
// import 'react-calendar/dist/Calendar.css';
import TrainingInfo from './TrainingInfo';
import Loading from './Loading';
import Menu from './Menu';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function AllTrainingsCalendar() {
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [day, daySet] = useState<Value>(null)
    const [today, todaySet] = useState<Date>(null)
    const [bookings, bookingsSet] = useState<any[]>([])
    const [bookingsToday, bookingsTodaySet] = useState<any[]>([])

    let getBookings = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/get_all_bookings", {
              method: "POST",
              body: JSON.stringify({
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.error) {
              localStorage.clear()
              navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    getBookings(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            let bookings = response.bookings
            if (bookings) {
                bookingsSet(bookings)
            }
            if (response.accessToken) {
              localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let getBookingsByDate = (date: any) => {
        let start = new Date(date)
        start.setHours(0,0,0,0)

        let end = new Date(date)
        end.setHours(23,59,99,99)

        let found = bookings.filter((el) => {
            return new Date(el.date) >= start && new Date(el.date) <= end
        })
        console.log(found)
        found = found.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        bookingsTodaySet(found)
    }

    let dayChanged = (newDay: any) => {
        console.log(newDay);
        let date = new Date(newDay)
        date.setHours(date.getHours() + 12)
        daySet(date)
        getBookingsByDate(date)
    }

    useEffect(() => {
        if (!fetched) {
            todaySet(new Date())
            getBookings(false)

            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }
    }, [])

    if (fetched) {
    return(
        <div className="CalendarScreen">
            <Menu isProfile={false} />
            <div className="title">Расписание предстоящих занятий</div>
            
            {fetched &&
            <div className="calendarBlock">
                <Calendar className="calendar" onChange={e => dayChanged(e)} value={day} 
                minDate={today} maxDate={new Date((new Date()).setMonth((new Date()).getMonth()+2))} 
                showNeighboringMonth={false} prev2Label={null} next2Label={null}/>
                {day != null &&
                <div className="raspDisplay">
                    <div className="trainingsBlock">
                    <div className="trainingsTextBlock">
                        Тренировок в этот день: {bookingsToday.length}
                    </div>
                        {bookingsToday.map((booking: any, i: number) => {
                            return(
                                <TrainingInfo booking={booking} key={i} />
                            )
                        })
                        }
                    </div>
                </div>
                }
            </div>
}
        </div>
    )
    } else {
    return(
        <Loading />
    )
}
}

export default AllTrainingsCalendar