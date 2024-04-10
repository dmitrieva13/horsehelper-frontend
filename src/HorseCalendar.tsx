import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { Button } from 'react-bootstrap';

import './style/App.css'
import './style/HorseCalendar.css'
// import 'react-calendar/dist/Calendar.css';
import TrainingInfo from './TrainingInfo';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function HorseCalendar() {
    const { horseId } = useParams();

    const [fetched, fetchedSet] = useState(0)
    const [name, nameSet] = useState("")
    const [day, daySet] = useState<Value>(null);

    let getBookings = () => {
    }

    return(
        <div className="CalendarScreen">
            <div className="title">Расписание лошади</div>
            <div className="calendarBlock">
                <Calendar className="calendar" onChange={daySet} value={day} />
                {day != null &&
                <div className="raspDisplay">
                    <div className="trainingsBlock">
                        <TrainingInfo date={new Date()} student={"Student"} studentPhone={"+79999999999"}
trainer={"string"} trainerPhone={"string"} horse={"string"} type={"any"} comment={"string"} />
                    </div>
                    <Button variant='danger' className='makeUnavaileableBtn'>
                        Сделать недоступной в этот день
                    </Button>
                </div>}
            </div>
        </div>
    )
}

export default HorseCalendar