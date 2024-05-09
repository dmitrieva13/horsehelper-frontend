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
    const [drawData, drawDataSet] = useState(0)

    let getBookings = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/get_bookings_by_horse", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
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

    let getUnavailableDays = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/get_unavailable_days", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
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
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                console.log("expired!")
                if (!isRefresh) {
                    console.log("refresh")
                    getUnavailableDays(true)
                }
                return
            }

            if (response.unavailableDays) {
                unavailableArrSet(response.unavailableDays)
            }
            console.log(response.unavailableDays)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }
            if (!drawData) {
                drawDataSet(1)
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
        let found = unavailableArr.find((el) => Date.parse(el.date) == Date.parse(date.toString()))
        console.log(found);
        if (found) {
            isAvailableSet(false)
        } else {
            isAvailableSet(true)
            getBookingsByDate(newDay)
        }
    }

    let paint = (date:any) => {
        let month = date.getMonth()
        console.log("month", month);

        let monthDates:String[] = []
        unavailableArr.forEach(d => {
            let d_date = new Date(d.date)
            if (d_date.getMonth() == month) {
                monthDates.push(d_date.getDate().toString())
            }
        })

        console.log(monthDates)
        setTimeout(() => {
            document.querySelectorAll("abbr").forEach(a => {
                if (monthDates.includes(a.innerHTML)) {
                    a.parentElement.style.backgroundColor = '#b5817f'
                } else {
                    a.parentElement.style.backgroundColor = ''
                }
            })
        }, 0)
    }

    let change = (e: any) => {
        console.log(e)
        if (e.view == "month") {
            let date = new Date(e.activeStartDate)
            paint(date)
        }
    }

    let makeUnavaileableBtnClicked = (isRefresh: boolean) => {
        console.log(day);
        fetch("https://horsehelper-backend.onrender.com/make_horse_unavailable", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    date: day,
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
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
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    makeUnavaileableBtnClicked(true)
                }
                return
            }

            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }
            isAvailableSet(false)
            getUnavailableDays(false)
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let makeAvaileableBtnClicked = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/make_horse_available", {
              method: "POST",
              body: JSON.stringify({
                    id: horseId,
                    date: day,
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
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
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    makeAvaileableBtnClicked(true)
                }
                return
            }

            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }
            isAvailableSet(true)
            getUnavailableDays(false)
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    useEffect(() => {
        if (!fetched) {
            todaySet(new Date())
            isAvailableSet(true)

            getUnavailableDays(false)
            getBookings(false)

            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }
        let date = day == null ? new Date() : day
        paint(date)
    })

    if (fetched && drawData) {
    return(
        <div className="CalendarScreen">
            <div className="backBtnCalendar">
                <CloseButton onClick={() => navigate("../horses")} />
            </div>
            <div className="title">Расписание лошади</div>
            
            {fetched &&
            <div className="calendarBlock">
                <Calendar className="calendar" onChange={e => dayChanged(e)} 
                onActiveStartDateChange={e => change(e)} value={day} 
                minDate={today} maxDate={new Date((new Date()).setMonth((new Date()).getMonth()+2))} 
                showNeighboringMonth={false} prev2Label={null} next2Label={null}/>
                {day != null && isAvailable &&
                <div className="raspDisplay">
                    <div className="textBlock">Лошадь доступна для занятий</div>
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
                    <button className='makeUnavaileableBtn'
                    onClick={() => makeUnavaileableBtnClicked(false)}>
                        Сделать недоступной в этот день
                    </button>
                </div>}
                {!isAvailable && 
                <div className="raspDisplay">
                    <div className="unavailableDisplay">
                    В этот день лошадь недоступна для занятий
                </div>
                    <Button variant='secondary' className='makeAvaileableBtn'
                    onClick={() => makeAvaileableBtnClicked(false)}>
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