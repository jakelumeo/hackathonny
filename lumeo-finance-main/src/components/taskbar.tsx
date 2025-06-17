// import { useState } from 'react'
import lumeoLogo from '../assets/logos/Lumeo Finance Logo.png'
import { Link } from 'react-router-dom';

function Taskbar() {

    return (
    <>
        <nav className="taskbar">
            <div className="taskbar-container">
                {/* Navigation Links */}
                <div className="logo-container">
                    <Link to="/">
                        <img src={lumeoLogo} alt="Lumeo Logo" className="lumeo-logo" />
                    </Link>
                </div>

                <nav className="nav-link-1">
                    <Link to="/social-finance">Social Finance</Link>
                    <Link to="/meet-lumeo">Meet Lumeo</Link>
                    <Link to="/resources">Resources</Link>
                </nav>

                <nav className="nav-link-2">
                    <Link to="/join-now">Join Now</Link>
                    <p> | </p>
                    <Link to="/about">About Us</Link>
                </nav>
            </div>
        </nav>
    </>
    )

}

export default Taskbar;