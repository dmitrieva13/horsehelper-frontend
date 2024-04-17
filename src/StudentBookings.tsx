import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/StudentBookings.css'
import Loading from './Loading';

function StudentBookings() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [trainings, trainingsSet] = useState<any[]>([])

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
                <div className="titleBlock">Мои записи</div>

                <div className="bookingsBlock">
                    <div className="bookingInfo">
                        <div className="bookingDate">{new Date().toLocaleString()}</div>
                        <div className="bookingType">Тип тренировки: </div>
                        <div className="bookingTrainer">Тренер: </div>
                        <div className="bookingHorse">Лошадь:</div>
                        <div className="bookingComments">Комментарий</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <Loading />
        )
    }
}

export default StudentBookings