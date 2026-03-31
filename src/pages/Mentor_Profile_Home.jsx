import React, { useEffect, useState, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../api/axiosInstance'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import AuthModals from '../components/AuthModals';
import $ from "jquery";

const Mentor_Profile_Home = () => {

  const { id } = useParams();
  const Navigate = useNavigate()
  const location = useLocation();

  const avgRating = location.state?.avgRating;

  const [mentor, setMentor] = useState({})
  const [resources, setResources] = useState([])
  const [reviews, setReviews] = useState([])
  const [communities, setCommunities] = useState([])


  const isLoggedIn = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('user') || '{}');
  const isMentor = userRole.user_type === 'mentor';

  const handleAuthAction = (action) => {
    if (!isLoggedIn) {
      $('#LoginModal').modal('show');
    } else {
      if (action === 'request') {
        Navigate("/request-session", { state: { mentorId: id } })
      } else {
        // for reviews and communities, maybe navigate to other pages or do nothing
        console.log('View All for', action);
      }
    }
  };

  const getMentorData = useCallback(async () => {
    try {

      const res = await api.get((`/mentee/mentor-data/${id}`))

      setMentor(res.data.data.mentor)
      setResources(res.data.data.resources)
      setReviews(res.data.data.reviews)
      setCommunities(res.data.data.communities)

    } catch (err) {
      console.log(err)
    }
  }, [id]);

  useEffect(() => {
    getMentorData()
  }, [getMentorData])

  return (
    <>
      <Header />

      <section>
        <div className="BreadcumArea">
          <h2>Profile</h2>
        </div>
      </section>

      <section>
        <div className="MentorsArea">
          <div className="container-fluid">
            <div className="MontorArea">

              {/* Mentor Info */}

              <div className="MontorName">
                <figure>
                  <img src={mentor.profile_pic || "/images/Mentor.png"} alt="" />
                </figure>

                <figcaption>
                  <h3>
                    {mentor.fullname || "mentor"}

                    <span className="Rate">
                      ⭐ {Number(avgRating).toFixed(1)}{" "}
                    </span>


                  </h3>

                  <h6>{mentor.specialization}</h6>

                  <p>{mentor.bio}</p>
                </figcaption>

                <aside>
                  {!isMentor && <a href="javascript:void(0)" onClick={() => handleAuthAction('request')}>Request session</a>}
                </aside>
              </div>


              {/* Resources */}

              <div className="HistoryArea">

                <div className="HistoryHead">
                  <h3>Resources <Link to="/resource" state={{ mentorId: id }}>View All</Link></h3>
                </div>

                <div className="HistoryBody">
                  <div className="row">

                    {resources.slice(0, 6).map((item) => (
                      <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={item.id}>

                        <Link to={`/program-resource/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="ResourcesBox">

                            <span className="Chip">
                              {{
                                pdf: "PDF",
                                ppt: "PPT",
                                doc: "DOC",
                                video: "Video"
                              }[item.resourceType] || item.resourceType}
                            </span>



                            <figure className={!(item.resourceType === 'video' || item.thumbnailUrl) ? "NoThumbnail" : ""}>
                              {/* FILE ICONS */}
                              {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                                <div className="OnlyIcon">
                                  {item.resourceType === 'pdf' && <i className="fa fa-file-pdf-o PdfIcon"></i>}
                                  {item.resourceType === 'ppt' && <i className="fa fa-file-powerpoint-o PptIcon"></i>}
                                  {item.resourceType === 'doc' && <i className="fa fa-file-word-o DocIcon"></i>}
                                </div>
                              )}
                              {/* VIDEO PLAY ICON */}
                              {item.resourceType === 'video' && (
                                <span className="Play"><i className="fa fa-play"></i></span>
                              )}
                              {/* THUMBNAIL */}
                              {(item.resourceType === 'video' || item.thumbnailUrl) && (
                                <img
                                  src={item.thumbnailUrl || '/images/Program-1.png'}
                                  alt="resource"
                                />
                              )}
                            </figure>

                            <figcaption>
                              <p>{item.heading}</p>
                            </figcaption>

                          </div>
                        </Link>

                      </div>
                    ))}

                  </div>
                </div>

              </div>


              {/* Reviews */}

              <div className="TestimonialArea Student">

                <div className="TestimonialHead">
                  <h4>Student Reviews</h4>
                </div>

                <div className="row">

                  {reviews.slice(0, 6).map((item) => (
                    <div className="col-lg-4 col-md-6 col-sm-6" key={item.id}>

                      <div className="TestimonialBox">

                        <article>

                          {[...Array(item.rating)].map((_, i) => (
                            <i key={i} className="fa fa-star" aria-hidden="true"></i>
                          ))}

                          <p>
                            "{item.comment}"
                          </p>

                        </article>

                        <aside>

                          <span className="Icon">
                            <img
                              src={item.mentee?.profile_pic || "/images/Profile.png"}
                              alt=""
                            />
                          </span>

                          <h3>{item.mentee?.fullname}</h3>

                          <p>Mentee</p>

                        </aside>

                      </div>

                    </div>
                  ))}

                </div>

              </div>


              {/* Communities */}

              <div className="TestimonialArea Student">

                <div className="TestimonialHead">
                  <h4>Community Highlights</h4>
                </div>

                <div className="row">

                  {communities.slice(0, 8).map((item) => (
                    <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>

                      <div
                        onClick={() => {
                          if (!isLoggedIn) {
                            $('#LoginModal').modal('show');
                          } else {
                            Navigate(
                              isMentor
                                ? `/community-mentor-details/${item.id}`
                                : `/community-details/${item.id}`
                            );
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="CommunityBox">

                          <h3>
                            <span className="Icon">
                              <img src={mentor.profile_pic} alt="" />
                            </span>

                            <span className="Name">
                              {mentor.fullname}
                            </span>

                            <span className="Time">
                              {item.createdAt.split("T")[0]}
                            </span>
                          </h3>

                          <figcaption>
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                            <h6>#Community</h6>
                          </figcaption>

                        </div>
                      </div>

                    </div>
                  ))}

                </div>

              </div>


            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModals />
    </>
  )
}

export default Mentor_Profile_Home