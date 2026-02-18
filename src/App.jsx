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

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1 */}
        <Route path="/" element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/mentors' element={<Mentors/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/resource' element={<Resources/>} />


        <Route path='/my-dashboard-mentor' element={<My_Dashboard_Mentor/>} />
        <Route path='/all-community' element={<All_Community/>} />
        <Route path='/all-resources' element={<All_Resources/>} />
        <Route path='/all-videos' element={<All_Videos/>} />
        <Route path='/my-mentor-sessions' element={<My_Mentor_Sessions/>} />
        <Route path='/resource-mentor-details/:id' element={<Resource_Mentors_Details/>} />
        <Route path='/community-mentor-details/:id' element={<Community_Mentor_Details/>} />





        <Route path='/my-dashboard-mentee' element={<My_Dashboard_Mentee/>} />
        <Route path='/all-mentors' element={<All_Mentors/>} />
        <Route path='/my-mentor-details/:id' element={<My_Mentor_Details/>} />
        <Route path='/resource-details/:id' element={<Resource_Details/>} />
        <Route path='/community-details/:id' element={<Community_Details/>} />
        <Route path='/all-upcoming-sessions' element={<All_Upcoming_Session/>} />
        <Route path='/resheduled-mentors' element={<Reshedule_Mentor/>} />
        <Route path='/request-session' element={<Request_Session/>} />
       
      </Routes>
    </Router>
  )
}

export default App
