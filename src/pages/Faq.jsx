import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'

const Faq = () => {

    const faqs = [
        {
            q: "How do I book a session?",
            a: "You can book a session with any mentor by searching for them or selecting from the All Mentors."
        },
        {
            q: "How do I give a rating to a mentor?",
            a: "After successfully completing a session, you can give a rating to the mentor."
        },
        {
            q: "Why can’t I post in the community?",
            a: "Only mentors are allowed to post in the community."
        },
        {
            q: "Why can’t I start a session?",
            a: "You can start your session 15 minutes before the scheduled session time."
        },
        {
            q: "Where can I see my session history?",
            a: "You can view your past, pending, and cancelled sessions in the Session section."
        },
        {
            q: "Where can I find my saved resources?",
            a: "All your saved resources are available in the Saved Resources section in your profile."
        },
        {
            q: "How do I switch between mentor and mentee?",
            a: "You can switch between mentor and mentee from the Switch option in the sidebar menu."
        },
        {
            q: "How can I change the language of the app?",
            a: "You can change the app’s language from the sidebar menu or landing page."
        },
        {
            q: "How can I reschedule my session?",
            a: "You can reschedule your session from the Upcoming Sessions section."
        },
        {
            q: "How can I cancel my session?",
            a: "You can cancel your session from the Upcoming Sessions section."
        },
        {
            q: "How can I add a call link?",
            a: "Mentors can add their call link from the Create Link option in their profile."
        }
    ];

    return (
        <>
            <Header />

            <section>
                <div className="FAQArea faq-black" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #555555 100%);" }}>
                    <div className="container-fluid">

                        <h3>Frequently Asked Questions</h3>

                        <div id="accordion">
                            {faqs.map((item, index) => (
                                <div className="card" key={index} style={{ color: "#000" }}>

                                    <div
                                        className="card-header collapsed"
                                        data-toggle="collapse"
                                        href={`#collapse${index}`}

                                    >
                                        <h6 style={{ margin: 0 }}>
                                            {item.q}
                                        </h6>
                                    </div>

                                    <div
                                        id={`collapse${index}`}
                                        className="collapse"
                                        data-parent="#accordion"
                                    >
                                        <div className="card-body" >
                                            <div className="FAQContent">
                                                <p style={{ margin: 0 }}>
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            <AuthModals />
            <Footer />
        </>
    )
}

export default Faq