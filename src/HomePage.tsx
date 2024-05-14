import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'react-bootstrap';

import './style/App.css'
import './style/HomePage.css'
import Menu from './Menu';

function HomePage() {
    const mainImage = "https://www.thesprucepets.com/thmb/WCHi1vABy_vfH6kDo7snIluUzyo=/2109x0/filters:no_upscale():strip_icc()/GettyImages-909948608-5c69cd9446e0fb0001560d1a.jpg"
    const horseImage = "https://media.istockphoto.com/id/1250673950/photo/appaloosa-horse-adult-standing-in-paddock-with-grass-in-mouth.jpg?s=612x612&w=0&k=20&c=9f1Z3UxEIMOM20qmDNWG8as-qaxxIHGGgWygpRtmJzI="
    const trainerPhoto = "https://successundersaddle.com/wp-content/uploads/2019/05/Great-Coaching-in-Horsemanship.jpg"

    const trainersText = "Познакомьтесь с нашей командой профессиональных тренеров"
    const horsesText = "Посмотрите на лошадей нашей школы"
    const registrationText = "Зарегистрируйтесь, чтобы прямо сейчас записаться на занятие онлайн!"

    const navigate = useNavigate()

    let horsesClicked = () => {
        navigate('../horses')
    }

    let trainersClicked = () => {
        navigate('../trainers')
    }

    let signupClicked = () => {
        navigate('../signup')
    }

    return(
        <div className="homePage">
            <Menu isProfile={false} />
            <div className="mainInfoDisplay">
                <div className="mainInfoText">
                    <p>
                    Наша школа была открыта в 2020 году. Школа расположена в 
                    Измайловском парке с прекрасной транспортной доступностью.
                    </p>
                    <p>
                        Мы работаем с 10 до 21 каждый день.
                    </p>
                </div>
                <div className="trainersInfoDisplay">
                    <Image src={trainerPhoto} className='infoImg trainerMainImg' fluid />
                    <div className="homepageText">{trainersText}</div>
                    <button className='lookBtn' onClick={trainersClicked}>Тренера</button>
                </div>
                <div className="horseInfoBlock">
                    <div className="horsesInfoDisplay">
                        <Image src={horseImage} className='infoImg horseImg' fluid />
                        <div className="homepageText horsesHomepage">{horsesText}</div>
                        <button className='lookBtn' onClick={horsesClicked}>Лошади</button>
                    </div>
                </div>
                {!localStorage.getItem('token') &&
                <div className="registrationInfoDisplay">
                    <div className="homepageText">{registrationText}</div>
                    <button className='lookBtn' onClick={signupClicked}>Зарегистрироваться</button>
                </div>
                }
            </div>
        </div>
    )
}

export default HomePage