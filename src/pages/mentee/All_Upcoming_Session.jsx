
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar'
import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";

const All_Upcoming_Session = () => {
     const navigate = useNavigate();
    
    const [activeMenu, setActiveMenu] = useState(null);
    const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const openModal = (session) => {
  setSelectedSession(session);
  window.$('#SessionsModal').modal('show');
};

const toggleMenu = (id, e) => {
  e.stopPropagation(); // box click trigger na ho
  setActiveMenu(activeMenu === id ? null : id);
};



  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const id = user?.id;

      const res = await api.get(`/session/upcoming/${id}?type=mentee`);

      setSessions(res.data.sessions);

    } catch (error) {
      console.error("Upcoming session error:", error);
    }
  };


  const handleStartSession = async (session) => {
    
  try {

    const res = await api.put(
      `/meeting/meetings?mentorId=${session.mentorId}&mentorJoined=true&sessionId=${session.id}&isNotification=true`
    );

    const meetingLink = res.data?.meeting?.meetingLink || res.data?.meetingLink;

    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
      alert("Meeting link not available");
    }

  } catch (error) {
    console.error("Start session error:", error);
    alert("Unable to start session");
  }
  };

  const cancelSession = async (sessionId) => {

    try {
      const res = await api.put(`/session/respond/${sessionId}`,{
          "status": "rejected"
      })

      
      alert(res.data.message || "Session cancelled successfully");

      fetchUpcomingSessions();
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel session");
    }
  }

  return (
    <>
      <Mentee_Navigation/>
      <Mentee_Sidebar/>

      <div className="WrapperArea">
  <div className="WrapperBox">
    <div className="TitleBox">
      <h3>All Upcoming Sessions</h3>
    </div>

    <div className="HistoryArea">
      <div className="HistoryBody">
        <div className="row">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div className="col-lg-3 col-md-6 col-sm-6" key={session.id}>
                <div
                  className="SessionsBox"
                  style={{ cursor: "pointer", position: "relative", overflow: "visible" }} 
                  onClick={() => openModal(session)}
                >
                  {/* Right Side Menu Icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "18px"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();    
                      e.preventDefault();
                      toggleMenu(session.id, e);
                    }}
                  >
                    <i className="fa fa-ellipsis-v"></i>
                  </div>

                  {/*  Dropdown Menu */}
                  {activeMenu === session.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "38px",               
                        right: "0px",              
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        zIndex: 100,               
                        width: "140px",
                        overflow: "visible"
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid blue",
                          color: "blue"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/resheduled-mentors", { state: { sessionId: session.id,mentorId: session.mentorId,localDate: session.localDate } });
                          setActiveMenu(null);
                          //console.log("Reschedule clicked");

                        }}
                      >
                        Reschedule
                      </div>

                      <div
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          color: "red"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();   
                          cancelSession(session.id);
                          setActiveMenu(null);
                          //console.log("Cancel clicked");
                        }}
                      >
                        Cancel Session
                      </div>
                    </div>
                  )}
                  <p>{session.mentor?.fullname}</p>
                  <ul>
                    
                    <li>
                      <img src="/images/calendar.png" alt="" />
                      {session.localDate}
                    </li>

                    <li>
                      <img src="/images/clock.png" alt="" />
                      {session.localTime}
                    </li>

                    <li>
                      <i className="fa fa-angle-right"></i>
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p>No upcoming sessions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


        <div className="ModalBox">
        <div className="modal fade" id="SessionsModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="LoginBox Sessions">
        <div className="LoginHead">
          <button type="button" className="Close" data-dismiss="modal">×</button>
          <h3>Upcoming sessions</h3>
        </div>

        {selectedSession && (
          <div className="LoginBody">
            <aside>
              <p>
                <strong>Mentor:</strong>
                <span>
                  {selectedSession.mentor?.fullname}
                </span>
              </p>

              <p>
                <strong>Date/Time :</strong>
                <span>
                  {selectedSession.localDate} | {selectedSession.localTime}
                </span>
              </p>

              <p>
                <strong>Format :</strong>
                <span>Video Call</span>
              </p>

              <p>
                <strong>Session Type :</strong>
                <span>
                  Leadership Coaching
                </span>
              </p>
            </aside>

            <article>
              <h4>Mentee’s Submitted Goals</h4>
              <p>{selectedSession.description}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.$('#SessionsModal').modal('hide');
                  handleStartSession(selectedSession);
                }}
              >
                Join Session
              </button>
              
              <button onClick={(e) => {
                e.stopPropagation();
                window.$('#SessionsModal').modal('hide');
                navigate(`/chat-with-mentor/${selectedSession.mentorId}`, {
                  state: {
                    mentorName: selectedSession.mentor?.fullname,
                  }
                });
              }}>Start Chat</button>
              
              <button
              onClick={(e) => {
                e.stopPropagation();
                window.$('#SessionsModal').modal('hide');
                navigate("/resheduled-mentors", {
                  state: {
                    sessionId: selectedSession.id,
                    mentorId: selectedSession.mentorId,
                    localDate: selectedSession.localDate,
                  },
                });
              }}
            >
              Reschedule
            </button>

              
            </article>
          </div>
        )}

      </div>
    </div>
  </div>
</div>

        </div>
    </>

    
  )
}

export default All_Upcoming_Session
