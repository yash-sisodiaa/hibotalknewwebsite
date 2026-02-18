import React from 'react'

const Mentor_Sidebar = () => {
  return (
    <>
     <div  className="SidenavArea">
        <div  className="SidenavHead">
            <img src="/src/assets/images/Logo.png" />
            <button> × </button>
        </div>
        <div  className="SidenavBody">
            <ul>
                <li  className="active">
                    <a href="my-dashboard.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-1.png" /> </span>
                        <span  className="Text">Dashoard</span>
                    </a>
                </li>
                <li>
                    <a href="my-community.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-2.png" /> </span>
                        <span  className="Text">Community</span>
                    </a>
                </li>
                <li>
                    <a href="my-mentors.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-3.png" /> </span>
                        <span  className="Text">Our Mentors</span>
                    </a>
                </li>
                <li>
                    <a href="my-our-sessions.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-4.png" /> </span>
                        <span  className="Text">Our Resources</span>
                    </a>
                </li>
                <li>
                    <a href="my-session-history.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-5.png" /> </span>
                        <span  className="Text">Session History</span>
                    </a>
                </li>
                <li>
                    <a href="my-resources.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-6.png" /> </span>
                        <span  className="Text">Saved Resources</span>
                    </a>
                </li>
                <li>
                    <a href="my-community-save.html">
                        <span  className="Icon"> <img src="/src/assets/images/Nav-7.png" /> </span>
                        <span  className="Text">Saved Community</span>
                    </a>
                </li> 
            </ul>
        </div>
    </div>
    </>
  )
}

export default Mentor_Sidebar
