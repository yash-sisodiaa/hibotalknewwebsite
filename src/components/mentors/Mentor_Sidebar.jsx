import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from '../../api/axiosInstance';

const Mentor_Sidebar = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [meetingLink, setMeetingLink] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/my-dashboard-mentor", icon: "Nav-1.png", label: "Dashboard" },
    { path: "/my-community", icon: "Nav-2.png", label: "My Community" },
    { path: "/course-review", icon: "Nav-3.png", label: "Courses and Reviews" },
    { path: "/manage-resources", icon: "Nav-4.png", label: "Manage Resources" },
    { path: "/session-history-mentor", icon: "Nav-5.png", label: "Session History" },
    { icon: "Nav-6.png", label: "Create Call Link", modal: true }
  ];

  const handleSubmitMeeting = async () => {

    if (!meetingLink) {
      alert("Please enter meeting link");
      return;
    }

    try {

      const res = await api.post("/meeting/meetings", {
        mentorId: user.id,
        meetingLink: meetingLink
      });

      alert(res.data.message);

      setMeetingLink("");

      window.$("#CallLink").modal("hide");

    } catch (error) {
      console.error(error);
      alert("Failed to create meeting link");
    }

  };

  const getMeetingLink = async () => {
    try {

      const res = await api.put(`/meeting/meetings?mentorId=${user.id}`);

      if (res.data.meeting) {
        setMeetingLink(res.data.meeting.meetingLink);
      }

    } catch (error) {
      console.error("Error fetching meeting link", error);
    }
  };

  return (
    <>
      <div className="SidenavArea">
        <div className="SidenavHead">
          <img src="/images/Logo.png" alt="Logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")} />
          <button onClick={() => {
            const sidebar = document.querySelector('.SidenavArea');
            if (sidebar) sidebar.classList.remove('show');
          }}> × </button>
        </div>

        <div className="SidenavBody">
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={location.pathname === item.path ? "active" : ""}
              >
                <a

                  style={{ cursor: "pointer", }}
                  onClick={() => {
                    if (item.modal) {
                      getMeetingLink();
                      window.$("#CallLink").modal("show");
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <span className="Icon">
                    <img
                      src={`/images/${item.icon}`}
                      alt=""
                    />
                  </span>
                  <span className="Text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="modal fade" id="CallLink">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="LoginBox Resources">
              <div className="LoginHead">
                <button type="button" className="Close" data-dismiss="modal">×</button>
                <h3>Call Link</h3>
              </div>
              <div className="LoginBody">

                <article>
                  <img src="/images/Trick.png" />

                  <p>Please update your Zoom or Meet or Team Link</p>
                </article>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your meeting link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmitMeeting}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};


export default Mentor_Sidebar
