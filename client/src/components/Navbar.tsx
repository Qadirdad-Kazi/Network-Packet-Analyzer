import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    NetAnalyzer
                </NavLink>
                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                        Dashboard
                    </NavLink>
                    <NavLink to="/capture" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Packet Capture
                    </NavLink>
                    <NavLink to="/analysis" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Analysis
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
