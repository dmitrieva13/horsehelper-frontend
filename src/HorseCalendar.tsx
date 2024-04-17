import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Button, CloseButton } from 'react-bootstrap';

import './style/App.css'
import './style/Calendar.css'
// import 'react-calendar/dist/Calendar.css';
import TrainingInfo from './TrainingInfo';

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

    let getBookings = () => {
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

    let dayChanged = (newDay: any) => {
        console.log(newDay);
        daySet(newDay)
        let found = unavailableArr.find((el) => Date.parse(el.date) == Date.parse(newDay))
        console.log(found);
        if (found) {
            isAvailableSet(false)
        } else {
            isAvailableSet(true)
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
            fetchedSet(1)
        }
    })

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
                    <div className="trainingsBlock">
                        <TrainingInfo date={new Date()} student={"Student"} studentPhone={"+79999999999"}
trainer={"string"} trainerPhone={"string"} horse={"string"} type={"any"} comment={"string"} />
                    </div>
                    <Button variant='danger' className='makeUnavaileableBtn'
                    onClick={makeUnavaileableBtnClicked}>
                        Сделать недоступной в этот день
                    </Button>
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
}

export default HorseCalendar