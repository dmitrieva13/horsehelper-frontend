import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ListGroup, Image, Modal } from 'react-bootstrap';
import { Pencil, PersonLinesFill } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Profile.css'
import Menu from './Menu';

function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [name, nameSet] = useState("")
    const [description, descriptionSet] = useState("")
    const [type, typeSet] = useState("")
    const [photo, photoSet] = useState("")
    const [role, roleSet] = useState("")
    const [studentsList, studentsListSet] = useState<any[]>([])
    const [showList, showListSet] = useState(false)

    let stList = [
        {name: "A",
        id: "24"},
        {name: "B",
        id: "231"},
        {name: "C",
        id: "100"}
    ]

    let editClicked = () => {
        navigate('./edit')
    }

    let onlineBookingClicked = () => {
        navigate('../book')
    }

    let viewBookingsClicked = () => {
        navigate('../bookings/' + userId)
    }

    let trainerCalendarClicked = () => {
        navigate('../tcalendar/' + userId)
    }

    let trainerTodayClicked = () => {
        navigate('../todayschedule/' + userId)
    }

    let studentClicked = (stId: string) => {
        showListSet(false)
        navigate('../user/' + stId)
    }

    let getProfileData = () => {
        fetch("https://horsehelper-backend.onrender.com/get_profile", {
              method: "POST",
              body: JSON.stringify({
                    id: userId
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            // unavailableArrSet(response.unavailableDays)
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    useEffect(() => {
        if (!fetched) {
            getProfileData()
            roleSet("trainer")
            studentsListSet(stList)
            // photoSet("https://www.soyuz.ru/public/uploads/files/2/7442148/2020071012030153ea07b13d.jpg")
            fetchedSet(1)
        }
    })

    return(
        <div className="profileScreen">
            <Menu isProfile={userId == localStorage.getItem('id')} />
            <div className="mainInfoBlock">
                <div className="imageBlock">
                    {photo != "" &&
                    <Image className='avatarImg' src={photo} roundedCircle fluid />}
                    {/* {photo == "" && 
                    <Image src="https://static.thenounproject.com/png/1095867-200.png" roundedCircle fluid/>} */}
                </div>
                <div className="nameBlock">Name{name}</div>
            </div>
            <div className="descriptionBlock">
                <div className="defaultText">О себе:</div>
                DDd{description}
            </div>

            {role == 'trainer' &&
            <div className="studentsListBlock">
                <div className="studentsList" onClick={() => showListSet(true)}>
                    <PersonLinesFill />
                    ученики
                </div>
                {userId != localStorage.getItem('id') && 
                localStorage.getItem('role') == 'student' &&
                <Button variant='outline-dark' >
                        Добавиться в ученики
                </Button>
                }
            </div>
            }

            {userId == localStorage.getItem('id') &&
            <div className="buttonsBlock">
                <div className="editBtn" onClick={editClicked}>
                    <Pencil size={20} />
                    Редактировать профиль
                </div>

                {localStorage.getItem('role') == 'student' &&
                <div className="studentTrainingsBtn">
                    <Button variant='secondary' onClick={viewBookingsClicked}>
                        Мои записи на тренировки
                    </Button>
                    <Button variant='dark' onClick={onlineBookingClicked}>
                        Записаться на тренировку
                    </Button>
                </div>
                }

                {localStorage.getItem('role') == 'trainer' &&
                <div className="trainerTrainingsBtn">
                    <Button variant='secondary' onClick={trainerCalendarClicked}>
                        Мое расписание
                    </Button>
                    <Button variant='dark' onClick={trainerTodayClicked}>
                        Записи на сегодня
                    </Button>
                </div>
                }
            </div>
            }

            <Modal show={showList} onHide={() => showListSet(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Ученики тренера {name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup as="ol">
                        {studentsList.map((stud: any, i: any) => {
                            return(
                                <ListGroup.Item as="li"
                        className="d-flex justify-content-between align-items-start"
                        action key={i.toString()}
                            onClick={e => studentClicked(stud.id)}>
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{stud.name}</div>
                                </div>
                            </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Profile