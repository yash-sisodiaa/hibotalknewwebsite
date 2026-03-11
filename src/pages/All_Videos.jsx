import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';

const All_Videos = () => {

    const Navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const fetchVideos = async () => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/resource/mentor-resources/`, {
      params: {
        resourceType: 'video'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

  setVideos(res.data.data || []);
};

useEffect(() => {
  fetchVideos();
}, []);
  return (
    <>

    <Mentor_Navigation/>

     <Mentor_Sidebar />

     

    <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>All Videos</h3>
                {/* <div className="SearchBox">
                    <span><img src="src/assets/images/search.png" /></span>
                    <input type="text" placeholder="Search"/>
                </div> */}
            </div>

            <div className="HistoryBody">
             <div className="row">
          {videos.length === 0 && (
            <p style={{ padding: '0 15px' }}>No videos found</p>
          )}

          {videos.map((item) => (
            <div className="col-sm-2" key={item.id}>
              <div className="ResourcesBox"
                onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
                style={{ cursor: "pointer" }}
              >

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
        </div>
        </div>
         
        </div>
    </div>
    </>
  )
}

export default All_Videos;

