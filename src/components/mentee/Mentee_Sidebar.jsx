import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Mentee_Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/my-dashboard-mentee", icon: "Nav-1.png", label: "Dashboard" },
    { path: "/all-community-mentee", icon: "Nav-2.png", label: "All Community" },
    { path: "/finished-courses", icon: "Nav-2.png", label: "Finished Courses" },
    { path: "/session-history", icon: "Nav-5.png", label: "Session History" },
    { path: "/my-resources", icon: "Nav-6.png", label: "Saved Resources" },

  ];

  return (
    <div className="SidenavArea">
      <div className="SidenavHead">
        <img src="/images/Logo.png" alt="Logo" style={{ cursor: "pointer" }}
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
                onClick={() => navigate(item.path)}
                style={{ cursor: "pointer" }}
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
  );
};

export default Mentee_Sidebar;
