import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Button, CloseButton } from 'react-bootstrap';

import './style/App.css'
import './style/Calendar.css'
// import 'react-calendar/dist/Calendar.css';
import TrainingInfo from './TrainingInfo';
import Loading from './Loading';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function HorseCalendar() {
    const { horseId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [name, nameSet] = useState("")
    const [day, daySet] = useState<Value>(null)
    const [today, todaySet] = useState<Date>(null)
    const [isAvailable, isAvailableSet] = useState(true)
    const [unavailableArr, unavailableArrSet] = useState<any[]>([])
    const [bookings, bookingsSet] = useState<any[]>([])
    const [bookingsToday, bookingsTodaySet] = useState<any[]>([])

    let getBookings = () => {
        fetch("https://horsehelper-backend.onrender.com/get_bookings_by_horse", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    accessToken: localStorage.getItem('token')
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
            if (response.errorMessage) {
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
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let getUnavailableDays = () => {
        fetch("https://horsehelper-backend.onrender.com/get_unavailable_days", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage) {
                localStorage.clear()
                navigate('../signin')
            }

            unavailableArrSet(response.unavailableDays)
            console.log(response.unavailableDays)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
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
        daySet(newDay)
        let found = unavailableArr.find((el) => Date.parse(el.date) == Date.parse(newDay))
        console.log(found);
        if (found) {
            isAvailableSet(false)
        } else {
            isAvailableSet(true)
            getBookingsByDate(newDay)
        }
    }

    let makeUnavaileableBtnClicked = () => {
        console.log(day);
        fetch("https://horsehelper-backend.onrender.com/make_horse_unavailable", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    date: day,
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            isAvailableSet(false)
            getUnavailableDays()
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let makeAvaileableBtnClicked = () => {
        fetch("https://horsehelper-backend.onrender.com/make_horse_available", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    date: day,
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            isAvailableSet(true)
            getUnavailableDays()
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    useEffect(() => {
        if (!fetched) {
            todaySet(new Date())
            isAvailableSet(true)

            getUnavailableDays()
            getBookings()

            setTimeout(() => {
                fetchedSet(1)
            }, 300)
        }
    }, [])

    if (fetched) {
    return(
        <div className="CalendarScreen">
            <div className="backBtnCalendar">
                <CloseButton onClick={() => navigate("../horses")} />
            </div>
            <div className="title">Расписание лошади</div>
            
            {fetched &&
            <div className="calendarBlock">
                <Calendar className="calendar" onChange={e => dayChanged(e)} value={day} minDate={today}/>
                {day != null && isAvailable &&
                <div className="raspDisplay">
                    <div className="textBlock">Лошадь доступна для занятий</div>
                    <div className="trainingsBlock">
                    {/* <div className="trainingsTextBlock">
                        Тренировок в этот день: {bookingsToday.length}
                    </div> */}
                        {bookingsToday.map((booking: any, i: number) => {
                            return(
                                <TrainingInfo booking={booking} key={i} />
                            )
                        })
                        }
                    </div>
                    <button className='makeUnavaileableBtn'
                    onClick={makeUnavaileableBtnClicked}>
                        Сделать недоступной в этот день
                    </button>
                </div>}
                {!isAvailable && 
                <div className="raspDisplay">
                    <div className="unavailableDisplay">
                    В этот день лошадь недоступна для занятий
                </div>
                    <Button variant='secondary' className='makeAvaileableBtn'
                    onClick={makeAvaileableBtnClicked}>
                        Сделать доступной в этот день
                    </Button>
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

export default HorseCalendar