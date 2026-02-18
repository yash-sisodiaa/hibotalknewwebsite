import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation';
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';
import { useNavigate} from 'react-router-dom';

const All_Mentors = () => {
   const Navigate = useNavigate();
  const [mentors, setMentors] = useState([]);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await api.get(`/mentee/mentors`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMentors(res.data.mentors || []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Our Mentors</h3>
            <div className="SearchBox">
              <span>
                <img src="/src/assets/images/search.png" alt="search" />
              </span>
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <div className="row">
            {mentors.map((mentor) => (
              <div
                className="col-xl-4 col-lg-6 col-md-6 col-sm-6"
                key={mentor.id}
                onClick={()=> Navigate(`/my-mentor-details/${mentor.id}`)}
                 style={{ cursor: "pointer" }}
              >
                
                <div className="MontorBox">
                    <span className="Icon"><img src="src/assets/images/Heart.png" /> </span>
                  <figure>
                    <img
                      src={
                        mentor.profile_pic ||
                        "/src/assets/images/default-profile.png"
                      }
                      alt={mentor.fullname}
                    />
                  </figure>

                  <h3>
                    <Link to={`/mentor-details/${mentor.id}`}>
                      {mentor.fullname}
                    </Link>
                  </h3>

                  <h5>{mentor.specializations}</h5>

                  <h6>
                    Experience: {mentor.experience}
                  </h6>

                  <p>
                    Qualification: {mentor.qualification}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {mentors.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No mentors found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default All_Mentors;
