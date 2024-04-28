import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Add.css'

function AddTrainer() {
  const [type, typeSet] = useState("")
  const [name, nameSet] = useState("")
  const [password, passwordSet] = useState("")
  const [phone, phoneSet] = useState("")
  const [description, descriptionSet] = useState("")
  const [photo, photoSet] = useState("")

  const [loaded, loadedSet] = useState(0)
  const [phoneInvalid, phoneInvalidSet] = useState(false)
  const [errortotal, errortotalSet] = useState("")

  const types = ["Общая", "Выездка", "Конкур"]
  const navigate = useNavigate()

  let setError = (inputName: string) => {
    let input = document.querySelector("."+inputName)
    // console.log(input)
    if (input != null) {
      input.className += " invalid"
      input.addEventListener("click", e => {
        let found = document.querySelector("."+inputName)
        if (found != null) {
          found.className = inputName
        }
      })
    }
    }

  let makeVisisble = (className: string) => {
    let divClass = document.querySelector("." + className)
    if (divClass != null) {
      divClass.className = className
    }
  }

  let makeInvisisble = (className: string) => {
    let divClass = document.querySelector("." + className)
    if (divClass != null) {
      divClass.className += " invisible"
    }
  }

  useEffect(() => {
    if (!loaded) {
        loadedSet(1)
        nameSet("")
        passwordSet("")
        typeSet("")
        phoneSet("")
        descriptionSet("")
    }
  })

  let sendData = () => {
    fetch("https://horsehelper-backend.onrender.com/register_trainer", {
              method: "POST",
              body: JSON.stringify({
                    phone: "+7"+phone,
                    password: password,
                    name: name,
                    trainerPhoto: photo,
                    trainerDescription: description,
                    trainerType: type,
                    accessToken: localStorage.getItem('token')
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
            if (response.accessToken) {
              localStorage.setItem('token', response.accessToken)
            }
            navigate('../trainers')
          })
          .catch(er=>{
            console.log(er.message)
        })
  }

  let addWorkerButtonClicked = () => {
    let checked = true
    if (type == "") {
        setError("selection")
        checked = false
    }
    if (name.length == 0) {
        setError("addWorkerUserInput")
        checked = false
    }
    if (password.length < 4 || password.length > 30) {
        setError("addWorkerPasswordInput")
        checked = false
    }
    if (phone.length != 10) {
        phoneInvalidSet(true)
        checked = false
    }
    if (!checked) {
        errortotalSet('Заполните все обязательные поля!')
        return
    }
    sendData()
    // makeVisisble('createdSuccesfullyBlock')
    // makeInvisisble('AddWorkerInputsBlock')
    // setTimeout(() => {
    //     navigate("/")
    // }, 2000)
}

  let backClicked = () => {
    navigate('../trainers')
  }

  return (
    <div className="AddWorkerScreen">
        {/* <div className="createdSuccesfullyBlock invisible">
            <div className="successText">
              Работник {username} успешно добавлен!
            </div>
        </div> */}
        <div className="AddWorkerInputsBlock">
          <div className="backButtonBlock">
            <ArrowLeft onClick={backClicked} size={28} style={{cursor: 'pointer'}}/>
          </div>
            <div className="addWorkerTitleBlock">
                <div className="addWorkerTitle">ДОБАВЛЕНИЕ ТРЕНЕРА</div>
            </div>
            <div className="typeBlock">
                <div className="textLong">Тип занятий, которые ведет тренер: *</div>
                <select className='selection' onChange={e => typeSet(e.target.value)}>
                    <option hidden value="">Тип тренировки</option>
                    {types.map((option: any, i: number) => {
                        return(
                        <option key={i} value={option}>
                            {option}
                        </option>
                    )})}
                </select>
            </div>
            <div className="usernameBlock">
                <div className="text">Имя тренера: *</div>
                <input className="addWorkerUserInput" type="text" maxLength={50} value={name}
                                onChange={e => nameSet(e.target.value)} />
            </div>
            <div className="phoneBlock">
                <div className="text">Телефон тренера: *</div>
                <InputGroup className="phoneInput" hasValidation>
                                <InputGroup.Text id="basic-addon1">+7</InputGroup.Text>
                                <Form.Control type="tel" placeholder="10 цифр без пробелов"
                                    onChange={a => phoneSet(a.target.value)} 
                                    onClick={e => phoneInvalidSet(false)}
                                    required
                                    aria-describedby="basic-addon1"
                                    pattern='[0-9]{10}' 
                                    isInvalid = {phoneInvalid}
                                />
                            </InputGroup>
            </div>
            <div className="passwordBlock">
                <div className="text">Пароль для входа в аккаунт: *</div>
                <input className="addWorkerPasswordInput" type="password" maxLength={30} value={password}
                                onChange={e => passwordSet(e.target.value.replace(/[^A-Za-z0-9?!-.,_]/ig, ''))} 
                                required minLength={4} placeholder='от 4 до 30 символов'/>
            </div>
            <div className="descriptionInputBlock">
                <div className="text">Описание:</div>
                <input className="addWorkerDescInput" type="text" maxLength={1000} value={description}
                                onChange={e => descriptionSet(e.target.value)} />
            </div>
            <div className="photoBlock">
                <div className="text">Ссылка на фото:</div>
                <input className="addWorkerPhotoInput" type="text" maxLength={1000} value={photo}
                                onChange={e => photoSet(e.target.value)} />
            </div>

            <div className="buttonBlock">
                <div className="addWorkerError">{errortotal}</div>
                <Button className='addButton' variant="dark" size="lg"
                onClick={addWorkerButtonClicked}>
                    Добавить тренера
                </Button>
            </div>
        </div>
    </div>
  )
}

export default AddTrainer