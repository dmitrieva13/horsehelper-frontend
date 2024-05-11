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
    const [drawData, drawDataSet] = useState(0)
    const [day, daySet] = useState<Value>(null)
    const [today, todaySet] = useState<Date>(null)
    const [isWorking, isWorkingSet] = useState(true)
    const [workingDays, workingDaysSet] = useState<any[]>([])

    const [trainings, trainingsSet] = useState<any[]>([])
    const [trainingsToday, trainingsTodaySet] = useState<any[]>([])

    let getTrainings = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/get_current_bookings_trainer", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    getTrainings(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            console.log(response)
            if (response.bookings) {
                trainingsSet(response.bookings)
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

    let getWorkingDays = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/get_working_days", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }

            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    getWorkingDays(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            console.log(response)
            console.log(response.workingDays)
            workingDaysSet((response.workingDays))
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

    let makeDayOffBtnClicked = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/undo_working_day", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    makeDayOffBtnClicked(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }

            isWorkingSet(false)
            getWorkingDays(false)
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let makeWorkingDayBtnClicked = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/set_working_day", {
              method: "POST",
              body: JSON.stringify({
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
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    makeWorkingDayBtnClicked(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }

            isWorkingSet(true)
            getWorkingDays(false)
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let getTrainingsByDate = (date: any) => {
        let start = new Date(date)
        start.setHours(0,0,0,0)

        let end = new Date(date)
        end.setHours(23,59,99,99)

        let found = trainings.filter((el) => {
            return new Date(el.date) >= start && new Date(el.date) <= end
        })
        console.log(found)
        found = found.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        trainingsTodaySet(found)
    }

    let dayChanged = (newDay: any) => {
        console.log("new day",newDay)
        let date = new Date(newDay)
        date.setHours(date.getHours() + 12)
        daySet(date)
        let found = workingDays.find((el) => {
            console.log("date", el.date);
            return Date.parse(el.date) == Date.parse(date.toString())
        })
        console.log(found);
        if (found) {
            isWorkingSet(true)
            getTrainingsByDate(date)
        } else {
            isWorkingSet(false)
        }
    }

    let paint = (date:any) => {
        let month = date.getMonth()
        console.log("month", month);

        let monthDates:String[] = []
        workingDays.forEach(d => {
            let d_date = new Date(d.date)
            if (d_date.getMonth() == month) {
                monthDates.push(d_date.getDate().toString())
            }
        })

        console.log(monthDates)
        setTimeout(() => {
            document.querySelectorAll("abbr").forEach(a => {
                if (monthDates.includes(a.innerHTML)) {
                    a.parentElement.style.backgroundColor = '#b6c590'
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

    useEffect(() => {
        if (!fetched) {
            todaySet(new Date())
            getWorkingDays(false)
            getTrainings(false)
            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }

        let date = day == null ? new Date() : day

        paint(date)
    })

    

    if (fetched && drawData) {
    return(
        <div className="trainerCalendarScreen">
            <div className="backBtnCalendar">
                <CloseButton onClick={() => navigate("../user/" + userId)} />
            </div>
            <div className="title">Расписание</div>

            <div className="calendarBlock">
                <Calendar className="calendar" onChange={e => dayChanged(e)}
                onActiveStartDateChange={e => change(e)} value={day}
                minDate={today} maxDate={new Date((new Date()).setMonth((new Date()).getMonth()+2))} 
                showNeighboringMonth={false} prev2Label={null} next2Label={null}/>

                {day != null && isWorking &&
                <div className="raspDisplay">
                    <div className="textBlock">Я работаю в этот день</div>
                    <div className="trainingsBlock">
                        <div className="trainingsTextBlock">
                            Запланировано тренировок: {trainingsToday.length}
                        </div>
                        {trainingsToday.length > 0 &&
                        trainingsToday.map((tr: any, i: number) => {
                            return(
                                <TrainingInfo booking={tr} key={i} />
                            )
                        })
                        }
                    </div>
                    <button className='makeDayOffBtn'
                    onClick = {() => makeDayOffBtnClicked(false)}>
                        Не работаю в этот день
                    </button>
                </div>
                }

                {!isWorking && 
                <div className="raspDisplay">
                    <div className="unavailableDisplay">
                    Выходной
                </div>
                    <Button variant='secondary' className='makeAvaileableBtn'
                    onClick={() => makeWorkingDayBtnClicked(false)}>
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