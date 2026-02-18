import React from 'react'

const Mentee_Navigation = () => {
  return (
    <>
    <div className="Navigation">
        <div className="NaviToggle">
            <button>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <ul>
            <li>
                <a href="my-chat.html" className="Circle">
                    <span className="Icon"><img src="/src/assets/images/Chat.png" /> </span>
                    <span className="Badge"></span>
                </a>
            </li>
            
            <li className="dropdown notification">
                <a href="javascript:void(0)" id="navbardrop" className="Circle" data-toggle="dropdown" aria-expanded="false">
                    <span className="Icon"><img src="/src/assets/images/notifications.png" /> </span>
                    <span className="Badge"></span>
                </a>
                <div className="dropdown-menu">
                    <article>
                        <h4>Notifications</h4>
                    </article>
                    <article>
                        <ol>
                            <li>
                                <span className="Time">2 hours ago</span>
                                <h6>Session Confirmed!</h6>
                                <p>Your 30 Minute one to one session with Ms. Jenny Lopez has been scheduled. Click to view details.</p>
                            </li>
                            <li>
                                <span className="Time">2 hours ago</span>
                                <h6>Session Confirmed!</h6>
                                <p>Your 30 Minute one to one session with Ms. Jenny Lopez has been scheduled. Click to view details.</p>
                            </li>
                            <li>
                                <span className="Time">2 hours ago</span>
                                <h6>Session Confirmed!</h6>
                                <p>Your 30 Minute one to one session with Ms. Jenny Lopez has been scheduled. Click to view details.</p>
                            </li>
                            <li>
                                <a href="my-notification.html">View all</a>
                            </li>
                        </ol>
                    </article>
                </div>
            </li>

            <li className="Language">
                <a href="javascript:void(0)">
                    <span className="Icon"><img src="/src/assets/images/Flag.png" /> </span>
                    <span className="Text">Eng</span>
                </a>
            </li>
            
            <li className="dropdown profile">
                <a href="javascript:void(0)" id="navbardrop" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <span className="Icon"><img src="/src/assets/images/account.png" /> </span> 
                    <span className="Text">Sahil Wason</span>
                </a>
                <ol className="dropdown-menu">
                    <li>
                        <a href="my-profile.html">
                            <span className="Icon"><img src="/src/assets/images/account-1.png" /> </span> 
                            <span className="Text">Profile</span>
                        </a>
                    </li> 
                    <li>
                        <a href="my-community-save.html">
                            <span className="Icon"><img src="/src/assets/images/account-2.png" /> </span> 
                            <span className="Text">Community</span>
                        </a>
                    </li> 
                    <li>
                        <a href="my-help.html">
                            <span className="Icon"><img src="/src/assets/images/account-3.png" /> </span> 
                            <span className="Text">Help Center</span>
                        </a>
                    </li> 
                    <li>
                        <a href="index.html">
                            <span className="Icon"><img src="/src/assets/images/account-4.png" /> </span> 
                            <span className="Text">Sign out</span>
                        </a>
                    </li>  
                </ol>
            </li>
        </ul>
    </div>
    </>
  )
}

export default Mentee_Navigation
