import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Image, Modal, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import Moment from 'moment';

import './style/App.css'
import './style/StudentBookings.css'
import Loading from './Loading';

function StudentBookingDisplay(props: {training: any, isCurrent: boolean}) {
    const [showTrainer, showTrainerSet] = useState(false)
    const [showHorse, showHorseSet] = useState(false)
    const [horseSpec, horseSpecSet] = useState("")
    const [fetched, fetchedSet] = useState(0)
    const [isCancelled, isCancelledSet] = useState(false)

    let dateBeautify = (date: Date) => {
        Moment.locale('ru');
        let m = Moment(date).format('DD MMM YYYY HH:mm')
        return m
    }

    let trainerClicked = () => {
        showTrainerSet(true)
    }

    let horseClicked = () => {
        showHorseSet(true)
    }

    useEffect(() => {
        if (!fetched) {
            if (!props.isCurrent && props.training.isCancelled) {
                isCancelledSet(true)
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
                        <div className="trainerDisplayBlock" onClick={trainerClicked}>
                            <Image className='bookingImg' src={props.training.trainerPhoto} fluid roundedCircle />
                            <div className="trainerName">Тренер: {props.training.trainerName}</div>
                        </div>
                        <div className="horseDisplayBlock" onClick={horseClicked}>
                            <Image className='bookingImg' src={props.training.horsePhoto} fluid roundedCircle />
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
                        <Button className='cancelBtn' variant='warning'>Отменить запись</Button>
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
                </div>
                </Modal.Body>
            </Modal>

            {/* <Modal className='horseModal' show={showHorse} onHide={() => showHorseSet(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>{horse.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="InfoBlock">
                    <div className="ImageBlock">
                        <Image src={horse.photo} fluid />
                    </div>
                    <div className="specBlock">
                        Специализация: {horseSpec}
                    </div>
                    <div className="descrBlock">
                        {horse.description}
                    </div>
                </div>
                </Modal.Body>
            </Modal> */}
        </div>
    )
}

export default StudentBookingDisplay