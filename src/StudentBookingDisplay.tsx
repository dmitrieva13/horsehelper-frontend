import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Image, Modal, Button } from 'react-bootstrap';
import Moment from 'moment';

import './style/App.css'
import './style/StudentBookings.css'

function StudentBookingDisplay(props: {training: any, isCurrent: boolean,
    canceledFunc: any}) {
    const [showTrainer, showTrainerSet] = useState(false)
    const [showHorse, showHorseSet] = useState(false)
    const [horseSpec, horseSpecSet] = useState("")
    const [fetched, fetchedSet] = useState(0)
    const [isCancelled, isCancelledSet] = useState(false)

    const navigate = useNavigate()

    let dateBeautify = (date: Date) => {
        Moment.locale('ru');
        let m = Moment(date).format('DD MMM YYYY HH:mm')
        return m
    }

    let trainerClicked = () => {
        if (props.isCurrent) {
            showTrainerSet(true)
        }
    }

    let horseClicked = () => {
        if (props.isCurrent) {
            showHorseSet(true)
        }
    }

    let cancelBooking = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/cancel_booking", {
              method: "POST",
              body: JSON.stringify({
                    trainerId: props.training.trainerId,
                    horseId: props.training.horseId,
                    date: props.training.date,
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }).then(res=>res.json())
          .then(response=>{
            console.log("cancel ", response)
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    cancelBooking(true)
                }
                return
            }
            if (response.errorMessage && response.errorMessage != "Token is expired") {
                localStorage.clear()
                navigate('../signin')
            }

            props.canceledFunc(true)

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

    useEffect(() => {
        if (!fetched) {
            if (!props.isCurrent && props.training.isCancelled) {
                isCancelledSet(true)
            }
            if (props.isCurrent && props.training.horseTypes) {
                let spec = ""
                props.training.horseTypes.map((t: any, indx: any) => {
                    if (indx > 0) {
                        spec += ", "
                    }
                    spec += t
                })
                horseSpecSet(spec)
            }
        }
    })

    return(
        <div className="StudentBookingDisplay">

            <div className="bookingsBlock">
                {!props.isCurrent &&
                <div className="bookingBadgeBlock">
                    {isCancelled &&
                    <div className="canceledBadge">Отменена</div>
                    }
                    {!isCancelled &&
                    <div className="archivedBadge">Завершена</div>
                    }
                </div>
                }
                <div className="bookingInfo">
                    <div className="bookingDate">{dateBeautify(new Date(props.training.date))}</div>
                    <div className="trainerHorseDisplayBlock">
                        <div className="trainerDisplayBlock" onClick={trainerClicked}
                        style={{cursor: props.isCurrent ? "pointer" : "default"}}>
                            {props.training.trainerPhoto && props.training.trainerPhoto != "" &&
                            <Image className='bookingImg' src={props.training.trainerPhoto} fluid roundedCircle />
                            }
                            {(!props.training.trainerPhoto || props.training.trainerPhoto == "") && props.training.trainerName &&
                            <div className="emptyImage" style={{width: "200px", height: "200px"}}>
                                {props.training.trainerName.slice(0,1)}
                            </div>
                            }
                            <div className="trainerName">Тренер: {props.training.trainerName}</div>
                        </div>
                        <div className="horseDisplayBlock" onClick={horseClicked}
                        style={{cursor: props.isCurrent ? "pointer" : "default"}}>
                            {props.training.horsePhoto && props.training.horsePhoto != "" &&
                            <Image className='bookingImg' src={props.training.horsePhoto} fluid roundedCircle />
                            }
                            {(!props.training.horsePhoto || props.training.horsePhoto == "") && props.training.horseName &&
                            <div className="emptyImage" style={{width: "200px", height: "200px"}}>
                                {props.training.horseName.slice(0,1)}
                            </div>
                            }
                            <div className="trainerName">Лошадь: {props.training.horseName}</div>
                        </div>
                    </div>
                    <div className="bookingType">Тип тренировки: {props.training.type}</div>
                    <div className="bookingComments">
                        Комментарий:
                        <div className="bookingCommentDisplay">
                            {props.training.comment.length > 0 ? props.training.comment : "нет"}
                        </div>
                    </div>
                    { props.isCurrent &&
                    <div className="cancelBtnBlock">
                        <Button className='cancelBtn' variant='warning'
                        onClick={() => cancelBooking(false)}>Отменить запись</Button>
                    </div>
                    }
                </div>
            </div>

            <Modal className='trainerModal' show={showTrainer} onHide={() => showTrainerSet(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>{props.training.trainerName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="InfoBlock">
                    <div className="ImageBlock">
                        <Image src={props.training.trainerPhoto} fluid />
                    </div>
                    <div className="specBlock">
                        Специализация: {props.training.trainerType}
                    </div>
                    <div className="descrBlock">
                        {props.training.trainerDescription}
                    </div>
                    <div className="phoneInfoBlock">
                        {props.training.trainerPhone}
                    </div>
                </div>
                </Modal.Body>
            </Modal>

            <Modal className='horseModal' show={showHorse} onHide={() => showHorseSet(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>{props.training.horseName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="InfoBlock">
                    <div className="ImageBlock">
                        <Image src={props.training.horsePhoto} fluid />
                    </div>
                    <div className="specBlock">
                        Специализация: {horseSpec}
                    </div>
                    <div className="descrBlock">
                        {props.training.horseDescription}
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default StudentBookingDisplay