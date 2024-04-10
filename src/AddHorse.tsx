import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, InputGroup } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

import './style/App.css'
import './style/Add.css'

function AddHorse() {
  const [selectedTypes, selectedTypesSet] = useState<any[]>([])
  const [name, nameSet] = useState("")
  const [photo, photoSet] = useState("")
  const [description, descriptionSet] = useState("")
  const [loaded, loadedSet] = useState(0)
  const [errortotal, errortotalSet] = useState("")

  const types = [{name: "Общая", id: 1}, 
    {name: "Выездка", id: 2}, 
    {name: "Конкур", id: 3}]
  const navigate = useNavigate()


  let onSelect = (selectedList: any, selectedItem: any) => {
    selectedTypesSet(selectedList)
}

let onRemove = (selectedList: any, removedItem: any) => {
    selectedTypesSet(selectedList)
}

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
        descriptionSet("")
    }
  })

  let sendData = (typesSelected: any[]) => {
    fetch("https://horsehelper-backend.onrender.com/add_horse", {
              method: "POST",
              body: JSON.stringify({
                    name: name,
                    photo: photo,
                    description: description,
                    types: typesSelected,
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
            localStorage.setItem('token', response.accessToken)
          })
          .catch(er=>{
            console.log(er.message)
        })
  }

  let addHorseButtonClicked = () => {
    let checked = true
    if (selectedTypes.length == 0) {
        setError("selection")
        checked = false
    }
    if (name.length == 0) {
        setError("addHorseNameInput")
        checked = false
    }
    if (!checked) {
        errortotalSet('Заполните все обязательные* поля!')
        return
    }

    let arr: any[] = []
    selectedTypes.map((t: any) => {
      arr.push(t.name)
    })
    sendData(arr)
    // makeVisisble('createdSuccesfullyBlock')
    // makeInvisisble('AddHorseInputsBlock')
    // setTimeout(() => {
    //     navigate("/")
    // }, 2000)
}

  return (
    <div className="AddHorseScreen">
        {/* <div className="createdSuccesfullyBlock invisible">
            <div className="successText">
              Работник {username} успешно добавлен!
            </div>
        </div> */}
        <div className="AddHorseInputsBlock">
            <div className="addHorseTitleBlock">
                <div className="addWorkerTitle">ДОБАВЛЕНИЕ ЛОШАДИ</div>
            </div>
            <div className="typeBlockMultiselect">
                <div className="textLong">Тип занятий, для которых подходит лошадь: *</div>
                <Multiselect className='selection'
                placeholder='Типы тренировок'
                style={{border: "none"}}
                hidePlaceholder={true}
                options={types} 
                onSelect={onSelect} // Function will trigger on select event
                onRemove={onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
                avoidHighlightFirstOption={true}
                showArrow={true}
            />
            </div>

            <div className="nameBlock">
                <div className="text">Имя лошади: *</div>
                <input className="addHorseNameInput" type="text" maxLength={30} value={name}
                                onChange={e => nameSet(e.target.value)} />
            </div>
            <div className="descriptionBlock">
                <div className="text">Описание:</div>
                <input className="addHorseDescInput" type="text" maxLength={1000} value={description}
                                onChange={e => descriptionSet(e.target.value)} />
            </div>
            <div className="photoBlock">
                <div className="text">Ссылка на фото:</div>
                <input className="addHorsePhotoInput" type="text" maxLength={1000} value={photo}
                                onChange={e => photoSet(e.target.value)} />
            </div>
            <div className="buttonBlock">
                <div className="addHorseError">{errortotal}</div>
                <Button className='addButton' variant="dark" size="lg"
                onClick={addHorseButtonClicked}>
                    Добавить лошадь
                </Button>
            </div>
        </div>
    </div>
  )
}

export default AddHorse