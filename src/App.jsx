import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import Mentors from './pages/Mentors';
import Contact from './components/Contact';
import Resources from './pages/Resources';
import My_Dashboard_Mentor from './pages/My_Dashboard_Mentor';
import All_Community from './pages/All_Community';
import All_Resources from './pages/All_Resources';
import All_Videos from './pages/All_Videos';
import My_Dashboard_Mentee from './pages/My_Dashboard_Mentee';
import All_Mentors from './pages/mentee/All_Mentors';
import My_Mentor_Details from './pages/mentee/My_Mentor_Details';
import Resource_Details from './pages/mentee/Resource_Details';
import Community_Details from './pages/mentee/Community_Details';
import My_Mentor_Sessions from './pages/My_Mentor_Sessions';
import Resource_Mentors_Details from './pages/Resource_Mentors_Details';
import Community_Mentor_Details from './pages/Community_Mentor_Details';
import All_Upcoming_Session from './pages/mentee/All_Upcoming_Session';
import Reshedule_Mentor from './pages/mentee/Reshedule_Mentor';
import Request_Session from './pages/mentee/Request_Session';
import Session_History from './pages/mentee/Session_History';
import My_Profile from './pages/mentee/My_Profile';
import My_Resource from './pages/mentee/My_Resource';
import All_Courses from './pages/mentee/All_Courses';
import All_Community_Mentee from './pages/mentee/All_Community_Mentee';
import My_Profile_Mentor from './pages/My_Profile_Mentor';
import Chat_With_Mentor from './pages/mentee/Chat_With_Mentor';
import Chat_With_Mentee from './pages/Chat_With_Mentee';
import All_Upcoming_Sessions_Mentor from './pages/All_Upcoming_Sessions_Mentor';
import Reshedule_For_Mentor from './pages/Reshedule_For_Mentor';
import All_Chats_Mentor from './pages/All_Chats_Mentor';
import All_Chats_Mentee from './pages/mentee/All_Chats_Mentee';
import My_Dashboard_Request from './pages/My_Dashboard_Request';
import Manage_Resources from './pages/Manage_Resources';
import Session_Mentor_History from './pages/Session_Mentor_History';
import My_Notification from './pages/My_Notification';
import Notification_Mentor from './pages/mentee/Notification_Mentor';



import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useNotifications from "./hooks/useNotifications";
import Help from './pages/Help';
import Help_Mentee from './pages/mentee/Help_Mentee';
import Terms from './pages/mentee/Terms';
import Privacy_Policy from './pages/mentee/Privacy_Policy';
import My_Community from './pages/My_Community';
import CoursesandReview from './pages/CoursesandReview';
import FinishedCourse from './pages/mentee/FinishedCourse';

function App() {

  //useNotifications();


  return (
    
    <Router>
      {/* Toast Container */}
         <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        {/* Route 1 */}
        <Route path="/" element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/mentors' element={<Mentors/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/resource' element={<Resources/>} />
        
        {/* Mentor*/}
        <Route path='/my-dashboard-mentor' element={<My_Dashboard_Mentor/>} />
        <Route path='/all-community' element={<All_Community/>} />
        <Route path='/my-community' element={<My_Community/>} />
        <Route path='/all-resources' element={<All_Resources/>} />
        <Route path='/all-videos' element={<All_Videos/>} />
        <Route path='/my-mentor-sessions' element={<My_Mentor_Sessions/>} />
        <Route path='/resource-mentor-details/:id' element={<Resource_Mentors_Details/>} />
        <Route path='/community-mentor-details/:id' element={<Community_Mentor_Details/>} />
         <Route path='/my-profile-mentor' element={<My_Profile_Mentor/>} />
         <Route path='/chat-with-mentee/:menteeId' element={<Chat_With_Mentee/>} />
         <Route path='/all-upcoming-sessions-mentor' element={<All_Upcoming_Sessions_Mentor/>} />
         <Route path='/resheduled-for-mentors' element={<Reshedule_For_Mentor/>} />
         <Route path='/all-chats-mentor' element={<All_Chats_Mentor/>} />
         <Route path='/my-dashboard-request' element={<My_Dashboard_Request/>} />
         <Route path='/manage-resources' element={<Manage_Resources/>} />
         <Route path='/session-history-mentor' element={<Session_Mentor_History/>} />
         <Route path='/my-notifications' element={<My_Notification/>} />
         <Route path='/help-center' element={<Help/>} />
         <Route path='/course-review' element={<CoursesandReview/>} />




        {/* Mentee */}
        <Route path='/my-dashboard-mentee' element={<My_Dashboard_Mentee/>} />
        <Route path='/all-mentors' element={<All_Mentors/>} />
        <Route path='/my-mentor-details/:id' element={<My_Mentor_Details/>} />
        <Route path='/resource-details/:id' element={<Resource_Details/>} />
        <Route path='/community-details/:id' element={<Community_Details/>} />
        <Route path='/all-upcoming-sessions' element={<All_Upcoming_Session/>} />
        <Route path='/resheduled-mentors' element={<Reshedule_Mentor/>} />
        <Route path='/request-session' element={<Request_Session/>} />
        <Route path='/session-history' element={<Session_History/>} />
        <Route path='/my-profile' element={<My_Profile/>} />
        <Route path='/my-resources' element={<My_Resource/>} />
        <Route path='/all-courses' element={<All_Courses/>} />
        <Route path='/all-community-mentee' element={<All_Community_Mentee/>} />
        <Route path='/chat-with-mentor/:mentorId' element={<Chat_With_Mentor/>} />
        <Route path='/all-chats-mentee' element={<All_Chats_Mentee/>} />
        <Route path='/my-notifications-mentee' element={<Notification_Mentor/>} />
        <Route path='/help-center-mentee' element={<Help_Mentee/>} />
        <Route path='/terms-and-conditions' element={<Terms/>} />
        <Route path='/privacy-policy' element={<Privacy_Policy/>} />
        <Route path='/finished-courses' element={<FinishedCourse/>} />
       
      </Routes>
    </Router>
  )
}

export default App
