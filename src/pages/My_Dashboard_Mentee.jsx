import React from 'react'
import MentorSection from '../components/mentee/MentorSection'
import CourseSuggestion from '../components/mentee/CourseSuggestion'
import CommunitySection from '../components/mentee/CommunitySection'
import Mentee_Navigation from '../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../components/mentee/Mentee_Sidebar'
import Upcoming_Session from '../components/mentee/Upcoming_Session'

const My_Dashboard_Mentee = () => {


  return (
    <>
    
    <Mentee_Navigation />

    <Mentee_Sidebar/>

    <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>Dashboard</h3> 
            </div>

            <div className="DashboardArea">

                <Upcoming_Session/>







                <MentorSection />

                <CourseSuggestion />

                <CommunitySection/>
            </div>
        </div>
    </div>

    
    </>
  )
}

export default My_Dashboard_Mentee
