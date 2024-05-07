import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Offcanvas, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { List, BoxArrowRight, Bell } from 'react-bootstrap-icons';

import './style/App.css'
import './style/Menu.css'
import Notification from './Notification';

function Menu(props: {isProfile: boolean}) {
    const [showMenu, showMenuSet] = useState(false)
    const [id, idSet] = useState("")
    const [fetched, fetchedSet] = useState(0)
    const [trainerNotifications, trainerNotificationsSet] = useState<any[]>([])
    const [studentNotifications, studentNotificationsSet] = useState<any[]>([])
    const [hasNotifications, hasNotificationsSet] = useState(false)

    const navigate = useNavigate()

    const handleClose = () => showMenuSet(false)
    const handleShow = () => showMenuSet(true)

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props} hidden={!hasNotifications}>
          {(localStorage.getItem('role') == 'trainer' && trainerNotifications.length > 0) &&
          trainerNotifications.map((n: any, i: number) => {
            return(
                <Notification notification={n} role={"trainer"} key={i} />
            )
          })
          }
          {(localStorage.getItem('role') == 'student' && studentNotifications.length > 0) &&
          studentNotifications.map((n: any, i: number) => {
            return(
                <Notification notification={n} role={"student"} key={i} />
            )
          })
          }
        </Tooltip>
      )

    let newsClicked = () => {
        handleClose()
        navigate('../news')
    }

    let homeClicked = () => {
        handleClose()
        navigate('../')
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
        navigate('../user/' + id)
    }

    let logoutClicked = () => {
        localStorage.clear()
        navigate('../signin')
    }

    let getTrainerNotifications = () => {
        fetch("https://horsehelper-backend.onrender.com/trainer_notifications", {
              method: "POST",
              body: JSON.stringify({
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.error) {
              localStorage.clear()
              navigate('../signin')
            }
            if (response.errorMessage) {
                localStorage.clear()
                navigate('../signin')
            }

            if (response.notifications) {
                trainerNotificationsSet(response.notifications)
                if (response.notifications.length > 0) {
                    hasNotificationsSet(true)
                }
            }
            if (response.accessToken) {
              localStorage.setItem('token', response.accessToken)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let getStudentNotifications = () => {
        fetch("https://horsehelper-backend.onrender.com/student_notifications", {
              method: "POST",
              body: JSON.stringify({
                    accessToken: localStorage.getItem('token')
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.error) {
              localStorage.clear()
              navigate('../signin')
            }
            if (response.errorMessage) {
                localStorage.clear()
                navigate('../signin')
            }

            if (response.notifications) {
                studentNotificationsSet(response.notifications)
                if (response.notifications.length > 0) {
                    hasNotificationsSet(true)
                }
            }
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
            if (!localStorage['name'] || !localStorage['id']) {
                
                localStorage.clear()
                navigate('../signin')
            }
            idSet(localStorage['id'])
            if (localStorage.getItem('role') == "trainer") {
                getTrainerNotifications()
            }
            if (localStorage.getItem('role') == "student") {
                getStudentNotifications()
            }
            fetchedSet(1)
        }
    }, [])

    return(
        <div className="menu">
            <div className="topHolder">
                <List className='menuIcon' onClick={handleShow} size={28}/>
                { !props.isProfile &&
                <div className="profileBlock">

                    <OverlayTrigger
                    trigger={"click"}
                    placement="left"
                    delay={{ show: 200, hide: 400 }}
                    overlay={renderTooltip}
                    >
                        <div className="notificationsBlock" style={{cursor: hasNotifications ? "pointer" : "default"}}>
                        <Bell size={22} />
                            {hasNotifications &&
                            <Badge className='badge' bg="warning" text="warning" pill>.</Badge>
                            }
                        </div>
                    </OverlayTrigger>
                    
                    <div className="profileBtn" onClick={profileClicked}>{localStorage.getItem('name')}</div>
                </div>
                }
                { props.isProfile &&
                <div className="logoutBtn" onClick={logoutClicked}>
                    Выйти
                    <BoxArrowRight size={20} color='#92000a' />
                </div>
                }
            </div>
            
            <Offcanvas show={showMenu} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Меню</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="menuBody">
                        <button className='menuBtn' onClick={homeClicked}>Домой</button>
                        <button className='menuBtn' onClick={newsClicked}>Наши новости</button>
                        <button className='menuBtn' onClick={horsesClicked}>Наши лошади</button>
                        <button className='menuBtn' onClick={trainersClicked}>Наши тренера</button>
                        {localStorage.getItem('role') == 'student' &&
                            <button className='menuBtn' onClick={bookingClicked}>Онлайн запись</button>
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default Menu