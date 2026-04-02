import React, { useState } from 'react'
import Mentor_Navigation from '../components/mentors/Mentor_Navigation'
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar'
import api from '../api/axiosInstance'

const Help = () => {

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

  const name = JSON.parse(localStorage.getItem("user"))?.fullname || "User";
  const email = JSON.parse(localStorage.getItem("user"))?.email || "";

  const [formData, setFormData] = useState({
    fullName: name,
    email: email,
    subject: "",
    message: ""
  })

  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/contact/us", formData)
      alert(res.data.message || "Message sent successfully")
      setFormData({
        fullName: name,
        email: email,
        subject: "",
        message: ""
      })
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 4);

  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Help Center</h3>
          </div>

          <div className="HelpArea">
            <div className="HelpHead">
              <h3>Contact us</h3>
              <p>Have a question or need help? Send us a message and we'll get back to you as soon as possible</p>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group">
                      <textarea
                        rows="5"
                        className="form-control"
                        placeholder="Your message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="text-center">
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="HelpBody">
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                <h3>Quick Help Topics</h3>
                <div className="SearchBox mt-2 mt-sm-0" style={{ maxWidth: '300px' }}>
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <p>Account & Membership</p>
              <br />

              <div id="accordion">
                {displayedFaqs.map((item, index) => (
                  <div className="card" key={index}>
                    <div
                      className={`card-header ${activeIndex === index ? "" : "collapsed"}`}
                      onClick={() => toggleAccordion(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6>{item.q}</h6>
                    </div>
                    <div
                      className={`collapse ${activeIndex === index ? "show" : ""}`}
                    >
                      <div className="card-body">
                        <div className="FAQContent">
                          <p style={{ color: "#000" }}>{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length > 4 && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowAll(!showAll)}
                    style={{ border: '1px solid #00E6D2', color: '#00E6D2', background: 'transparent' }}
                  >
                    {showAll ? "View Less" : "View More"}
                  </button>
                </div>
              )}

              {filteredFaqs.length === 0 && (
                <p className="text-center mt-4">No matching topics found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Help
