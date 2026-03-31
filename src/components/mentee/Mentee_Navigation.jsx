import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axiosInstance';


const Mentee_Navigation = () => {



  const changeLanguage = (language) => {

    if (language === "en") {
      document.cookie = "googtrans=/en/en;path=/";
      window.location.reload();
      return;
    }

    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = language;
      select.dispatchEvent(new Event("change"));
    }

    setLang(language);
  };


  const [lang, setLang] = useState("en");
  const [openLang, setOpenLang] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const name = profile?.fullname || user?.fullname || "User";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/get-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(res.data.data);
      } catch (error) {
        console.error('Profile fetch failed', error);
      }
    };
    fetchProfile();
  }, []);

  ////////////////for chat notification/////////
  const [unreadRoomsCount, setUnreadRoomsCount] = useState(0);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get(`/chat/rooms?userId=${userId}`);
        const rooms = res.data.rooms || [];

        const count = rooms.filter(
          (room) => room.unreadCount > 0
        ).length;

        setUnreadRoomsCount(count);

      } catch (error) {
        console.log(error);
      }
    }
    fetchRooms();
  }, [])

  ////////////////for notification count/////////

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/mentee/get-notification/${userId}`);
        const notifications = res.data.notifications || [];

        const lastSeen = localStorage.getItem("notification_last_seen");

        if (!lastSeen) {
          setUnreadNotificationCount(notifications.length);
          return;
        }

        const unread = notifications.filter((n) => {
          return new Date(n.createdAt) > new Date(lastSeen);
        });

        setUnreadNotificationCount(unread.length);

      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  ////////////////Logout function//////////
  const handleLogout = async () => {
    try {

      await api.post("/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };


  ////////////////dlt account/////////
  const handleDeleteAccount = async () => {

    const confirmDelete = window.confirm("Are you sure you want to delete your account?");

    if (!confirmDelete) {
      return;
    }

    try {

      const res = await api.delete(`/delete-user/${user.id}`);

      if (res.data.status) {
        alert("Account deleted successfully");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

  };

  return (
    <div className="Navigation">
      <div className="NaviToggle">
        <button onClick={() => {
          const sidebar = document.querySelector('.SidenavArea');
          if (sidebar) sidebar.classList.add('show');
        }}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul>
        <li>
          <a
            onClick={() => navigate("/all-chats-mentee")}
            className="Circle"
            style={{ cursor: "pointer" }}
          >
            <span className="Icon">
              <img src="/images/Chat.png" alt="" />
            </span>
            {unreadRoomsCount > 0 && (
              <span className="Badge">
                {unreadRoomsCount}
              </span>
            )}
          </a>
        </li>

        {/* Notification */}
        <li className={`dropdown notification ${showNotification ? "show" : ""}`}>
          <a
            onClick={() => {
              navigate("/my-notifications-mentee");
              setShowNotification(!showNotification);
              setShowProfile(false);
            }}
            className="Circle"
            style={{ cursor: "pointer" }}
          >
            <span className="Icon">
              <img src="/images/notifications.png" alt="" />
            </span>
            {unreadNotificationCount > 0 && (
              <span className="Badge">
                {unreadNotificationCount}
              </span>
            )}
          </a>

        </li>

        <li className="Language dropdown">
          <a
            style={{ cursor: "pointer" }}
            onClick={() => setOpenLang(!openLang)}
          >
            <span className="Icon">
              <img src={lang === "fr" ? "/images/france-flag-icon-1 (1).png" : "/images/Flag.png"} alt="" />
            </span>
            <span className="Text">{lang === "fr" ? "Fr" : "Eng"}</span>
          </a>

          {openLang && (
            <div className="dropdown-menu show">

              {lang === "en" ? (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    changeLanguage("fr");
                    setOpenLang(false);
                  }}
                >
                  French
                </button>
              ) : (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    changeLanguage("en");
                    setOpenLang(false);
                  }}
                >
                  English
                </button>
              )}

            </div>
          )}
        </li>

        {/* Profile */}
        <li className={`dropdown profile ${showProfile ? "show" : ""}`}>
          <a
            className="dropdown-toggle"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotification(false);
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="Icon">
              <img src={profile?.profile_pic || user?.profile_pic || "images/default-profile.png"} alt="Profile" />
            </span>
            <span className="Text">{name}</span>
          </a>

          <ol className={`dropdown-menu ${showProfile ? "show" : ""}`}>
            <li>
              <a onClick={() => navigate("/my-profile")} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-1.png" alt="" />
                </span>
                <span className="Text">Profile</span>
              </a>
            </li>
            {/* <li>
              <a onClick={() => navigate("/terms-and-conditions")} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-2.png" alt="" />
                </span>
                <span className="Text">Terms and Conditions</span>
              </a>
            </li> */}
            {/* <li>
              <a onClick={() => navigate("/privacy-policy")} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-2.png" alt="" />
                </span>
                <span className="Text">Privacy Policy</span>
              </a>
            </li> */}
            <li>
              <a onClick={() => navigate("/help-center-mentee")} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-3.png" alt="" />
                </span>
                <span className="Text">Help Center</span>
              </a>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-4.png" alt="" />
                </span>
                <span className="Text">Sign out</span>
              </a>
            </li>
            <li>
              <a onClick={handleDeleteAccount} style={{ cursor: "pointer" }}>
                <span className="Icon">
                  <img src="images/account-4.png" alt="" />
                </span>
                <span className="Text">Delete Account</span>
              </a>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  );
};

export default Mentee_Navigation;
