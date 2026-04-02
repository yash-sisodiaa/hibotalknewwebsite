import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';

const CoursesandReview = () => {
  const Navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const [specializations, setSpecializations] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    fetchMentorDetails();
    fetchReviews();
  }, [userId]);

  //  useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const res = await api.get(`/getUser/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });

  //       console.log('USER DATA', res.data.data);

  //       const specs = res.data.data.specializations || [];
  //       setSpecializations(specs);

  //     } catch (err) {
  //       console.error(
  //         'USER FETCH ERROR 👉',
  //         err.response?.data || err.message
  //       );
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const fetchMentorDetails = async () => {
    try {
      const res = await api.get(`/mentee/mentor-resources/${userId}`);

      if (res.data.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
    } finally {
      setLoading(false);
    }
  };


  const mentor = data?.mentor || {};
  const rating = data?.overallAverageRating ?? 0;
  const resources = data?.resources || [];


  const fetchReviews = async () => {
    try {
      const res = await api.get(`/review/mentor/${userId}`);

      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? "text-warning" : "text-secondary"}`}
      />
    ));
  };


  return (
    <>
      <Mentor_Navigation />

      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">


          <div className="MontorArea">

            <div className="HistoryArea">
              <div className="HistoryHead">
                <h3>Courses</h3>

              </div>
            
                  {
                    resources.length > 0 ? (
                      <div className="HistoryBody">
                        <div className="row">
                          {resources.map((item) => (
                            <div className="col-sm-2" key={item.id}>
                              <div className="ResourcesBox"

                                onClick={() => Navigate(`/resource-mentor-details/${item.id}`)}
                                style={{ cursor: "pointer" }}
                              >

                                <figure>
                                  {/* VIDEO */}
                                  {item.resourceType === 'video' && (
                                    <>
                                      <span className="Play">
                                        <i className="fa fa-play" aria-hidden="true"></i>
                                      </span>

                                      <img
                                        src={item.thumbnailUrl || '/images/Program-1.png'}
                                        alt={item.heading}
                                      />
                                    </>
                                  )}

                                  {/* PDF / PPT / DOC – CUSTOM ICON */}
                                  {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                                    <div className="OnlyIcon">
                                      {item.resourceType === 'pdf' && (
                                        <i className="fa fa-file-pdf-o PdfIcon" aria-hidden="true"></i>
                                      )}

                                      {item.resourceType === 'ppt' && (
                                        <i className="fa fa-file-powerpoint-o PptIcon" aria-hidden="true"></i>
                                      )}

                                      {item.resourceType === 'doc' && (
                                        <i className="fa fa-file-word-o DocIcon" aria-hidden="true"></i>
                                      )}
                                    </div>
                                  )}

                                </figure>



                                <figcaption>
                                  <p>{item.heading}</p>
                                </figcaption>

                              </div>
                            </div>
                          ))}


                        </div>
                      </div>

                    ) : (
                      <p style={{ padding: '0 15px' }}>No resources found</p>
                    )
                  }

               
            </div>

            <div className="TestimonialArea Student">
              <div className="TestimonialHead">
                <h4>Student Reviews</h4>
              </div>

              <div className="row">
                {reviews.length > 0 ? (
                  reviews.map((item) => (
                    <div
                      className="col-lg-4 col-md-6 col-sm-6"
                      key={item.id}
                    >
                      <div className="TestimonialBox">
                        <article>
                          {renderStars(item.rating)}

                          <p>"{item.comment}"</p>
                        </article>

                        <aside>
                          <span className="Icon">
                            <img
                              src={
                                item.mentee?.profile_pic ||
                                "/images/Profile.png"
                              }
                              alt="profile"
                            />
                          </span>
                          <h3>{item.mentee?.fullname}</h3>

                        </aside>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "0 15px" }}>
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}


export default CoursesandReview
