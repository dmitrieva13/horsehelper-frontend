import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'react-bootstrap';

import './style/App.css'
import './style/HomePage.css'
import Loading from './Loading';
import Menu from './Menu';

function HomePage() {
    const mainImage = "https://www.thesprucepets.com/thmb/WCHi1vABy_vfH6kDo7snIluUzyo=/2109x0/filters:no_upscale():strip_icc()/GettyImages-909948608-5c69cd9446e0fb0001560d1a.jpg"

    const trainersText = "Познакомьтесь с нашей командой профессиональных тренеров"
    const horsesText = "Посмотрите на лошадей нашей школы"
    const registrationText = "Зарегистрируйтесь, чтобы прямо сейчас записаться на занятие онлайн!"


    return(
        <div className="homePage">
            <Menu isProfile={false} />

            <div className="mainInfoDisplay">
                <Image src={mainImage} className='mainImg' />
                <div className="trainersInfoDisplay">
                    <div className="homepageText">{trainersText}</div>
                    <button className='lookBtn'>Тренера</button>
                </div>
                <div className="horsesInfoDisplay">
                    <div className="homepageText horsesHomepage">{horsesText}</div>
                    <button className='lookBtn'>Лошади</button>
                </div>
                <div className="registrationInfoDisplay">
                    <div className="homepageText">{registrationText}</div>
                    <button className='lookBtn'>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage