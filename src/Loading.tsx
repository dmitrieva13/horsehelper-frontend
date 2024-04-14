import React from 'react'
import { Spinner } from 'react-bootstrap';

import './style/App.css'

function Loading () {
    return(
        <div className="loadingScreen">
            <Spinner animation="border" variant="dark" />
        </div>
        
    )
}

export default Loading