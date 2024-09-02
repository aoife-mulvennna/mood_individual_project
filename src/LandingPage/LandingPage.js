// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <div className=" flex flex-col justify-center items-center bg-gray-100 font-sans px-10 py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to QUB Student Pulse</h1>
            <div className="flex space-x-4">
                <Link to="/create-account" className="bg-red-500 text-white px-6 py-3 font-semibold hover:bg-red-600 transition text-xl">
                    Create an Account
                </Link>
                <Link to="/login" className="bg-red-500 text-white px-6 py-3 font-semibold hover:bg-red-600 transition text-xl">
                    Log In
                </Link>
            </div>
            </div>
        </div>
    );
}

export default LandingPage;
