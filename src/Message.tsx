import React from 'react'
import { useState, useEffect } from 'react'
import { CloseButton } from 'react-bootstrap'

import './style/App.css'


function Message(props: {message: string}) {
    const [isHidden, isHiddenSet] = useState(false)
    // const [fetched, fetchedSet] = useState(0)

    // useEffect(() => {
    //     if (!fetched) {
    //         isHiddenSet(!props.show)
    //         fetchedSet(1)
    //     }
    // })

    return(
        <div className="messageScreen" hidden={isHidden}>
            <div className="messageContent">
            <CloseButton onClick={() => isHiddenSet(true)}/>
            {props.message}
            </div>
        </div>
    )
}

export default Message