import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Profile.css'

function ProfileEdit() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [photo, photoSet] = useState("")
    const [description, descriptionSet] = useState("")

    let backClicked = () => {
        navigate('../user/' + userId)
    }

    let saveClicked = () => {
        navigate('../user/' + userId)
    }

    return(
        <div className="profileEditScreen">
            <div className="backButtonBlock">
                <ArrowLeft onClick={backClicked} size={28} style={{cursor: 'pointer'}}/>
            </div>
            <div className="titleBlock">РЕДАКТИРОВАНИЕ ПРОФИЛЯ</div>

            <div className="inputsEditBlock">
                <div className="photoEditBlock">
                    <div className="inputEditText">Ссылка на фото:</div>
                    <input className="photoInput" type="text" maxLength={500} value={photo} 
                    onChange={e => photoSet(e.target.value)} />
                </div>
                <div className="descEditBlock">
                    <div className="inputEditText">Описание:</div>
                    <input className="descrInput" type="text" maxLength={1000} value={description} 
                    onChange={e => descriptionSet(e.target.value)} />
                </div>
            </div>

            <div className="saveBtnBlock">
                <Button variant='dark' size='lg' onClick={saveClicked}>
                    Сохранить изменения
                </Button>
            </div>
        </div>
    )
}

export default ProfileEdit