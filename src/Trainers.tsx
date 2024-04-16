import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';

import './style/App.css'
import './style/Trainers.css'
import Loading from './Loading';
import Menu from './Menu';

function Trainers() {
    const [fetched, fetchedSet] = useState(0)
    const [trainers, trainersSet] = useState<any[]>([])
    const [showInfo, showInfoSet] = useState(false)
    const [name, nameSet] = useState("")
    const [photo, photoSet] = useState("")
    const [description, descriptionSet] = useState("")
    const [specialization, specializationSet] = useState("")
    const [trainerId, trainerIdSet] = useState("")

    const navigate = useNavigate()

    let showHorseDetailed = (name: any, photo: any, descr: any, types: any, id: any) => {
        nameSet(name)
        photoSet(photo)
        descriptionSet(descr)
        specializationSet(types)
        showInfoSet(true)
    }

    useEffect(() => {
        if (!fetched) {
        //     fetch("https://horsehelper-backend.onrender.com/all_horses", {
        //       method: "POST",
        //       headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //       },
        //   }
        //   ).then(res=>res.json())
        //   .then(response=>{
        //     console.log(response)
        //     horsesSet(response.horses)
        //     if (response.accessToken) {
        //         localStorage.setItem('token', response.accessToken)
        //     }
        //     fetchedSet(1)
        //   })
        //   .catch(er=>{
        //     console.log(er.message)
        // })
        trainersSet([{
            name: "Владимир",
  trainerPhoto: "https://www.soyuz.ru/public/uploads/files/2/7442148/2020071012030153ea07b13d.jpg",
  trainerDescription: "КМС по выездке",
  trainerType: "Выездка"
        }])
        fetchedSet(1)
        }
    })

    if (fetched) {
    return(
        <div className="TrainersMainScreen">
            <Menu isProfile={false} />
            <div className="title">Наши тренера</div>
            <div className="trainersDisplay">
                {
                    trainers.length > 0 &&
                    trainers.map((trainer: any, i: number) => {
                        return(
                            <Card style={{ width: '20rem' }} key={i.toString()}
                            className='cardBlock' >
                                <Card.Img variant="top" src={trainer.trainerPhoto} className='cardImage'/>
                                <Card.Body>
                                    <Card.Title>{trainer.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Специализация: {trainer.trainerType}
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        )
                    })
                }

                {/* <Modal show={showInfo} onHide={() => showInfoSet(false)} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>{name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className="InfoBlock">
                                <div className="ImageBlock">
                                    <Image src={photo} fluid />
                                </div>
                                <div className="specBlock">
                                    Специализация: {specialization}
                                </div>
                                <div className="descrBlock">
                                    {description}
                                </div>
                            </div>
                            </Modal.Body>
                            {localStorage.getItem('role') == 'admin' &&
                            <Modal.Footer>
                                <Button variant='dark' className='btnCard'
                                onClick={() => raspBtnClicked(horseId)}>
                                    Расписание
                                </Button>
                            </Modal.Footer>
                            }
                </Modal> */}
            </div>

            {localStorage.getItem('role') == 'admin' &&
            <div className="newBtnBlock">
                <Button className="newTrainerBtn" variant='dark' size="lg"
                onClick={() => navigate('../addtrainer')}>
                    Добавить тренера
                </Button>
            </div>
            }
        </div>
    )
    }
    else {
        return(
            <Loading />
        )
    }
}

export default Trainers