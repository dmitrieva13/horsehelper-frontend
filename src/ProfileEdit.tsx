import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Profile.css'
import Loading from './Loading';

function ProfileEdit() {
    const { userId } = useParams();
    const navigate = useNavigate()

    const [fetched, fetchedSet] = useState(0)
    const [photo, photoSet] = useState("")
    const [description, descriptionSet] = useState("")

    let backClicked = () => {
        navigate('../user/' + userId)
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
            descriptionSet(response.userDescription ? response.userDescription : "")
            photoSet(response.userPic ? response.userPic : "")
            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let saveClicked = (isRefresh: boolean) => {
        fetch("https://horsehelper-backend.onrender.com/change_profile", {
              method: "POST",
              body: JSON.stringify({
                    id: userId,
                    userPic: photo,
                    userDescription: description,
                    accessToken: localStorage.getItem('token'),
                    refreshToken: isRefresh ? localStorage.getItem('refreshToken') : null
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.error) {
                localStorage.clear()
                navigate('../signin')
            }
            if (response.errorMessage && response.errorMessage == "Token is expired") {
                if (!isRefresh) {
                    saveClicked(true)
                }
                return
            }

            if (response.accessToken) {
                localStorage.setItem('token', response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken)
            }
            
            navigate('../user/' + userId)
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    useEffect(() => {
        if (!fetched) {
            getProfileData()
            fetchedSet(1)
            // photoSet("https://www.soyuz.ru/public/uploads/files/2/7442148/2020071012030153ea07b13d.jpg")
        }
    }, [])

    if (fetched) {
    return(
        <div className="profileEditScreen">
            <div className="backButtonBlock">
                <ArrowLeft onClick={backClicked} size={28} style={{cursor: 'pointer'}}/>
            </div>
            <div className="titleBlock">РЕДАКТИРОВАНИЕ ПРОФИЛЯ</div>

            <div className="inputsEditBlock">
                <div className="photoEditBlock">
                    <div className="inputEditText">Ссылка на фото:</div>
                    <input className="photoInput" id="photoInput" type="text" maxLength={500} value={photo} 
                    onChange={e => photoSet(e.target.value)} />
                </div>
                <div className="descEditBlock">
                    <div className="inputEditText">Описание:</div>
                    <input className="descrInput" id="descrInput" type="text" maxLength={1000} value={description} 
                    onChange={e => descriptionSet(e.target.value)} />
                </div>
            </div>

            <div className="saveBtnBlock">
                <Button variant='dark' size='lg' onClick={() => saveClicked(false)}>
                    Сохранить изменения
                </Button>
            </div>
        </div>
    )}
    else {
        return(
            <Loading />
        )
    }
}

export default ProfileEdit