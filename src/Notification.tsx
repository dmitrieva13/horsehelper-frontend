import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Moment from 'moment';

import './style/App.css'
import './style/Notification.css'

function Notification(props: {notification: any, role: String}) {
    
    const [fetched, fetchedSet] = useState(0)
    const [text, textSet] = useState("")
    const [color, colorSet] = useState("")

    const navigate = useNavigate()

    let dateBeautify = (date: any) => {
        Moment.locale('ru');
        let m = Moment(date).format('DD MMM YYYY')
        return m
    }

    let timeBeautify = (date: any) => {
        Moment.locale('ru');
        let m = Moment(date).format('HH:mm')
        return m
    }

    let notificationClicked = () => {
        if (props.role == "trainer") {
            navigate('../tcalendar/' + localStorage.getItem('id'))
        }
        if (props.role == "student") {
            navigate('../bookings/' + localStorage.getItem('id'))
        }
    }

    useEffect(() => {
        if (!fetched) {
            console.log(props.notification)
            if (props.role == "trainer") {
                if (props.notification.type == "new") {
                    textSet("Новая тренировка ")
                    colorSet("rgb(107, 142, 35)")
                } else {
                    textSet("Отменена тренировка ")
                    colorSet("#92000a")
                }
            }
            if (props.role == "student") {
                textSet("Запланирована тренировка типа " + props.notification.type.toString().toLowerCase())
                if (props.notification.type == "Общая") {
                    colorSet("rgb(244, 196, 48)")
                } else if (props.notification.type == "Конкур") {
                    colorSet("#9e9ee2")
                } else if (props.notification.type == "Выездка") {
                    colorSet("#6495ed")
                }
            }
            fetchedSet(1)
        }
    }, [])

    return(
        <div className="notification" onClick={notificationClicked}>
            <div className="notificationInfoBlock" style={{borderLeft: `5px solid ${color}`}}>
                {(props.role == 'trainer' && props.notification.booking) &&
                <div className="trainerNotification">
                    <div className="notificationText">
                        {text}
                        <strong>{" "+dateBeautify(props.notification.booking.date)}</strong>
                        в <strong>{" "+timeBeautify(props.notification.booking.date)}</strong>
                    </div>
                    <div className="notificationCreated">
                        {dateBeautify(props.notification.dateCreated)}
                    </div>
                </div>
                }
                {props.role == "student" &&
                <div className="studentNotification">
                <div className="notificationText">
                    {text}
                    <strong>{" "+dateBeautify(props.notification.date)} </strong>
                    в <strong>{" "+timeBeautify(props.notification.date)}</strong>
                </div>
            </div>}
            </div>
        </div>
    )
}

export default Notification