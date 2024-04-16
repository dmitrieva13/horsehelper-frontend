import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Button, Row, Container, Card, Form, InputGroup } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";

import './style/App.css'

function SignIn() {
    const [phone, phoneSet] = useState("")
    const [password, passwordSet] = useState("")
    const [error, errorSet] = useState("")

    const navigate = useNavigate()

    interface JwtPayload {
        id: string,
        name: string,
        role: string
      }

    let login = () => {
        fetch("https://horsehelper-backend.onrender.com/login", {
              method: "POST",
              body: JSON.stringify({
                    phone: "+7"+phone,
                    password: password
                }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
          }
          ).then(res=>res.json())
          .then(response=>{
            console.log(response)
            localStorage.setItem('token', response.accessToken)
            const decoded = jwtDecode<JwtPayload>(response.accessToken);
            localStorage.setItem('id', decoded.id)
            localStorage.setItem('name', decoded.name)
            localStorage.setItem('role', decoded.role)
            navigate('../home')
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    return(
        <div>
            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card className="px-4">
                    <Card.Body>
                        <div className="mb-3 mt-md-4">
                        <h2 className="fw-bold mb-2 text-center ">
                            Вход в аккаунт
                        </h2>
                        <div className="mb-3">
                            <Form noValidate onSubmit={e => {
                                e.preventDefault()
                                login()
                            }}>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="text-center">
                                    Номер телефона
                                </Form.Label>
                                <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">+7</InputGroup.Text>
                                <Form.Control type="tel" placeholder="10 цифр без пробелов"
                                    onChange={a => phoneSet(a.target.value)} required
                                    aria-describedby="basic-addon1"
                                    pattern='[0-9]{10}'
                                />
                            </InputGroup>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control type="password" placeholder="Введите пароль" required
                                onChange={a => passwordSet(a.target.value)} />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicCheckbox"
                            ></Form.Group>
                            <div className="d-grid">
                                <Button variant="dark" type="submit">
                                    Войти
                                </Button>
                            </div>
                            </Form>
                            <div className="mt-3">
                            <p className="mb-0  text-center">
                                Еще нет аккаунта?{' '}
                                <a onClick={()=>{
                                    navigate('/')
                                }} className="text-dark fw-bold" style={{cursor: "pointer"}}>
                                    Зарегистрироваться
                                </a>
                            </p>
                            </div>
                        </div>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignIn