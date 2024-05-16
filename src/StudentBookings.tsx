import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Pagination } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/StudentBookings.css'
import Loading from './Loading';
import StudentBookingDisplay from './StudentBookingDisplay';
import Menu from './Menu';

function StudentBookings() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [fetchedArchive, fetchedArchiveSet] = useState(0)
    const [trainings, trainingsSet] = useState<any[]>([])
    const [trainingsArchive, trainingsArchiveSet] = useState<any[]>([])
    const [screen, screenSet] = useState<String>("current")
    const [show, showSet] = useState(5)
    const [trainingsCount, trainingsCountSet] = useState(0)
    const [archiveTrainingsCount, archiveTrainingsCountSet] = useState(0)
    const [isCancel, isCancelSet] = useState(false)

    let getCurrentTrainings = (isRefresh: boolean) => {
        fetch("http://localhost:3001/get_current_bookings_student", {
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
                    getCurrentTrainings(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            let bookings = response.bookings
            if (bookings) {
                bookings = bookings.sort((a: any, b: any) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                })
                trainingsSet(bookings)
                trainingsCountSet(bookings.length)
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

    let getArchiveTrainings = (isRefresh: boolean) => {
        fetch("http://localhost:3001/get_archived_bookings_student", {
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
            console.log("archive", response)
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    getArchiveTrainings(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            let bookings = response.bookings
            if (bookings) {
                bookings = bookings.sort((a: any, b: any) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                })
                trainingsArchiveSet(bookings)
                archiveTrainingsCountSet(bookings.length)
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

    let bookingsBtnClicked = (screenName: String) => {
        showSet(5)
        screenSet(screenName)
        if (screenName == "archive" && !fetchedArchive) {
            getArchiveTrainings(false)
            setTimeout(() => {
                fetchedArchiveSet(1)
            }, 300)
        } 
    }

    useEffect(() => {
        if (!fetched) {
            getCurrentTrainings(false)
            setTimeout(() => {
                fetchedSet(1)
            }, 200)
        }
        if (isCancel) {
            console.log("canceling");
            
            getCurrentTrainings(false)
            getArchiveTrainings(false)
            setTimeout(() => {
                isCancelSet(false)
            }, 200)
        }
    })

    if (fetched || isCancel) {
        return(
            <div className="studentBookingsScreen">
                <Menu isProfile={false} />
                <div className="titleBlock">Мои записи</div>

                <div className="bookingsBtnsBlock">
                    <button className={screen == "current" ? 'bookingsBtn btnActive' : 'bookingsBtn'} id='0' 
                    onClick={() => bookingsBtnClicked("current")}>
                        Предстоящие
                    </button>
                    <button className={screen == "archive" ? 'bookingsBtn btnActive' : 'bookingsBtn'} id='1' 
                    onClick={() => bookingsBtnClicked("archive")}>
                        Прошедшие
                    </button>
                </div>

                {(screen == "current" && trainings) &&
                <div className="currentTrainingsBlock">
                    {trainings.length > 0 &&
                    trainings.map((tr: any, i: number) => {
                        let key = "current." + i.toString()
                        return(
                        <StudentBookingDisplay training={tr} isCurrent={true}
                        canceledFunc={isCancelSet} key={key} />
                        )
                    })
                    }

                    {show < trainingsCount &&
                     <div style={{textAlign: "center"}}>
                        <Button className='showMoreBtn' variant='outline-secondary' 
                        size='sm' onClick={() => showSet(show+5)}>
                            Показать еще
                        </Button> 
                    </div>
                    }
                </div>
                }

                {screen == "archive" &&
                    <div className="archiveTrainingsBlock">

                    {fetchedArchive != 0 && 
                    <div className="archivedDisplay">
                        {trainingsArchive.length > 0 &&
                        trainingsArchive.map((tr: any, i: number) => {
                            let key = "archived." + i.toString()
                            return(
                            <StudentBookingDisplay training={tr} isCurrent={false}
                            canceledFunc={isCancelSet} key={key} />
                            )
                        })
                        }

                        {show < archiveTrainingsCount &&
                        <div style={{textAlign: "center"}}>
                            <Button className='showMoreBtn' variant='outline-secondary' 
                            size='sm' onClick={() => showSet(show+5)}>
                                Показать еще
                            </Button> 
                        </div>
                        }
                    </div>
                    }
                    {fetchedArchive == 0 &&
                    <Loading />
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

export default StudentBookings