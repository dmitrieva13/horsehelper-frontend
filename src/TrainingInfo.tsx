import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, ListGroup } from 'react-bootstrap';
import Moment from 'moment';

import './style/App.css'
import './style/TrainingInfo.css'

function TrainingInfo(props: {booking: any}) {
    
    const [showFull, showFullSet] = useState(false)

let dateBeautify = () => {
    Moment.locale('ru');
    let m = Moment(props.booking.date).format('DD MMM YYYY HH:mm')
    return m
}

    return(
        <div className="TrainingInfo">
            <div className="InfoBlock" onClick={e => showFullSet(true)}>
                <div className="dateBlock">{dateBeautify()}</div>
                <div className="studentInformationPreview">
                    Ученик: {props.booking.name}
                </div>
                <div className="trainerInformationPreview">
                    Тренер: {props.booking.trainerName}
                </div>
            </div>

            <Modal show={showFull} onHide={() => showFullSet(false)} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Тренировка {dateBeautify()}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className="InfoBlock">
                                <div className="studentInformation">
                                    Ученик: {props.booking.name}
                                    <div className="studentPhone">{props.booking.phone}</div>
                                </div>
                                <div className="trainerInformation">
                                    Тренер: {props.booking.trainerName}
                                    <div className="trainerPhone">{props.booking.trainerPhone}</div>
                                </div>
                                {props.booking.horseName &&
                                <div className="horseInformation">
                                    Лошадь: {props.booking.horseName}
                                </div>
                                }
                                <div className="typeInfoBlock">Тип тренировки: {props.booking.type}</div>
                                <div className="commentInformation">
                                    Комментарий: 
                                    <div className="comment">{props.booking.comment}</div>
                                </div>
                            </div>
                            </Modal.Body>
                </Modal>
        </div>
    )
}

export default TrainingInfo