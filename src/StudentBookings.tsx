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
    const [trainingsCount, trainingsCountSet] = useState(10)
    const [archiveTrainingsCount, archiveTrainingsCountSet] = useState(12)

    let getTrainings = () => {}

    let bookingsBtnClicked = (screenName: String) => {
        showSet(5)
        screenSet(screenName)
    }

    useEffect(() => {
        if (!fetched) {
            setTimeout(() => {
                fetchedSet(1)
            }, 0)
        }
    })

    if (fetched) {
        return(
            <div className="studentBookingsScreen">
                <Menu isProfile={false} />
                <div className="titleBlock">Мои записи</div>

                <div className="bookingsBtnsBlock">
                    <button className={screen == "current" ? 'bookingsBtn btnActive' : 'bookingsBtn'} id='0' onClick={() => bookingsBtnClicked("current")}>Предстоящие</button>
                    <button className={screen == "archive" ? 'bookingsBtn btnActive' : 'bookingsBtn'} id='1' onClick={() => bookingsBtnClicked("archive")}>Прошедшие</button>
                </div>

                {screen == "current" &&
                <div className="currentTrainingsBlock">
                    <StudentBookingDisplay training={null} isCurrent={true} />

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
                    <StudentBookingDisplay training={null} isCurrent={false} />

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
                
            </div>
        )
    } else {
        return(
            <Loading />
        )
    }
}

export default StudentBookings