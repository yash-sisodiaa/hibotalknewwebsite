import React, { useEffect, useState } from "react";
import Mentor_Navigation from '../components/mentors/Mentor_Navigation'
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar'
import api from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const My_Dashboard_Request = () => {
  const navigate = useNavigate();
  const mentorId = JSON.parse(localStorage.getItem("user"))?.id;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);

  /* ================= FETCH SESSIONS ================= */
  const fetchSessions = async () => {
    try {
      const res = await api.get(
        `/session/mentor-sessions/${mentorId}`
      );

      setSessions(res.data.sessions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ================= ACCEPT SESSION ================= */
  const handleAccept = async (sessionId) => {
    try {
      await api.put(`/session/respond/${sessionId}`, {
        status: "accepted",
      });
      alert("Session accepted successfully.");
      fetchSessions();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= CANCEL SESSION ================= */
  const handleCancel = async (sessionId) => {
    try {
      await api.put(`/session/respond/${sessionId}`, {
        status: "rejected",
      });
      alert("Session cancelled successfully.");
      fetchSessions();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= VIEW PROFILE ================= */
  const handleViewProfile = async (menteeId) => {
    try {
      const res = await api.get(
        `/session/profile/${menteeId}`
      );
      setSelectedProfile(res.data.mentee);

      const resourcesRes = await api.get(`/completed-courses/${menteeId}`);
      setCompletedCourses(resourcesRes.data.data);

      setShowProfileModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Booking Request</h3>
          </div>

          <div className="DashboardArea">
            <div className="row">
              {loading ? (
                <div className="col-sm-12">
                  <p>Loading...</p>
                </div>

              ) : sessions.length === 0 ? (
                <div className="col-sm-12">
                  <p>No pending requests</p>
                </div>

              ) : (
                sessions.filter((s) => s.status === "pending").map((session) => (
                  <div
                    key={session.id}
                    className="col-lg-4 col-md-6 col-sm-6"
                  >
                    <div className="RequestBox">
                      <aside>
                        <span className="Icon">
                          <img
                            src={session.mentee.profile_pic || '/images/person-icon-png-12.jpg'}
                            alt=""
                          />
                        </span>

                        <h4>
                          {session.mentee.fullname}
                        </h4>

                        <p>
                          {session.localDate} |{" "}
                          {session.localTime}
                        </p>

                        <div className={`dropdown ${openId === session.id ? "show" : ""}`}>

                          <a
                            href="/"
                            id="navbardrop"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenId(openId === session.id ? null : session.id);
                            }}
                          >
                            <img src="images/Dots.png" alt="" />
                          </a>

                          <div
                            className={`dropdown-menu ${openId === session.id ? "show" : ""
                              }`}
                          >
                            <ol>
                              <li>
                                <a
                                  href="/"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewProfile(session.mentee.id);
                                    setOpenId(null);
                                  }}
                                >
                                  View Profile
                                </a>
                              </li>

                              <li>
                                <a
                                  href="/"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCancel(session.id);
                                    setOpenId(null);
                                  }}
                                >
                                  Cancel Session
                                </a>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </aside>

                      <article>
                        <p>
                          {session.description}
                        </p>

                        <ul>
                          <li>
                            <button
                              className="Chat"
                              onClick={() =>
                                navigate(
                                  `/chat-with-mentee/${session.mentee.id}`, {
                                  state: {
                                    mentorName: session.mentee?.fullname,
                                  }
                                }
                                )
                              }
                            >
                              Chat
                            </button>
                          </li>

                          <li>
                            <button
                              className="Accept"
                              onClick={() =>
                                handleAccept(
                                  session.id
                                )
                              }
                            >
                              Accept
                            </button>
                          </li>
                        </ul>
                      </article>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfileModal && selectedProfile && (
        <div className="ModalBox">
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="LoginBox Profile">

                  <div className="LoginHead">
                    <button
                      type="button"
                      className="Close"
                      onClick={() => setShowProfileModal(false)}
                    >
                      ×
                    </button>
                  </div>

                  {/* ===== Profile Info ===== */}
                  <div className="ProfileInfo">
                    <span className="Icon">
                      <img
                        src={selectedProfile.profile_pic || '/images/person-icon-png-12.jpg'}
                        alt=""
                      />
                    </span>

                    <h4>{selectedProfile.fullname}</h4>


                    <h6>{selectedProfile.location}</h6>

                    <p>{selectedProfile.bio}</p>

                    {/* <button>Start Chat</button> */}
                  </div>

                  {/*Finished Courses */}
                  <div className="ProfileCourses">
                    <h4>Finished Courses</h4>

                    <div className="row">
                      {completedCourses.length > 0 ? (
                        completedCourses.map((item) => {
                          const resource = item.resource;

                          return (
                            <div className="col-sm-3" key={item.id}>
                              <div
                                className="ResourcesBox"
                                onClick={() =>
                                  navigate(`/resource-mentor-details/${resource.id}`)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <figure>

                                  {/* VIDEO */}
                                  {resource.resourceType === "video" && (
                                    <>
                                      <span className="Play">
                                        <i className="fa fa-play" />
                                      </span>

                                      <img
                                        src={
                                          resource.thumbnailUrl ||
                                          "images/Mentors.png"
                                        }
                                        alt={resource.heading}
                                      />
                                    </>
                                  )}

                                  {/* PDF */}
                                  {resource.resourceType === "pdf" && (
                                    <div className="OnlyIcon">
                                      <i className="fa fa-file-pdf-o PdfIcon" />
                                    </div>
                                  )}

                                  {/* PPT */}
                                  {resource.resourceType === "ppt" && (
                                    <div className="OnlyIcon">
                                      <i className="fa fa-file-powerpoint-o PptIcon" />
                                    </div>
                                  )}

                                </figure>

                                <figcaption>
                                  <p>{resource.heading}</p>
                                </figcaption>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-12">
                          <p>No completed courses</p>
                        </div>
                      )}
                    </div>

                    {/* <aside>
                <button className="Chat"></button>
                <button className="Accept"></button>
            </aside> */}
                  </div>


                </div>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowProfileModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default My_Dashboard_Request;

