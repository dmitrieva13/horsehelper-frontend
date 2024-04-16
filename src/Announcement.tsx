import React from 'react'
import { useState, useEffect } from 'react'
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
            <div className={showFull ? "smallBody fullShowed" : "smallBody"}
            onClick={() => showFullSet(!showFull)}>
                <div className="AnnouncementDateBlock">{dateBeautify()}</div>
                <div className="AnnouncementTitleBlock">{props.title}</div>
            </div>
            <div className={!showFull ? "fullBody fullHidden" : "fullBody"}>{props.body}</div>
        </div>
    )
}

export default Announcement