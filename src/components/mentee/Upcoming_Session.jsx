import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Upcoming_Session = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const openModal = (session) => {
  setSelectedSession(session);
  window.$('#SessionsModal').modal('show');
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

  return (
    <>
      <div className="HistoryArea">
        <div className="HistoryHead">
          <h3>Upcoming Sessions <Link to="/all-upcoming-sessions">View all</Link></h3>
        </div>

        <div className="HistoryBody">
          <div className="row">

            {sessions.length > 0 ? (
              sessions.slice(0,5).map((session) => (
                <div className="col-lg-3 col-md-6 col-sm-6" key={session.id}>
                  <div className="SessionsBox"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(session)}
                  >
                    {/* <p>{session.mentor?.fullname}</p> */}
                        
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
                        <a href="javascript:void(0)">
                          <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </a>
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

export default Upcoming_Session;
