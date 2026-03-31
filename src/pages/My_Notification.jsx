import React, { useEffect, useState } from "react";
import Mentor_Navigation from "../components/mentors/Mentor_Navigation";
import Mentor_Sidebar from "../components/mentors/Mentor_Sidebar";
import api from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";

const My_Notification = () => {
  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);


  const fetchNotifications = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));
      

      const res = await api.get(`/mentee/get-notification/${user.id}`);

      setNotifications(res.data.notifications);

    } catch (err) {
      console.error("Notification error", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

   useEffect(() => {
    localStorage.setItem("notification_last_seen", new Date().toISOString());
  }, []);

  const handleNotificationClick = (item) => {

  if (item.type === "community_comment" || item.type === "community_like") {
    navigate(`/community-mentor-details/${item.referenceId}`);

  } 
  else if (item.type === "session_request") {
    navigate("/my-dashboard-request");

  } 
  else if (item.type === "reschedule" || item.type === "session_response") {
    navigate("/all-upcoming-sessions-mentor");

  } 
  else if (item.type === "session_reminder" || item.type === "session_started") {
    navigate("/all-upcoming-sessions-mentor");

  } 
  else if (item.type === "chat_message") {
    navigate(`/all-chats-mentor`);

  }

  };

  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Notifications</h3>
          </div>

          <div className="MontorArea">
            <div className="Notification">
              <ol>

                {notifications.length === 0 ? (
                  <p>No Notifications Found</p>
                ) : (
                  notifications.map((item) => (
                    <li key={item.id} onClick={() => handleNotificationClick(item)} style={{ cursor: "pointer" }}>
                      <span className="Time">{item.createdAt.split("T")[0]}</span>

                      <h6>{item.title}</h6>

                      <p>{item.body}</p>
                    </li>
                  ))
                )}

              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default My_Notification;