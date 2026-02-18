import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'


const About = () => {

    

  return (
    <>

    <Header/>
    
    <section>
        <div  className="BreadcumArea">
            <h2>About us</h2>
        </div>
    </section>

    <section>
        <div  className="IndustryArea">
            <div  className="container-fluid">
                <div  className="IndustryBox">
                    <h2>We make every learner Industry Ready</h2>
                    <p>HiboTalk Mentoring was created to bridge a powerful yet often overlooked gap: the space between ambition and opportunity. Launched in 2026, the app connects young talents with experienced professionals, offering real-life insights, confidence, and courage. But it’s more than career guidance — it’s about igniting dreams, breaking silences, and opening doors that once felt closed. The app that makes mentorship accessible and human.</p>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div  className="ChooseArea">
            <div  className="container-fluid">
                <div  className="row">
                    <div  className="col-lg-4 col-sm-12">
                        <div  className="ChooseLeft">
                            <h3>Why Choose Us</h3>
                            <p>Mentorship without borders.  Guidance with soul.</p>
                            <p>HiboTalk Mentoring bridges the gap between experience and aspiration, empowering young talents to learn, grow, and lead with confidence. Through our app, we connect aspiring individuals with seasoned professionals, offering real-world guidance, personal development, and the push to dream bigger.</p>
                            <p>Mentorship knows no borders, and real empowerment begins when we stop speaking at each other and start connecting with one another.</p>
                        </div>
                    </div>
                    <div  className="col-lg-8 col-sm-12">
                        <div  className="ChooseRight">
                            <img src="/images/Choose.png"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section>
        <div  className="YourselfArea">
            <div  className="container-fluid">
                <h2>✨ Want to be part of something bigger than yourself?</h2>
                <p>HiboTalk Mentoring connects young talents with experienced mentors in HR, IT, entrepreneurship, <br/> marketing, and more. But beyond skills, it’s about confidence, perspective, and growth.</p>
            </div>
        </div>
    </section>

        <section>
        <div  className="GuidanceArea">
            <div  className="container-fluid">
                <div  className="GuidanceBox">
                    <div  className="row">
                        <div  className="col-sm-8">
                            <div  className="GuidanceLeft">
                                <h3>Learn from Experts. Grow with Guidance</h3>
                                <p>HiboTalk is a mentorship platform offering video learning and live one-to-one sessions with experienced mentors.</p>
                                <ul>
                                    <li>
                                        <a href="javascript:void(0)"><img src="/images/Download-1.png"/></a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)"><img src="/images/Download-2.png"/></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div  className="col-sm-4">
                            <div  className="GuidanceRight">
                                <img src="/images/Phone.png"/>
                            </div>
                        </div>
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

export default About;
