// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-10 py-20">
            <div className=" flex flex-col justify-center items-center text-center bg-gray-100 font-sans px-10 py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8 ">Welcome to QUB Student Pulse</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Link to="/login" className="bg-red-500 text-white w-48 py-3 font-bold hover:bg-red-600 transition text-2xl text-center">
                    Log In
                </Link>
                <Link to="/create-account" className="bg-gray-400 text-white w-48 py-3 font-semibold hover:bg-red-600 transition text-xl text-center">
                    Create an Account
                </Link>
            </div>
            </div>
        </div>
    );
}

export default LandingPage;
