import React, { useEffect, useState } from "react";
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';
import api from "../api/axiosInstance";

const Session_Mentor_History = () => {

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
        endpoint = `session/past-sessions?userId=${id}&userType=mentor`;
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
       <Mentor_Navigation />

       <Mentor_Sidebar/>

       <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Past Sessions</h3>
          </div>

          <div className="HistoryArea">
            

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
                              src={item.mentee?.profile_pic}
                              alt="mentee"
                            />
                          </span>

                          

                          <h4>{item.mentee?.fullname}</h4>
                          <p>{item.description?.length > 40
                            ? item.description.slice(0, 40) + "..."
                            : item.description}
                            </p>
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
  )
}

export default Session_Mentor_History
