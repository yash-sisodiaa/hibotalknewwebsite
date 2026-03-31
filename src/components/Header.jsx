import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';


const Header = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const user = JSON.parse(localStorage.getItem("user"));
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);



    useEffect(() => {
        const checkUserStatus = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                await api.get("/check-status", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });



            } catch (error) {
                // user blocked (401) or forbidden (403)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log("User inactive, blocked or unauthorized");

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    alert(error.response.data?.message || "Session expired please log in again");

                    window.location.href = "/";
                } else {
                    // For other errors (network, timeout, 500) we don't force logout
                    console.error("Check status error (not unauthorized):", error);
                }
            }
        };

        checkUserStatus();
    }, []);

    useEffect(() => {
        if (!isNavCollapsed) {
            document.body.classList.add('MenuOpen');
        } else {
            document.body.classList.remove('MenuOpen');
        }
        return () => document.body.classList.remove('MenuOpen');
    }, [isNavCollapsed]);



    return (
        <>
            <header>
                <div className="Header">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-md">
                            <Link className="navbar-brand" to="/" onClick={() => setIsNavCollapsed(true)}>
                                <img src="/images/Logo.png" />
                            </Link>

                            <button 
                                className={`navbar-toggler ${isNavCollapsed ? 'collapsed' : ''}`} 
                                type="button" 
                                onClick={handleNavCollapse}
                                aria-expanded={!isNavCollapsed}
                            >
                                <span className="icon"></span>
                                <span className="icon"></span>
                                <span className="icon"></span>
                            </button>

                            <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'MenuShow' : ''}`} id="navbar">

                                <Link className="MobileLogo" to="/" onClick={() => setIsNavCollapsed(true)}>
                                    <img src="/images/Logo.png" />
                                </Link>
                                <ul className="navbar-nav">
                                    <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
                                        <Link className="nav-link" to="/" onClick={() => setIsNavCollapsed(true)}>Home</Link>
                                    </li>
                                    <li className={`nav-item ${isActive("/about") ? "active" : ""}`}>
                                        <Link className="nav-link" to="/about" onClick={() => setIsNavCollapsed(true)}>About us</Link>
                                    </li>
                                    <li className={`nav-item ${isActive("/mentors") ? "active" : ""}`}>
                                        <Link className="nav-link" to="/mentors" onClick={() => setIsNavCollapsed(true)}>Our Mentors</Link>
                                    </li>
                                    <li className={`nav-item ${isActive("/resource") ? "active" : ""}`}>
                                        <Link className="nav-link" to="/resource" onClick={() => setIsNavCollapsed(true)}>Resources</Link>
                                    </li>
                                    <li className={`nav-item ${isActive("/contact") ? "active" : ""}`}>
                                        <Link className="nav-link" to="/contact" onClick={() => setIsNavCollapsed(true)}>Contact us</Link>
                                    </li>
                                    {!user && (
                                        <>
                                            <li className="nav-item Register">
                                                <Link
                                                    className="nav-link"
                                                    to="#"
                                                    data-toggle="modal"
                                                    data-target="#RegisterModal"
                                                    onClick={() => setIsNavCollapsed(true)}
                                                >
                                                    Register now
                                                </Link>
                                            </li>

                                            <li className="nav-item Download">
                                                <Link
                                                    className="nav-link"
                                                    to="#"
                                                    data-toggle="modal"
                                                    data-target="#LoginModal"
                                                    onClick={() => setIsNavCollapsed(true)}
                                                >
                                                    Log in
                                                </Link>
                                            </li>
                                        </>
                                    )}

                                    {/* Agar user login hai */}
                                    {user && (
                                        <li className="nav-item Download">
                                            <Link
                                                className="nav-link"
                                                to={
                                                    user.user_type === "mentor"
                                                        ? "/my-dashboard-mentor"
                                                        : "/my-dashboard-mentee"
                                                }
                                                state={{ fromHome: location.pathname === "/" }}
                                                onClick={() => setIsNavCollapsed(true)}
                                            >
                                                My Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li className="nav-item Download">
                                        <Link className="nav-link" to="" onClick={() => setIsNavCollapsed(true)}>Download App</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

        </>
    )
}

export default Header
