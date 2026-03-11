import React from 'react'
import Mentor_Navigation from '../components/mentors/Mentor_Navigation'
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar'
import api from '../api/axiosInstance'
import { useState } from 'react'

const Help = () => {

    const name = JSON.parse(localStorage.getItem("user"))?.fullname || "User";
    const email = JSON.parse(localStorage.getItem("user"))?.email || "";

    const [formData, setFormData] = useState({
    fullName: name,
    email: email,
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
    <Mentor_Navigation/>
    <Mentor_Sidebar/>

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
                    <h3>Quick Help Topics</h3>
                    <div id="accordion">
                        <div className="card">
                            <div className="card-header collapsed" data-toggle="collapse" href="#collapseOne">
                                <h6>What is HiboTalk?</h6>
                            </div>
                            <div id="collapseOne" className="collapse" data-parent="#accordion">
                                <div className="card-body">
                                    <div className="FAQContent">
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                                            praesentium voluptatum deleniti atque corrupti quos dolores et quas
                                            molestias
                                            excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                                            qui
                                            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                                            quidem
                                            rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                                            nobis
                                            est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
                                            facere
                                            possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
                                            autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                                            eveniet
                                            ut et voluptates repudiandae sint et molestiae non recusandae. </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header collapsed" data-toggle="collapse" href="#collapseTwo">
                                <h6>Can I teach on HiboTalk?</h6>
                            </div>
                            <div id="collapseTwo" className="collapse" data-parent="#accordion">
                                <div className="card-body">
                                    <div className="FAQContent">
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                                            praesentium voluptatum deleniti atque corrupti quos dolores et quas
                                            molestias
                                            excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                                            qui
                                            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                                            quidem
                                            rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                                            nobis
                                            est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
                                            facere
                                            possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
                                            autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                                            eveniet
                                            ut et voluptates repudiandae sint et molestiae non recusandae. </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header collapsed" data-toggle="collapse" href="#collapseThree">
                                <h6>Crambled it to make a type specimen book?</h6>
                            </div>
                            <div id="collapseThree" className="collapse" data-parent="#accordion">
                                <div className="card-body">
                                    <div className="FAQContent">
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                                            praesentium voluptatum deleniti atque corrupti quos dolores et quas
                                            molestias
                                            excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                                            qui
                                            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                                            quidem
                                            rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                                            nobis
                                            est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
                                            facere
                                            possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
                                            autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                                            eveniet
                                            ut et voluptates repudiandae sint et molestiae non recusandae. </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header collapsed" data-toggle="collapse" href="#collapseFour">
                                <h6>It was popularised in the 1960s with the release of?</h6>
                            </div>
                            <div id="collapseFour" className="collapse" data-parent="#accordion">
                                <div className="card-body">
                                    <div className="FAQContent">
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                                            praesentium voluptatum deleniti atque corrupti quos dolores et quas
                                            molestias
                                            excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                                            qui
                                            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                                            quidem
                                            rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                                            nobis
                                            est eligendi optio cumque nihil impedit quo minus id quod maxime placeat
                                            facere
                                            possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus
                                            autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                                            eveniet
                                            ut et voluptates repudiandae sint et molestiae non recusandae. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
    </>
  )
}

export default Help
