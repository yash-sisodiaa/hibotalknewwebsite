import React from 'react'
import Header from './Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'
import api from '../api/axiosInstance'
import { useState } from 'react'

const Contact = () => {

    //  const name = JSON.parse(localStorage.getItem("user"))?.fullname || "User";
    // const email = JSON.parse(localStorage.getItem("user"))?.email || "";

    const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  })

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
        fullName: "",
        email: "",
        subject: "",
        message: ""
      })

    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }
  }

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

                        <span  className="Icon Left"><img src="/images/Contact-1.png"/> </span>
                        <span  className="Icon Right"><img src="/images/Contact-2.png"/> </span>

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
