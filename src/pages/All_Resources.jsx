import React from 'react'
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
//import ResourceSection from '../components/mentors/ResourceSection'
import Mentor_Navigation from '../components/mentors/Mentor_Navigation'
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar'
import { useNavigate} from 'react-router-dom';

const All_Resources = () => {

    const Navigate = useNavigate();
    const [resources, setResources] = useState([]);


const fetchResources = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await api.get(`/resource/mentor-resources`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('RESOURCES 👉', res.data.data);
    setResources(res.data.data || []);

  } catch (err) {
    console.error(
      'RESOURCE FETCH ERROR 👉',
      err.response?.data || err.message
    );
  }
};

useEffect(() => {
  fetchResources();
}, []);

  return (
    
    <>
     <style>{`
    .OnlyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
}

.PdfIcon {
  font-size: 64px;
  color: #e53935; /* red */
}

.PptIcon {
  font-size: 64px;
  color: #fb8c00; /* orange */
}

.ResourceTypeBox {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.ResourceTypeBox input {
  accent-color: #007bff;
}


    `}</style>
    <Mentor_Navigation/>

     <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>All Resources</h3>
                <div className="SearchBox">
                    <span><img src="/images/search.png" /></span>
                    <input type="text" placeholder="Search"/>
                </div>
            </div>

            <div className="HistoryBody">
                        <div className="row">
                            {resources.map((item) => (
                            <div className="col-sm-2" key={item.id}>
                                <div className="ResourcesBox"
                                  onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
                                  style={{ cursor: "pointer" }}
                                >    
                                <span className="Icon">
                                    <img src="/images/Heart.png" />
                                </span>

                                <figure>
                                {/* VIDEO */}
                                {item.resourceType === 'video' && (
                                    <>
                                    <span className="Play">
                                        <i className="fa fa-play" aria-hidden="true"></i>
                                    </span>

                                    <img
                                        src={item.thumbnailUrl || '/src/assets/images/Program-1.png'}
                                        alt={item.heading}
                                    />
                                    </>
                                )}

                                {/* PDF / PPT – CUSTOM ICON */}
                                {(item.resourceType === 'pdf' || item.resourceType === 'ppt') && (
                                <div className="OnlyIcon">
                                    {item.resourceType === 'pdf' && (
                                    <i className="fa fa-file-pdf-o PdfIcon" aria-hidden="true"></i>
                                    )}

                                    {item.resourceType === 'ppt' && (
                                    <i className="fa fa-file-powerpoint-o PptIcon" aria-hidden="true"></i>
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

                        
                        </div>
                    </div>
         
        </div>
    </div>
    </>
  )
}

export default All_Resources
