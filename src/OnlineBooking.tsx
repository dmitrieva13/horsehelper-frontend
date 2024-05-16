import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Modal, Button, Form, Container, ListGroup, Image } from 'react-bootstrap';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { ru } from 'date-fns/locale';

import './style/App.css'
import './style/Booking.css'
import Menu from './Menu';
import Loading from './Loading';
import Message from './Message';


function OnlineBooking() {
    const [fetched, fetchedSet] = useState(0)
    const [timeFetched, timeFetchedSet] = useState(0)
    const [showTrainer, showTrainerSet] = useState(false)
    const [showHorse, showHorseSet] = useState(false)
    const [today, todaySet] = useState("")
    const [type, typeSet] = useState("")
    const [typeDisabled, typeDisabledSet] = useState(false)
    const [timeslots, timeslotsSet] = useState<any[]>([])
    const [trainersAvailable, trainersAvailableSet] = useState<any[]>([])
    const [horsesAvailable, horsesAvailableSet] = useState<any[]>([])
    const [time, timeSet] = useState<Date>(null)
    const [trainer, trainerSet] = useState(null)
    const [horse, horseSet] = useState(null)
    const [comment, commentSet] = useState("")
    const [success, successSet] = useState(false)
    
    const navigate = useNavigate()
    const allTypes = ["Общая", "Выездка", "Конкур"]

    let createSlots = (date: Date, times: any[]) => {
        let slots: any[] = []
        times.forEach((t: any) => {
            console.log(t);
            
            if (t.isAvailable) {
                let newDate = new Date(date)
                newDate.setHours(t.time)
                let endDate = new Date((new Date(newDate)).setMinutes(newDate.getMinutes() + 60))
                let slot = {
                    start: newDate,
                    end: endDate,
                    trainers: t.trainersAtSlot,
                    horses: t.horsesAtSlot
                }
                slots.push(slot)
            }
        })
        return slots
    }

    let getSlots = (isRefresh: boolean) => {
    fetch("http://localhost:3001/get_slots_for_booking", {
            method: "POST",
            body: JSON.stringify({
                type: type,
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
            console.log(response)
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    getSlots(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            let data = response.message
            let slotsAll: any[] = []
            data.forEach((el: any) => {
                let slots = createSlots(new Date(el.date), el.timeslots)
                slotsAll = [...slotsAll, ...slots]
            })
            console.log(slotsAll)
            timeslotsSet(slotsAll)

            timeFetchedSet(1)
            makeVisisble("timeTrainerSelection")
            makeInvisisble("nextBtnBlock")
            
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

    let getAvailableTimeslot = () => {
        let arr: any[] = []
        // let times: Date[] = []
        timeslots.map((slot: any, i: number) => {
            arr.push({
                startTime: slot.start,
                endTime: slot.end,
                id: i
            })
        })

        arr = arr.filter((el: any) => {
            let start = new Date()
            start.setHours(start.getHours() + 2)
            console.log(el.startTime, start)
            return new Date(el.startTime) > new Date(start)
        })
        
        // console.log(arr)
        return arr
    }

    let getAvailableTrainersAndHorses = (start: Date) => {
        let slot = timeslots.find((ts) => {
            return ts.start.getTime() == start.getTime()
        })
        console.log("slot", slot)
        if (slot) {
            trainersAvailableSet(slot.trainers)
            horsesAvailableSet(slot.horses)
        }
    }

    let typeNextClicked = () => {
        typeDisabledSet(true)
        if (!timeFetched) {
            getSlots(false)
        }
    }

    let backClicked = () => {
        typeDisabledSet(false)
        makeInvisisble("timeTrainerSelection")
        let divClass = document.querySelector(".nextBtnBlock")
        if (divClass != null) {
          divClass.className = "centeredDiv nextBtnBlock"
        }
        timeSet(null)
        trainerSet(null)
        horseSet(null)
        commentSet("")
        timeFetchedSet(0)
    }

    let timeSelected = (time: any) => {
        let start = time.startTime
        getAvailableTrainersAndHorses(start)
        timeSet(start)
        trainerSet(null)
        horseSet(null)
        makeInvisisble("calendarBlockBooking")
    }

    let signupBtnClicked = (isRefresh: boolean) => {
        fetch("http://localhost:3001/new_booking", {
            method: "POST",
            body: JSON.stringify({
                trainerId: trainer.id,
                horseId: horse.id,
                date: time,
                type: type,
                comment: comment,
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
                    signupBtnClicked(true)
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
            
            successSet(true)
            setTimeout(() => {
                successSet(false)
                navigate("../")
            }, 1000)
        })
        .catch(er=>{
            console.log(er.message)
        })
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
            {success &&
            <Message message='Вы успешно записались на тренировку!' />
            }
            <Menu isProfile={false} />
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
                        onClick={e => makeVisisble("calendarBlockBooking")}>
                            {time == null ? "Выбрать" : "Изменить"}
                        </button>
                    </div>
                    <div className="calendarBlockBooking hidden">
                        <ScheduleMeeting
                            borderRadius={20}
                            primaryColor="rgb(107, 142, 35)"
                            eventDurationInMinutes={60}
                            eventStartTimeSpreadInMinutes={0}
                            availableTimeslots={getAvailableTimeslot()}
                            onStartTimeSelect={e => {
                                timeSelected(e)
                                makeInvisisble("calendarBlockBooking")
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
                                {trainer == null && "Тренер еще не выбран"}
                                {trainer != null && 
                                    <div className="trainerInfo">{trainer.name}</div>
                                }
                            </Button>
                        </div>

                        <Modal show={showTrainer} onHide={() => showTrainerSet(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Свободные тренера</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup as="ol" variant="flush">
                                    {trainersAvailable.map((t: any, i: any) => {
                                        return(
                                            <ListGroup.Item as="li"
                                            className="d-flex justify-content-between align-items-start"
                                            action active={trainer != null && t.id == trainer.id} 
                                            onClick={e => {
                                                trainerSet(t)
                                                showTrainerSet(false)
                                            }}
                                            style={{cursor: "pointer"}}>
                                                <div className="ms-2 me-auto">
                                                    <div className="trainerListBlock">
                                                        {t.photo && t.photo != "" &&
                                                        <Image className='bookingListImg' src={t.photo} fluid roundedCircle />
                                                        }
                                                        {(!t.photo || t.photo == "") && t.name &&
                                                        <div className="emptyImage">{t.name.slice(0,1)}</div>
                                                        }
                                                        <div className="trainerListText">
                                                            <div className="fw-bold">{t.name}</div>
                                                            {t.description}
                                                        </div>
                                                    </div>
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
                                <ListGroup as="ol" variant="flush">
                                    {horsesAvailable.map((h: any, i: any) => {
                                        return(
                                            <ListGroup.Item as="li"
                                            className="d-flex justify-content-between align-items-start"
                                            action active={horse != null && h.id == horse.id} 
                                            onClick={e => {
                                                horseSet(h)
                                                showHorseSet(false)
                                            }}
                                            style={{cursor: "pointer"}}>
                                                <div className="ms-2 me-auto">
                                                    <div className="horseListBlock">
                                                        {h.photo && h.photo != "" &&
                                                        <Image className='bookingListImg' src={h.photo} fluid roundedCircle />
                                                        }
                                                        {(!h.photo || h.photo == "") && h.name &&
                                                        <div className="emptyImage">{h.name.slice(0,1)}</div>
                                                        }
                                                        <div className="horseListText">
                                                            <div className="fw-bold">{h.name}</div>
                                                            {h.description}
                                                        </div>
                                                    </div>
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
                    disabled={time == null || trainer == null || horse==null}
                    onClick={() => signupBtnClicked(false)}>
                        Записаться
                    </Button>
                </div>
            </div>

            {(!timeFetched && typeDisabled) && 
            <Loading />}

        </div>
    )
}

export default OnlineBooking