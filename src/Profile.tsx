import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';

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

    let editClicked = () => {
        navigate('./edit')
    }

    return(
        <div className="profileScreen">
            <Menu isProfile={true} />
            <div className="mainInfoBlock">
                <div className="imageBlock">
                    {photo != "" &&
                    <Image src={photo} roundedCircle />}
                    {photo == "" && 
                    <Image src="https://static.thenounproject.com/png/1095867-200.png" roundedCircle fluid/>}
                </div>
                <div className="nameBlock">Name{name}</div>
            </div>
            <div className="descriptionBlock">
                <div className="defaultText">О себе:</div>
                DDd{description}
            </div>
            <div className="buttonsBlock">
                <div className="editBtn" onClick={editClicked}>
                    <Pencil size={20} />
                    Редактировать профиль
                </div>

                {localStorage.getItem('role') == 'student' &&
                <div className="studentTrainingsBtn">
                    <Button variant='secondary' >
                        Мои записи на тренировки
                    </Button>
                    <Button variant='dark' >
                        Записаться на тренировку
                    </Button>
                </div>
                }

                {localStorage.getItem('role') == 'trainer' &&
                <div className="trainerTrainingsBtn">
                    <Button variant='secondary' >
                        Мое расписание
                    </Button>
                    <Button variant='dark' >
                        Записи на сегодня
                    </Button>
                </div>
                }
            </div>
        </div>
    )
}

export default Profile