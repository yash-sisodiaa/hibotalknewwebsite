import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container-fluid">
                    <div className="Footer">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="Foots">
                                    <figure>
                                        <img src="/images/Logo.png" />
                                    </figure>

                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="Foots Company">
                                    <h3>Company</h3>
                                    <ul>
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="/about">About us</Link></li>
                                        <li><Link to="/mentors">Mentoring</Link></li>
                                        <li><Link to="/resource">Resources</Link></li>

                                        <li><Link to="/contact">Contact us</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <div className="Foots">
                                    <h3>Support</h3>
                                    <ul>
                                        <li><Link to="/faq">FAQ’s</Link></li>
                                        <li><Link to="/terms-and-conditions">Terms of Services</Link></li>
                                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <div className="Foots Socail">
                                    <h3>Contact Info</h3>
                                    <p><img src="/images/Email.png" /> info@hibotalk.com</p>
                                    <ul>
                                        <li><Link to=""><img src="/images/Socail-1.png" /> </Link></li>
                                        <li><Link to=""><img src="/images/Socail-2.png" /> </Link></li>
                                        <li><Link to=""><img src="/images/Socail-3.png" /> </Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="Copyright">
                        <p>© 2025 HIBOTALK Pvt Ltd</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
