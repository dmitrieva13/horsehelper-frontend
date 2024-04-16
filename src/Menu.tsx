import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Offcanvas } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Menu.css'

function Menu() {
    const [showMenu, showMenuSet] = useState(false)
    const [name, nameSet] = useState("")
    const [id, idSet] = useState("")
    const [fetched, fetchedSet] = useState(0)

    const navigate = useNavigate()

    const handleClose = () => showMenuSet(false)
    const handleShow = () => showMenuSet(true)

    let homeClicked = () => {
        handleClose()
        navigate('../home')
    }

    let horsesClicked = () => {
        handleClose()
        navigate('../horses')
    }

    let trainersClicked = () => {
        handleClose()
        navigate('../trainers')
    }

    let bookingClicked = () => {
        handleClose()
        navigate('../book')
    }

    let profileClicked = () => {
        handleClose()
        navigate('../user' + id)
    }

    useEffect(() => {
        if (!fetched) {
            if (!localStorage['name'] || !localStorage['id']) {
                
                localStorage.clear()
                navigate('../signin')
            }
            nameSet(localStorage['name'])
            idSet(localStorage['id'])
            fetchedSet(1)
        }
    })

    return(
        <div className="menu">
            <div className="topHolder">
                <List className='menuIcon' onClick={handleShow} size={28}/>
                <div className="profileBtn" onClick={profileClicked}>{localStorage.getItem('name')}</div>
            </div>
            
            <Offcanvas show={showMenu} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Меню</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="menuBody">
                        <button className='menuBtn' onClick={homeClicked}>Домой</button>
                        <button className='menuBtn' onClick={horsesClicked}>Наши лошади</button>
                        <button className='menuBtn' onClick={trainersClicked}>Наши тренера</button>
                        <button className='menuBtn' onClick={bookingClicked}>Онлайн запись</button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default Menu