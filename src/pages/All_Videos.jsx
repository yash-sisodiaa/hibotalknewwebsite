import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';

const All_Videos = () => {

   const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [specializationsforvideos, setSpecializationsforvideos] = useState([]);
  const [activeSpecforvideo, setActiveSpecforvideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // FETCH VIDEOS
  const fetchVideos = async (categoryId) => {
    try {

      if (!categoryId) return;

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get(`/resource/get-resources/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered = (res.data?.data || []).filter(
        (item) => item.resourceType === "video"
      );

      setVideos(filtered);

    } catch (err) {
      console.error("VIDEO FETCH ERROR", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH USER SPECIALIZATIONS
  useEffect(() => {
    const fetchUservideos = async () => {
      try {

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?.id) return;

        const res = await api.get(`/getUser/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const specs = res.data?.data?.specializations || [];

        setSpecializationsforvideos(specs);

        if (specs.length > 0) {
          setActiveSpecforvideo(specs[0].id);
        }

      } catch (err) {
        console.error(
          "USER FETCH ERROR 👉",
          err.response?.data || err.message
        );
      }
    };

    fetchUservideos();
  }, []);

  // WHEN CATEGORY CHANGE
  useEffect(() => {
    if (activeSpecforvideo) {
      fetchVideos(activeSpecforvideo);
    }
  }, [activeSpecforvideo]);
   
  return (
    <>

    <Mentor_Navigation/>

     <Mentor_Sidebar />

     

    <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>All Videos</h3>
                   
            </div>
            <div className="HistoryArea">
                  <div className="HistoryHead">
                     
            
                      <ul>
            {specializationsforvideos.map((item) => (
              <li key={item.id}>
                <button
                  className={activeSpecforvideo === item.id ? "active" : ""}
                  onClick={() => setActiveSpecforvideo(item.id)}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
              </div>
            </div>

            <div className="HistoryBody">
          <div className="row">

            {loading && <p style={{ padding: "0 15px" }}>Loading videos...</p>}

            {!loading &&
              videos.map((item) => (
                <div className="col-sm-2" key={`${item.id}-${activeSpecforvideo}`}>
                  <div
                    className="ResourcesBox"
                    onClick={() =>
                      navigate(`/resource-mentor-details/${item.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <figure>
                      <span className="Play">
                        <i className="fa fa-play"></i>
                      </span>

                      <img
                        src={item.thumbnailUrl || "/images/Program-1.png"}
                        alt={item.heading}
                      />
                    </figure>

                    <figcaption>
                      <p>{item.heading}</p>
                    </figcaption>
                  </div>
                </div>
              ))}

            

          </div>
        </div>
         
        </div>
    </div>
    </>
  )
}

export default All_Videos;

