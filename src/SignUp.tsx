import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Button, Row, Container, Card, Form, InputGroup } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import { Eye, EyeSlash } from 'react-bootstrap-icons';

import './style/App.css'

import Menu from './Menu';

function SignUp() {
    const [name, nameSet] = useState("")
    const [phone, phoneSet] = useState("")
    const [password, passwordSet] = useState("")
    const [error, errorSet] = useState("")
    const [type, typeSet] = useState("password")

    const navigate = useNavigate()

    interface JwtPayload {
        id: string,
        name: string,
        role: string
      }

    let register = () => {
        fetch("https://horsehelper-backend.onrender.com/register", {
              method: "POST",
              body: JSON.stringify({
                    name: name,
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
            navigate('../')
          })
          .catch(er=>{
            console.log(er.message)
        })
    }

    let showPasswordClicked = () => {
        typeSet("text")
    }

    let hidePasswordClicked = () => {
        typeSet("password")
    }

    return(
        <div>
            <Menu isProfile={false} />
            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card className="px-4">
                    <Card.Body>
                        <div className="mb-3 mt-md-4">
                        <h2 className="fw-bold mb-2 text-center ">
                            Регистрация
                        </h2>
                        <div className="mb-3 w-100 p-3">
                            <Form onSubmit={e => {
                                e.preventDefault()
                                register()
                                // console.log(name, password, email)
                            }}>
                            <Form.Group className="mb-3 w-100" controlId="Name">
                                <Form.Label className="text-center">Ваше имя</Form.Label>
                                <Form.Control type="text" placeholder="Введите имя"
                                    onChange={a => nameSet(a.target.value)}
                                    required maxLength={50}
                                />
                            </Form.Group>

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

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                <Form.Label>Пароль</Form.Label>
                                <div className='passwordInput'>
                                    <Form.Control type={type} placeholder="Введите пароль"
                                        onChange={a => passwordSet(a.target.value)} required
                                        minLength={4} maxLength={30}
                                    />
                                    {type == "password" &&
                                    <Eye className='passIcon' size={20} onClick={showPasswordClicked} />
                                    }
                                    {type == "text" &&
                                    <EyeSlash className='passIcon' size={20} onClick={hidePasswordClicked} />
                                    }
                                </div>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicCheckbox"
                            ></Form.Group>
                            <div className="d-grid">
                                <Button variant="dark" type="submit">
                                    Создать аккаунт
                                </Button>
                            </div>
                            </Form>
                            <div className="mt-3">
                            <p className="mb-0  text-center">
                                Уже есть аккаунт?{' '}
                                <a onClick={()=>{
                                    navigate('../signin')
                                }} className="text-dark fw-bold" style={{cursor: "pointer"}}>
                                    Войти
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

export default SignUp