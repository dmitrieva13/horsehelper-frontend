import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, ListGroup } from 'react-bootstrap';
import Moment from 'moment';

import './style/App.css'
import './style/TrainingInfo.css'

function TrainingInfo(props: {date: any, student: string, studentPhone: string,
trainer: string, trainerPhone: string, horse: string, type: any, comment: string}) {
    
    const [showFull, showFullSet] = useState(false)

let dateBeautify = () => {
    Moment.locale('ru');
    let m = Moment(props.date).format('DD MMM YYYY HH:mm')
    return m
}

    return(
        <div className="TrainingInfo">
            <div className="InfoBlock" onClick={e => showFullSet(true)}>
                <div className="dateBlock">{dateBeautify()}</div>
                <div className="studentInformationPreview">
                    Ученик: {props.student}
                </div>
                <div className="trainerInformationPreview">
                    Тренер: {props.trainer}
                </div>
            </div>

            <Modal show={showFull} onHide={() => showFullSet(false)}>
                            <Modal.Header closeButton>
                            <Modal.Title>Тренировка {dateBeautify()}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className="InfoBlock">
                                <div className="typeInfoBlock">Тип тренировки: {props.type}</div>
                                <div className="studentInformation">
                                    Ученик: {props.student}
                                    <div className="studentPhone">{props.studentPhone}</div>
                                </div>
                                <div className="trainerInformation">
                                    Тренер: {props.trainer}
                                    <div className="trainerPhone">{props.trainerPhone}</div>
                                </div>
                                <div className="horseInformation">
                                    Лошадь: {props.horse}
                                </div>
                                <div className="commentInformation">
                                    Комментарий: 
                                    <div className="comment">{props.horse}</div>
                                </div>
                            </div>
                            </Modal.Body>
                </Modal>
        </div>
    )
}

export default TrainingInfo