import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Form, ListGroupItem } from 'react-bootstrap';
import Moment from 'moment';

import './style/App.css'
import './style/HomePage.css'
import Announcement from './Announcement';
import Loading from './Loading';
import Menu from './Menu';

function HomePage() {
    const [fetched, fetchedSet] = useState(0)
    const [announcements, announcementsSet] = useState<any[]>([])
    const [showModal, showModalSet] = useState(false)
    const [newTitle, newTitleSet] = useState("")
    const [newTextBody, newTextBodySet] = useState("")
    const [newTitleValid, newTitleValidSet] = useState(true)

    const navigate = useNavigate()

    const handleClose = () => {
        showModalSet(false)
        newTitleSet("")
        newTextBodySet("")
    }
    const handleShow = () => showModalSet(true)

    let getAnnouncements = () => {
        fetch("https://horsehelper-backend.onrender.com/announcements", {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            if (response.errorMessage) {
                localStorage.clear()
                navigate('../signin')
            }
            let news = response.announcements.sort((a: any, b: any) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            }).reverse()
            announcementsSet(news)
            if (!fetched) {
                fetchedSet(1)
            }
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let createAnnouncement = () => {
        if (newTitle == "") {
            newTitleValidSet(false)
            return
        }
        fetch("https://horsehelper-backend.onrender.com/new_announcement", {
              method: "POST",
              body: JSON.stringify({
                    title: newTitle,
                    body: newTextBody,
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
            if (response.errorMessage) {
                localStorage.clear()
                navigate('../signin')
            }
            getAnnouncements()
            handleClose()
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
            getAnnouncements()
        }
    })

    if (fetched) {
    return(
        <div className="homePage">
            <Menu />
            <div className="titleBlock">Наши новости</div>
            <div className="announcementsBlock">
                {announcements.length > 0 &&
                announcements.map((an: any, i: any) =>{
                    return(
                        <Announcement key={i.toString()} date={new Date(an.date)} title={an.title} body={an.body} />
                    )
                })
                }
            </div>

            <div className="newBtnBlock">
                <Button className="newAnnouncementBtn" variant='dark'
                onClick={handleShow}>Добавить объявление</Button>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Новое объявление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInputTitle">
                        <Form.Label>Заголовок</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название объявления"
                            onChange={a => newTitleSet(a.target.value)} 
                            autoFocus
                            isInvalid = {!newTitleValid}
                            onClick={() => newTitleValidSet(true)}
                        />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlText">
                    <Form.Label>Текст объявления</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={a => newTextBodySet(a.target.value)}  />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="dark" onClick={createAnnouncement}>
                    Создать
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
    }
    else {
        return(
            <Loading />
        )
    }
}

export default HomePage