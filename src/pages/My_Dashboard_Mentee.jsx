import React from 'react'
import { useEffect } from 'react';
import MentorSection from '../components/mentee/MentorSection'
import CourseSuggestion from '../components/mentee/CourseSuggestion'
import CommunitySection from '../components/mentee/CommunitySection'
import Mentee_Navigation from '../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../components/mentee/Mentee_Sidebar'
import Upcoming_Session from '../components/mentee/Upcoming_Session'
import { getFcmToken } from "../utils/getFcmToken";
import api from '../api/axiosInstance';

const My_Dashboard_Mentee = () => {

  ////////////////notification states/////////////////////
  useEffect(() => {

    const setupNotifications = async () => {
      try {

        const token = await getFcmToken();

        if (token) {

          await api.put(
            "/notification-status",
            { status: true },   // body data
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            }
          );

        }

      } catch (error) {
        console.log("Notification setup error:", error);
      }
    };

    setupNotifications();

  }, []);

  return (
    <>

      <Mentee_Navigation />

      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Dashboard</h3>
          </div>

          <div className="DashboardArea">

            <Upcoming_Session />

            <MentorSection />

            <CourseSuggestion />

            <CommunitySection />
          </div>
        </div>
      </div>


    </>
  )
}

export default My_Dashboard_Mentee
