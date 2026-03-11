import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation';
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';

const My_Resource = () => {

  const Navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        //const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user');
        const id = JSON.parse(userId).id;
        

        const res = await api.get(`/wishlist/${id}?type=mentee`);

        const wishlist = res.data.wishlist || [];

        const onlyResources = wishlist
          .filter(item => item.resource !== null)
          .map(item => item.resource);

        const onlyMentors = wishlist
          .filter(item => item.mentor !== null)
          .map(item => item.mentor);

        setResources(onlyResources);
        setMentors(onlyMentors);

      } catch (error) {
        console.error("Wishlist fetch error:", error);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      {/* ================== SAVED RESOURCES ================== */}
      <div className="WrapperArea" style={{ marginBottom: "0px" }}>
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Saved Resources</h3>
          </div>

          <div className="HistoryBody">
            <div className="row">
              {resources.map((item) => (
                <div className="col-sm-2" key={item.id}>
                  <div
                    className="ResourcesBox"
                    onClick={() => Navigate(`/resource-mentor-details/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="Icon">
                      
                    </span>

                    <figure>
                      {item.resourceType === 'video' && (
                        <>
                          <span className="Play">
                            <i className="fa fa-play"></i>
                          </span>

                          <img
                            src={item.thumbnailUrl || '/images/Program-1.png'}
                            alt={item.heading}
                          />
                        </>
                      )}

                      {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                        <div className="OnlyIcon">
                          {item.resourceType === 'pdf' && (
                            <i className="fa fa-file-pdf-o PdfIcon"></i>
                          )}
                          {item.resourceType === 'ppt' && (
                            <i className="fa fa-file-powerpoint-o PptIcon"></i>
                          )}
                          {item.resourceType === 'doc' && (
                            <i className="fa fa-file-word-o DocIcon"></i>
                          )}
                        </div>
                      )}
                    </figure>

                    <figcaption>
                      <p>{item.heading}</p>
                    </figcaption>
                  </div>
                </div>
              ))}

              {resources.length === 0 && (
                <p style={{ padding: "20px" }}>No resources found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================== SAVED MENTORS ================== */}
      <div className="WrapperArea" style={{ marginTop: "-250px" }}>
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Saved Mentors</h3>
          </div>

          <div className="row">
            {mentors.map((mentor) => (
              <div
                className="col-xl-4 col-lg-6 col-md-6 col-sm-6"
                key={mentor.id}
                onClick={() => Navigate(`/my-mentor-details/${mentor.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="MontorBox">
                  <span className="Icon">
                    
                  </span>

                  <figure>
                    <img
                      src={
                        mentor.profile_pic ||
                        "/images/default-profile.png"
                      }
                      alt={mentor.fullname}
                    />
                  </figure>

                  <h3>
                    <Link to={`/mentor-details/${mentor.id}`}>
                      {mentor.fullname}
                    </Link>
                  </h3>

                  <h5>{mentor.specialization}</h5>

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
    </>
  );
};

export default My_Resource;
