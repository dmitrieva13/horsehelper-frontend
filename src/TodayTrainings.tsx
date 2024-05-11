import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/TodayTrainings.css'
import Loading from './Loading';
import TrainingInfo from './TrainingInfo';

function TodayTrainings() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [isWorking, isWorkingSet] = useState(true)
    const [trainingsList, trainingsListSet] = useState<any[]>([])
    const [workingDays, workingDaysSet] = useState<any[]>([])

    let getTrainingsToday = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/today_bookings", {
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
                    getTrainingsToday(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            console.log(response)
            let bookings = response.bookings
            let now = new Date()
            let all_filtered = bookings.filter((training: any) => {
                let check_date = new Date(new Date(training.date)).setMinutes(new Date(training.date).getMinutes() + 15)
                
                return new Date(check_date) > new Date(now)
            })
            all_filtered = all_filtered.sort((a: any, b: any) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            })
            trainingsListSet(all_filtered)

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

    let checkDayOff = () => {
        let now = new Date()
        let found = workingDays.find((el) => Date.parse(el.date) == Date.parse(now.toDateString()))
        console.log(workingDays);
        if (found) {
            isWorkingSet(true)
        } else {
            isWorkingSet(false)
        }
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
            if (response.workingDays) {
                workingDaysSet(response.workingDays)
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

    let backClicked = () => {
        navigate('../user/' + userId)
    }

    useEffect(() => {
        if (!fetched) {
            getWorkingDays(false)
            getTrainingsToday(false)
            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }
        checkDayOff()
    }, [])

    if (fetched) {
    return(
        <div className="todayTrainingsScreen">
            <div className="backButtonBlock">
                <ArrowLeft onClick={backClicked} size={28} style={{cursor: 'pointer'}}/>
            </div>
            <div className="titleBlock">Запланированные на сегодня тренировки</div>

            <div className="trainingsListBlock">
                {!isWorking &&
                <div className="dayOffBlock">Сегодня выходной</div>
                }
                {isWorking &&
                <div className="displayList">
                    {trainingsList.map((tr: any, i: number) => {
                        return(
                            <TrainingInfo booking={tr} key={i} />
                        )
                    })
                    }
                </div>
                }
            </div>
        </div>
    )}
    else {
        return(
            <Loading />
        )
    }
}

export default TodayTrainings