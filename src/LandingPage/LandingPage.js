// src/LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <h1>Welcome to QUB Student Pulse</h1>
            <div className="button-container">
                <Link to="/create-account" className="btn">Create an Account</Link>
                <Link to="/login" className="btn">Log In</Link>
            </div>
        </div>
    );
}

export default LandingPage;
