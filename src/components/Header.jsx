import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Header = () => {
   const location = useLocation();

   const isActive = (path) => location.pathname === path;
    

    

  return (
    <>
    <header>
    <div className="Header">
            <div className="container-fluid">
                <nav className="navbar navbar-expand-md">
                    <Link className="navbar-brand" to="/">
                        <img src="/images/Logo.png"/>
                    </Link>

                    <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false">
                        <span className="icon"></span>
                        <span className="icon"></span>
                        <span className="icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbar">
                        <Link className="MobileLogo" to="/">
                            <img src="/images/Logo.png"/>
                        </Link>
                        <ul className="navbar-nav">
                            <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className={`nav-item ${isActive("/about") ? "active" : ""}`}>
                                <Link className="nav-link" to="/about">About us</Link>
                            </li>
                            <li className={`nav-item ${isActive("/mentors") ? "active" : ""}`}>
                                <Link className="nav-link" to="/mentors">Our Mentors</Link>
                            </li>
                            <li className={`nav-item ${isActive("/resource") ? "active" : ""}`}>
                                <Link className="nav-link" to="/resource">Resources</Link>
                            </li>
                            <li className={`nav-item ${isActive("/contact") ? "active" : ""}`}>
                                <Link className="nav-link" to="/contact">Contact us</Link>
                            </li>
                            <li className="nav-item Register">
                                <Link className="nav-link" to="javascript:void(0);" data-toggle="modal"
                                    data-target="#RegisterModal">Register now</Link>
                            </li>
                            <li className="nav-item Download">
                                <Link className="nav-link" to="javascript:void(0);" data-toggle="modal"
                                    data-target="#LoginModal">Log in</Link>
                            </li>
                            <li className="nav-item Download">
                                <Link className="nav-link" to="">Download App</Link>
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
