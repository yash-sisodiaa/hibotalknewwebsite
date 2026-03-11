import React, { useEffect, useState } from "react";
import Mentee_Navigation from "../../components/mentee/Mentee_Navigation";
import Mentee_Sidebar from "../../components/mentee/Mentee_Sidebar";
import api from "../../api/axiosInstance";

const Session_History = () => {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("past");

  useEffect(() => {
    fetchSessions();
  }, [activeTab]);
   
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;
  //console.log("User ID:", id);
  //const user 
  const fetchSessions = async () => {

    try {

      let endpoint = "";

      if (activeTab === "past") {
        endpoint = `session/past-sessions?userId=${id}&userType=mentee`;
      }

      if (activeTab === "pending") {
        endpoint = `session/pending/${id}`;
        }

        if (activeTab === "cancelled") {
        endpoint = `session/rejected?menteeId=${id}`;
        }

     

      const response = await api.get(endpoint);
      const result = response.data;

      if (result.success) {
        setSessions(result.data || result.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Session History</h3>
          </div>

          <div className="HistoryArea">
            <div className="HistoryHead">
              <ul>
                <li>
                  <button
                    className={activeTab === "past" ? "active" : ""}
                    onClick={() => setActiveTab("past")}
                  >
                    Past Sessions
                  </button>
                </li>

                <li>
                  <button
                    className={activeTab === "pending" ? "active" : ""}
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending Requests
                  </button>
                </li>

                <li>
                  <button
                    className={activeTab === "cancelled" ? "active" : ""}
                    onClick={() => setActiveTab("cancelled")}
                  >
                    Cancelled Sessions
                  </button>
                </li>
              </ul>
            </div>

            <div className="HistoryBody">
              <div className="row">
                {sessions.length > 0 ? (
                  sessions.map((item) => (
                    <div
                      key={item.id}
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                    >
                      <div className="HistoryBox">
                        <article>
                          <span className="Icon">
                            <img
                              src={item.mentor?.profile_pic}
                              alt="mentor"
                            />
                          </span>

                          

                          <h4>{item.mentor?.fullname}</h4>
                          <p>{item.localTimeZone}</p>
                        </article>

                        <aside>
                          <p>
                            {item.localDate} | {item.localTime}
                          </p>
                        </aside>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "20px" }}>
                    No sessions found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Session_History;
