import React, { act, use } from 'react'
import $ from "jquery";
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';


const VideosSection = () => {

  const Navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [specializationsforvideos, setSpecializationsforvideos] = useState([]);
    const [activeSpecforvideo, setActiveSpecforvideo] = useState(null);
    
    const fetchVideos = async (categoryId) => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/resource/get-resources/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

  setVideos(res.data.data || []);
};

useEffect(() => {
  fetchVideos(activeSpecforvideo);
}, [activeSpecforvideo]);

useEffect(() => {
  const fetchUservideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user?.id) return;

      const res = await api.get(`/getUser/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('USER DATA', res.data.data);

      const specs = res.data.data.specializations || [];
      setSpecializationsforvideos(specs);

      if (specs.length > 0) {
        setActiveSpecforvideo(specs[0].id);
      }

    } catch (err) {
      console.error(
        'USER FETCH ERROR 👉',
        err.response?.data || err.message
      );
    }
  };

  fetchUservideos();
}, []);
  
  return (
    <>
    <div  className="HistoryArea">
                    <div  className="HistoryHead">
                        <h3>My Video <Link to="/all-videos">View all</Link> </h3>
                        <ul>
                           {specializationsforvideos.map((item) => (
                                <li key={item.id}>
                                <button
                                    className={activeSpecforvideo === item.id ? 'active' : ''}
                                    onClick={() => setActiveSpecforvideo(item.id)}
                                >
                                    {item.name}
                                </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="HistoryBody">
        <div className="row">
          {/* {videos.length === 0 && (
            <p style={{ padding: '0 15px' }}>No videos found</p>
          )} */}

          {videos.map((item) => (
            <div className="col-sm-2" key={item.id}>
              <div className="ResourcesBox"
              onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
              style={{ cursor: "pointer" }}>
                

                <figure>
                  <span className="Play">
                    <i className="fa fa-play"></i>
                  </span>

                  <img
                    src={item.thumbnailUrl || '/images/Program-1.png'}
                    alt={item.heading}
                  />
                </figure>

                <figcaption>
                  <p>{item.heading}</p>
                </figcaption>
              </div>
            </div>
          ))}

          {/* Add Video */}
          <div className="col-sm-2">
            <div
              className="AddBox"
              data-toggle="modal"
              data-target="#VideoModal"
            >
              <span>+</span>
              <p>Add Video</p>
            </div>
          </div>
        </div>
                    </div>
                </div>
    </>
  );
};

export default VideosSection;
