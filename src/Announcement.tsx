import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, ListGroup } from 'react-bootstrap';
import Moment from 'moment';

import './style/App.css'
import './style/HomePage.css'

function Announcement(props: {date: any, title: string, body: string}) {
    const [showFull, showFullSet] = useState(false)

    let dateBeautify = () => {
        Moment.locale('ru');
        let m = Moment(props.date).format('DD MMM YYYY HH:mm')
        return m
    }

    return(
        <div className="Announcement">
            <div className="smallBody">
                <div className="dateBlock">{dateBeautify()}</div>
                <div className="titleBlock">{props.title}</div>
            </div>
        </div>
    )
}

export default Announcement