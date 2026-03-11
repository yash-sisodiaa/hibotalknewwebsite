import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate} from 'react-router-dom';

import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';
import { Link } from "react-router-dom";


const FinishedCourse = () => {
   const Navigate = useNavigate();
     const userId = JSON.parse(localStorage.getItem("user"))?.id;
     //console.log("userid",userId)
     
     
     const [resources, setResources] = useState([]);
     const [loading, setLoading] = useState(true);
     
   

    useEffect(() => {
  fetchMentorDetails();
}, []);



     const fetchMentorDetails = async () => {
    try {
      const res = await api.get(`/completed-courses/${userId}`);

      if (res.data.success) {
        setResources(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
    } finally {
      setLoading(false);
    }
  };





  return (
    <>
        <Mentee_Navigation />

       <Mentee_Sidebar/>

      <div className="WrapperArea">
        <div className="WrapperBox">
            

            <div className="MontorArea">


                <div className="HistoryArea">
                    <div className="HistoryHead">
                        <h3>Finished Courses</h3>
                        
                    </div>
                    <div className="HistoryBody">
                        <div className="row">
                            {
                                resources.length > 0 ? (
                                    <div className="HistoryBody">
                        <div className="row">
                            {resources.map((item) => {
  const resource = item.resource;

  return (
    <div className="col-sm-2" key={item.id}>
      <div
        className="ResourcesBox"
        onClick={() => Navigate(`/resource-details/${resource.id}`)}
        style={{ cursor: "pointer" }}
      >
        <figure>

          {resource.resourceType === "video" && (
            <>
              <span className="Play">
                <i className="fa fa-play"></i>
              </span>

              <img
                src={resource.thumbnailUrl || "/images/Program-1.png"}
                alt={resource.heading}
              />
            </>
          )}

          {(resource.resourceType === "pdf" ||
            resource.resourceType === "ppt" ||
            resource.resourceType === "doc") && (
            <div className="OnlyIcon">
              {resource.resourceType === "pdf" && (
                <i className="fa fa-file-pdf-o PdfIcon"></i>
              )}

              {resource.resourceType === "ppt" && (
                <i className="fa fa-file-powerpoint-o PptIcon"></i>
              )}

              {resource.resourceType === "doc" && (
                <i className="fa fa-file-word-o DocIcon"></i>
              )}
            </div>
          )}

        </figure>

        <figcaption>
          <p>{resource.heading}</p>
        </figcaption>
      </div>
    </div>
  );
})}

                           
                        </div>
                    </div>
                                   
                                ): (
                                    <p style={{ padding: '0 15px' }}>No resources found</p>
                                )
                            }
                            
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
    </>
  )
}

export default FinishedCourse
