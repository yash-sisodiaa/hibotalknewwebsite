import React from 'react'
import Header from './Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'

const Contact = () => {
  return (
    <>
    <Header/>

    <section>
        <div  className="BreadcumArea">
            <h2>Contact Us </h2>
        </div>
    </section>

    <section>
        <div  className="ContactArea">
            <div  className="container-fluid">
                <div  className="ContactBox">
                    <div  className="">
                        <h3>Get in Touch</h3>
                        <p>Fill this form to get in touch with us regards any query</p>

                        <form>
                            <div  className="row">
                                <div  className="col-sm-6">
                                    <div  className="form-group">
                                        <input type="text"  className="form-control" placeholder="Your Name"/>
                                    </div>
                                </div>
                                <div  className="col-sm-6">
                                    <div  className="form-group">
                                        <input type="text"  className="form-control" placeholder="Subject"/>
                                    </div>
                                </div>
                                <div  className="col-sm-6">
                                    <div  className="form-group">
                                        <input type="text"  className="form-control" placeholder="Phone Number"/>
                                    </div>
                                </div>
                                <div  className="col-sm-6">
                                    <div  className="form-group">
                                        <input type="text"  className="form-control" placeholder="Email Address"/>
                                    </div>
                                </div>
                                <div  className="col-sm-12">
                                    <div  className="form-group">
                                        <textarea rows="5"  className="form-control" placeholder="Your message"></textarea>
                                    </div>
                                </div>
                                <div  className="col-sm-12">
                                    <div  className="text-center">
                                        <button>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <span  className="Icon Left"><img src=" /src/assets/images/Contact-1.png"/> </span>
                        <span  className="Icon Right"><img src=" /src/assets/images/Contact-2.png"/> </span>

                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer/>

     <AuthModals/>
    
    </>
  )
}

export default Contact
