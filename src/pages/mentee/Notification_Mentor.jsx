import React, { useEffect, useState } from "react";
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar'
import api from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";

const Notification_Mentor = () => {
    
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
    navigate(`/community-details/${item.referenceId}`);

  } 
  else if (item.type === "session_request") {
    navigate("/all-upcoming-sessions");

  } 
  else if (item.type === "reschedule" || item.type === "session_response") {
    navigate("/all-upcoming-sessions");

  } 
  else if (item.type === "session_reminder" || item.type === "session_started") {
    navigate("/all-upcoming-sessions");

  } 
  else if (item.type === "chat_message") {
    navigate(`/all-chats-mentee`);

  }

  };

  return (
    <>
    <Mentee_Navigation/>
    <Mentee_Sidebar/>

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
                    <li key={item.id}>
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
  )
}

export default Notification_Mentor
