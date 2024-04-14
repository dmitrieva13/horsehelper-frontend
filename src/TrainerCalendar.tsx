import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Button, CloseButton } from 'react-bootstrap';

import './style/App.css'
import './style/Calendar.css'
import Loading from './Loading';
import TrainingInfo from './TrainingInfo';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function TrainerCalendar() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [day, daySet] = useState<Value>(null)
    const [today, todaySet] = useState<Date>(null)
    const [isWorking, isWorkingSet] = useState(true)
    const [workingDays, workingDaysSet] = useState<any[]>([])

    const [trainings, trainingsSet] = useState<any[]>([])

    let getWorkingDays = () => {
        fetch("https://horsehelper-backend.onrender.com/get_working_days", {
              method: "POST",
              body: JSON.stringify({
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            if (response.error) {
                localStorage.clear()
            navigate('./signin')
            }

            console.log(response)
            console.log(response.workingDays)
            workingDaysSet((response.workingDays))
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
            // localStorage.clear()
            // navigate('./signin')
        })
    }

    let makeDayOffBtnClicked = () => {
        fetch("https://horsehelper-backend.onrender.com/undo_working_day", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            isWorkingSet(false)
            getWorkingDays()
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let makeWorkingDayBtnClicked = () => {
        fetch("https://horsehelper-backend.onrender.com/set_working_day", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            isWorkingSet(true)
            getWorkingDays()
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let dayChanged = (newDay: any) => {
        console.log(newDay)
        daySet(newDay)
        let found = workingDays.find((el) => Date.parse(el.date) == Date.parse(newDay))
        console.log(found);
        if (found) {
            isWorkingSet(true)
        } else {
            isWorkingSet(false)
        }
    }

    let paint = (date:any) => {
        let month = date.getMonth()

        let monthDates:String[] = []
        workingDays.forEach(d => {
            let d_date = new Date(d.date)
            if (d_date.getMonth() == month) {
                monthDates.push(d_date.getDate().toString())
            }
        })

        // console.log(monthDates)
        setTimeout(() => {
            document.querySelectorAll("abbr").forEach(a => {
                if (monthDates.includes(a.innerHTML)) {
                    a.parentElement.style.backgroundColor = 'LightPink'
                } else {
                    a.parentElement.style.backgroundColor = ''
                }
            })
        }, 0)
    }

    let change = (e: any) => {
        // console.log(e)
        if (e.view == "month") {
            let date = new Date(e.activeStartDate)
            paint(date)
        }
    }

    let dates = [
        new Date("2024-04-23T21:00:00.000+00:00"),
        new Date("2024-04-27T21:00:00.000+00:00"),
        new Date("2024-04-28T21:00:00.000+00:00"),
        new Date("2024-05-01T21:00:00.000+00:00"),
        new Date("2024-05-27T21:00:00.000+00:00"),
        new Date("2024-05-29T21:00:00.000+00:00")
    ]

    useEffect(() => {
        if (!fetched) {
            todaySet(new Date())
            getWorkingDays()
            fetchedSet(1)
        }

        paint(new Date())
    })

    

    if (fetched) {
    return(
        <div className="trainerCalendarScreen">
            <div className="backBtnCalendar">
                <CloseButton onClick={() => navigate("../horses")} />
            </div>
            <div className="title">Расписание</div>

            <div className="calendarBlock">
                <Calendar className="calendar" onChange={e => dayChanged(e)}
                onActiveStartDateChange={e => change(e)} value={day}
                minDate={today} maxDate={new Date((new Date()).setMonth((new Date()).getMonth()+2))} 
                showNeighboringMonth={false}/>

                {day != null && isWorking &&
                <div className="raspDisplay">
                    <div className="textBlock">Я работаю в этот день</div>
                    <div className="trainingsBlock">
                        <div className="trainingsTextBlock">
                            Количество запланированных тренировок: {trainings.length}
                        </div>
                        <TrainingInfo date={new Date()} student={"Student"} studentPhone={"+79999999999"}
trainer={"string"} trainerPhone={"string"} horse={"string"} type={"any"} comment={"string"} />
                    </div>
                    <Button variant='danger' className='makeDayOffBtn'
                    onClick = {makeDayOffBtnClicked}>
                        Не работаю в этот день
                    </Button>
                </div>
                }

                {!isWorking && 
                <div className="raspDisplay">
                    <div className="unavailableDisplay">
                    Выходной
                </div>
                    <Button variant='secondary' className='makeAvaileableBtn'
                    onClick={makeWorkingDayBtnClicked}>
                        Сделать этот день рабочим
                    </Button>
                </div>
                }
            </div>
        </div>
    )
    }
    else {
        return(
            <Loading />
        )
    }
}

export default TrainerCalendar