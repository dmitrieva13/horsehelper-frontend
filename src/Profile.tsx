import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';

import './style/App.css'
import './style/Profile.css'

function Profile() {
    const { userId } = useParams();

    const [fetched, fetchedSet] = useState(0)
    const [name, nameSet] = useState("")
    const [description, descriptionSet] = useState("")
    const [type, typeSet] = useState("")
    const [photo, photoSet] = useState("")

    return(
        <div className="profileScreen">
            <div className="mainInfoBlock">
                <div className="imageBlock">
                    {photo != "" &&
                    <Image src={photo} roundedCircle />}
                    {photo == "" && 
                    <Image src="https://static.thenounproject.com/png/1095867-200.png" roundedCircle fluid/>}
                </div>
                <div className="nameBlock">Name{name}</div>
            </div>
            <div className="descriptionBlock">DDd{description}</div>
        </div>
    )
}

export default Profile