import React from 'react'

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
                                <img src="/images/Logo.png"/>
                            </figure>
                            <h6>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h6>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="Foots Company">
                            <h3>Company</h3>
                            <ul>
                                <li><a href="index.html">Home</a></li>
                                <li><a href="about.html">About us</a></li>
                                <li><a href="">Mentoring</a></li>
                                <li><a href="">Resources</a></li>
                                <li><a href="">Community</a></li>
                                <li><a href="contact.html">Contact us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="Foots">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="">FAQ’s</a></li>
                                <li><a href="terms.html">Terms of Services</a></li>
                                <li><a href="privacy.html">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="Foots Socail">
                            <h3>Contact Info</h3>
                            <p><img src="/images/Email.png"/> info@hibotalk.com</p>
                            <ul>
                                <li><a href=""><img src="/images/Socail-1.png"/> </a></li>
                                <li><a href=""><img src="/images/Socail-2.png"/> </a></li>
                                <li><a href=""><img src="/images/Socail-3.png"/> </a></li>
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
