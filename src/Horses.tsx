import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';

import './style/App.css'
import './style/Horses.css'
import Loading from './Loading';

function Horses() {
    const [fetched, fetchedSet] = useState(0)
    const [horses, horsesSet] = useState<any[]>([])
    const [showInfo, showInfoSet] = useState(false)
    const [name, nameSet] = useState("")
    const [photo, photoSet] = useState("")
    const [description, descriptionSet] = useState("")
    const [specialization, specializationSet] = useState("")
    const [horseId, horseIdSet] = useState("")

    const navigate = useNavigate()

    let showHorseDetailed = (name: any, photo: any, descr: any, types: any, id: any) => {
        nameSet(name)
        photoSet(photo)
        descriptionSet(descr)
        specializationSet(types)
        horseIdSet(id)
        showInfoSet(true)
    }

    let raspBtnClicked = (id: any) => {
        navigate(id + "/calendar")
    }

    useEffect(() => {
        if (!fetched) {
            fetch("https://horsehelper-backend.onrender.com/all_horses", {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            horsesSet(response.horses)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
            fetchedSet(1)
        }
    })

    if (fetched) {
    return(
        <div className="HorsesMainScreen">
            <div className="title">Наши лошади</div>
            <div className="horsesDisplay">
                {
                    horses.length > 0 &&
                    horses.map((horse: any, i: number) => {
                        let spec = ""
                        horse.types.map((t: any, indx: any) => {
                            if (indx > 0) {
                                spec += ", "
                            }
                            spec += t
                        })
                        return(
                            <Card style={{ width: '20rem' }} key={i.toString()}
                            className='cardBlock' onClick={e => {
                                showHorseDetailed(horse.name, horse.photo, 
                                    horse.description, spec, horse.id)
                            }}>
                                <Card.Img variant="top" src={horse.photo} className='cardImage'/>
                                <Card.Body>
                                    <Card.Title>{horse.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Специализация: {spec}</Card.Subtitle>
                                    {localStorage.getItem('role') == 'admin' &&
                                    <Button variant="dark" onClick={() => raspBtnClicked(horse.id)}>Расписание</Button>
                                    }
                                </Card.Body>
                            </Card>
                        )
                    })
                }

                <Modal show={showInfo} onHide={() => showInfoSet(false)} centered>
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
                </Modal>
            </div>
        </div>
    )
    }
    else {
        return(
            <Loading />
        )
    }
}

export default Horses