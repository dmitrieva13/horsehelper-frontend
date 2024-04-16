import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Modal, Button, Form, Container, ListGroup } from 'react-bootstrap';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { ru } from 'date-fns/locale';

import './style/App.css'
import './style/Booking.css'
import Menu from './Menu';


function OnlineBooking() {
    const [fetched, fetchedSet] = useState(0)
    const [showTrainer, showTrainerSet] = useState(false)
    const [showHorse, showHorseSet] = useState(false)
    const [today, todaySet] = useState("")
    const [type, typeSet] = useState("")
    const [typeDisabled, typeDisabledSet] = useState(false)
    const [timeslots, timeslotsSet] = useState<any[]>([])
    const [trainersAvailable, trainersAvailableSet] = useState<any[]>([])
    const [horsesAvailable, horsesAvailableSet] = useState<any[]>([])
    const [time, timeSet] = useState<Date>(null)
    const [trainer, trainerSet] = useState("")
    const [horse, horseSet] = useState(null)
    const [comment, commentSet] = useState("")
    
    const navigate = useNavigate()
    const allTypes = ["Общая", "Выездка", "Конкур"]


    let dates = [
        {
            start: "29 May 2024 12:00 GMT+0300",
            trainer: "Dan",
            type: "Конкур"
        },
        {
            start: "29 May 2024 13:00 GMT+0300",
            trainer: "Dan",
            type: "Конкур"
        },
        {
            start: "31 May 2024 18:00 GMT+0300",
            trainer: "Dan",
            type: "Конкур"
        },
        {
            start: "29 May 2024 12:00 GMT+0300",
            trainer: "Anna",
            type: "Конкур"
        },
        {
            start: "29 May 2024 13:00 GMT+0300",
            trainer: "Andy",
            type: "Выездка"
        },
        {
            start: "01 Jun 2024 12:00 GMT+0300",
            trainer: "Dan",
            type: "Конкур"
        },
        {
            start: "30 May 2024 10:00 GMT+0300",
            trainer: "Jan",
            type: "Общая"
        }
    ]

    const all_horses = [
        {
            name: "Ромашка",
            description: "Спокойная и добрая лошадь"
        },
        {
            name: "Забава",
            description: "Отлично подходит для опытных всадников"
        },
        {
            name: "Ворон",
            description: "Статный вороной конь. Занимал призовые места на сорвенованиях"
        }
    ]

    const availableTimeslots = [1, 2, 3, 4, 5, 6, 7].map((id) => {
        return {
          id,
          startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
          endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(17, 0, 0, 0)),
        };
      });

    let makeVisisble = (className: string) => {
        let divClass = document.querySelector("." + className)
        if (divClass != null) {
          divClass.className = className
        }
      }
    
      let makeInvisisble = (className: string) => {
        let divClass = document.querySelector("." + className)
        if (divClass != null) {
          divClass.className += " hidden"
        }
      }

    let getAvailableTimeslot = (type: string) => {
        let arr: any[] = []
        let times: Date[] = []
        dates.map((date: any, i: number) => {
            if (date.type == type) {
                arr.push(date)
                times.push(new Date(Date.parse(date.start)))
            }
        })
        // Array(arr).forEach((val: any, i: any) => times.push(Date.parse(val.start)))
        // console.log(times)
        let uniqueTimes = Array.from(new Set(times))
        let slots = uniqueTimes.map((t: Date, i: any) => {
            let tEnd = new Date(t)
            
            return {
                startTime: t,
                endTime: new Date(tEnd.setHours(tEnd.getHours()+1)),
                id: i
            }
        })
        
        console.log(slots)
        return slots

    }

    let typeNextClicked = () => {
        typeDisabledSet(true)
        makeVisisble("timeTrainerSelection")
        makeInvisisble("nextBtnBlock")
    }

    let backClicked = () => {
        typeDisabledSet(false)
        makeInvisisble("timeTrainerSelection")
        let divClass = document.querySelector(".nextBtnBlock")
        if (divClass != null) {
          divClass.className = "centeredDiv nextBtnBlock"
        }
        timeSet(null)
        trainerSet("")
        horseSet(null)
        commentSet("")
    }

    let timeSelected = (start: any) => {
        let time = Date.parse(start.startTime)
        let trainers: any[] = []
        dates.map((date: any) => {
            if (Date.parse(date.start) == time && date.type == type) {
                trainers.push(date.trainer)
            }
        })
        console.log(trainers);
        trainersAvailableSet(trainers)
        horsesAvailableSet(all_horses)
        timeSet(start.startTime)
        trainerSet("")
        horseSet(null)
    }

    let signupBtnClicked = () => {
        let data = {
            student: "student",
            type: type,
            trainer: trainer,
            horse: horse.name,
            timeStart: time,
            commentary: comment
        }
        console.log(data)
    }

    useEffect(() => {
        if (!fetched) {
            todaySet(Date())
            timeSet(null)
            fetchedSet(1)
        }
    })

    return (
        <div className='booking'>
            <Menu />
            <div className="title">Запись на тренировку</div>

            <div className="typeSelection">
                <div>Выберите тип тренировки:</div>
                <select className='typeSelect' value={type}
                onChange={e => typeSet(e.target.value)} disabled={typeDisabled}>
                    <option hidden value="">Тип тренировки</option>
                    {allTypes.map((option: any, i: number) => {
                        return(
                        <option key={i} value={option}>
                            {option}
                        </option>
                    )})}
                </select>
                <div className='centeredDiv nextBtnBlock'>
                    <Button variant="dark" className='nextTypeBtn' disabled={type == ""}
                    onClick={typeNextClicked}>Далее</Button>
                </div>
            </div>

            <div className="timeTrainerSelection hidden">
                <div className='centeredDiv'>
                    <Button className='backBtn' variant="outline-dark"
                    onClick={backClicked}>Назад</Button>
                </div>

                <div className="trainersBlock">
                    <div className="timeSelection">
                        Время тренировки: 
                        <div className="info">
                            {time == null ? "" : 
                            " "+time.toLocaleDateString() + " " + time.toLocaleTimeString()}
                        </div>
                        <button className='changeTimeBtn'
                        onClick={e => makeVisisble("calendarBlock")}>
                            {time == null ? "Выбрать" : "Изменить"}
                        </button>
                    </div>
                    <div className="calendarBlock hidden">
                        <ScheduleMeeting
                            borderRadius={20}
                            primaryColor="#000000"
                            eventDurationInMinutes={60}
                            eventStartTimeSpreadInMinutes={0}
                            availableTimeslots={getAvailableTimeslot(type)}
                            onStartTimeSelect={e => {
                                timeSelected(e)
                                makeInvisisble("calendarBlock")
                            }}
                            locale={ru}
                            format_startTimeFormatString="HH:mm"
                            lang_goToNextAvailableDayText="Ближайшее время"
                            lang_emptyListText="Нет свободного времени"
                            lang_noFutureTimesText="Дальше доступного времени нет"
                            />
                    </div>
                    <div>Тренер:</div>
                    <div className="trainerSelectionBlock">
                        <div className="d-grid gap-2">
                            <Button variant="outline-dark" 
                            onClick={e => showTrainerSet(true)} 
                            disabled={time == null} size="lg">
                {trainer == "" && "Тренер еще не выбран"}
                {trainer != "" && 
                    <div className="trainerInfo">{trainer}</div>
                }
                            </Button>
                        </div>

                        <Modal show={showTrainer} onHide={() => showTrainerSet(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Свободные тренера</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup as="ol">
                                    {trainersAvailable.map((t: any, i: any) => {
                                        return(
                                            <ListGroup.Item as="li"
                            className="d-flex justify-content-between align-items-start"
                        action active={t == trainer} 
                        onClick={e => {
                            trainerSet(t)
                            showTrainerSet(false)
                        }}>
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{t}</div>
                            </div>
                        </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Modal.Body>
                        </Modal>
                        
                    </div>
                </div>

                <div className="horseBlock">
                <div>Лошадь:</div>
                    <div className="trainerSelectionBlock">
                        <div className="d-grid gap-2">
                            <Button variant="outline-dark" 
                            onClick={e => showHorseSet(true)} 
                            disabled={time == null} size="lg">
                {horse == null && "Лошадь еще не выбрана"}
                {horse != null && 
                    <div className="horseInfo">{horse.name}</div>
                }
                            </Button>
                        </div>

                        
                        <Modal show={showHorse} onHide={() => showHorseSet(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Свободные лошади</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup as="ol">
                                    {horsesAvailable.map((h: any, i: any) => {
                                        return(
                                            <ListGroup.Item as="li"
                            className="d-flex justify-content-between align-items-start"
                        action active={horse != null && h.name == horse.name} 
                        onClick={e => {
                            horseSet(h)
                            showHorseSet(false)
                        }}>
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{h.name}</div>
                            {h.description}
                            </div>
                        </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>

                <div className="commentBlock">
                    Комментарий:
                    <input className='commentInput' type='text' value={comment} style={{marginTop: "20px"}}
                    onChange={e => commentSet(e.target.value)} />
                </div>

                <div className="centeredDiv">
                    <Button variant="dark" className='SignupBtn' size="lg"
                    disabled={time == null || trainer == "" || horse==null}
                    onClick={signupBtnClicked}>Записаться</Button>
                </div>
            </div>
        </div>
    )
}

export default OnlineBooking