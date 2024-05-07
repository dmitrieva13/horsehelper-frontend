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
    // const [now, nowSet] = useState<Date>(null)
    const [isWorking, isWorkingSet] = useState(true)
    const [trainingsList, trainingsListSet] = useState<any[]>([])
    const [workingDays, workingDaysSet] = useState<any[]>([])

    let getTrainingsToday = () => {
        let list: any[] = [{
            date: "17 Apr 2024 20:50:00 GMT+0300"
        },
    {
        date: "17 Apr 2024 19:50:00 GMT+0300"
    }]
        return list
    }

    let getFilterTrainings = () => {
        let all = getTrainingsToday()
        let now = new Date()
        let all_filtered = all.filter((training: any) => {
            let check_date = new Date(new Date(training.date)).setMinutes(new Date(training.date).getMinutes() + 15)
            
            return new Date(check_date).getTime() > new Date(now).getTime()
        })
        console.log(all_filtered);
        
        return all_filtered
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
                navigate('../signin')
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
        })
    }

    let backClicked = () => {
        navigate('../user/' + userId)
    }

    useEffect(() => {
        if (!fetched) {
            // nowSet(new Date())
            getWorkingDays()
            trainingsListSet(getFilterTrainings())
            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }
        checkDayOff()
    })

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
                    <TrainingInfo booking={null} />
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