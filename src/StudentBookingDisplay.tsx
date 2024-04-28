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
    const [trainer, trainerSet] = useState(null)
    const [horse, horseSet] = useState(null)
    const [horseSpec, horseSpecSet] = useState("")
    const [trainerFetched, trainerFetchedSet] = useState(0)
    const [horseFetched, horseFetchedSet] = useState(0)

    let dateBeautify = (date: Date) => {
        Moment.locale('ru');
        let m = Moment(date).format('DD MMM YYYY HH:mm')
        return m
    }

    let trainerClicked = (id: any) => {
        if (!trainerFetched) {
            trainerFetchedSet(1)
        }
        showTrainerSet(true)
    }

    let horseClicked = (id: any) => {
        if (!horseFetched) {
            horseFetchedSet(1)
        }
        showHorseSet(true)
    }

    return(
        <div className="StudentBookingDisplay">

            <div className="bookingsBlock">
                <div className="bookingInfo">
                    <div className="bookingDate">{dateBeautify(new Date())}</div>
                    <div className="trainerHorseDisplayBlock">
                        <div className="trainerDisplayBlock" onClick={trainerClicked}>
                            <Image className='bookingImg' src='https://img.freepik.com/free-photo/mountains-lake_1398-1150.jpg' fluid roundedCircle />
                            <div className="trainerName">Тренер: Владимир</div>
                        </div>
                        <div className="horseDisplayBlock" onClick={horseClicked}>
                            <Image className='bookingImg' src='https://img.freepik.com/free-photo/mountains-lake_1398-1150.jpg' fluid roundedCircle />
                            <div className="trainerName">Лошадь: Horse</div>
                        </div>
                    </div>
                    <div className="bookingType">Тип тренировки: </div>
                    <div className="bookingComments">Комментарий</div>
                    { props.isCurrent &&
                    <div className="cancelBtnBlock">
                        <Button className='cancelBtn' variant='warning'>Отменить запись</Button>
                    </div>
                    }
                </div>
            </div>

            <Modal className='trainerModal' show={showTrainer} onHide={() => showTrainerSet(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>{"trainer.name"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="InfoBlock">
                    <div className="ImageBlock">
                        {/* <Image src={"trainer.trainerPhoto"} fluid /> */}
                    </div>
                    <div className="specBlock">
                        Специализация: {"trainer.trainerType"}
                    </div>
                    <div className="descrBlock">
                        {"trainer.trainerDescription"}
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