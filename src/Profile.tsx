import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Image, Modal } from 'react-bootstrap';

import './style/App.css'
import './style/Profile.css'

function Profile() {
    const { userId } = useParams();

    return(
        <div className="profileScreen"></div>
    )
}

export default Profile