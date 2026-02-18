import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
//import { useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar'

const Resource_Details = () => {

    const {id} = useParams();
    
    
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const res = await api.get(`/resource/resource/${id}`);

      if (res.data.success) {
        setResource(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!resource) return <p>No resource found</p>;

  const mentor = resource.mentor;

  return (
    <>
       <Mentee_Navigation />

       <Mentee_Sidebar/>

    <div className="WrapperArea">
      <div className="WrapperBox">
        <div className="TitleBox">
          <h3>Resource Details</h3>
        </div>

        <div className="SessionsArea">
          <div className="DetailsArea">
            <div className="row">

              {/* LEFT SIDE (Preview Section) */}
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="DetailsLeft">

                  {/* VIDEO */}
                  {resource.resourceType === "video" && (
                    <video
                      controls
                      width="100%"
                      poster={resource.thumbnailUrl}
                    >
                      <source
                        src={resource.fileUrl}
                        type="video/mp4"
                      />
                    </video>
                  )}

                  {/* PDF */}
                  {resource.resourceType === "pdf" && (
                    <iframe
                      src={resource.fileUrl}
                      title="PDF Preview"
                      width="100%"
                      height="500px"
                    />
                  )}

                  {/* PPT */}
                  {resource.resourceType === "ppt" && (
                    <div className="OnlyIcon" style={{ height: "300px" }}>
                      <i className="fa fa-file-powerpoint-o PptIcon" />
                      <br />
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        Download PPT
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE (Details Section) */}
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="DetailsRight">
                  <h3>{resource.heading}</h3>

                  <h6>
                    {mentor?.fullname}
                  </h6>

                  <h4>About the Resource</h4>
                  <p>{resource.description}</p>

                  <h4>Details</h4>
                  <ul>
                    <li>Type: {resource.resourceType}</li>
                    <li>
                      Created:{" "}
                      {new Date(
                        resource.createdAt
                      ).toLocaleDateString()}
                    </li>
                    <li>
                      Language: English
                    </li>
                    <li>
                      Access: Lifetime Access
                    </li>
                  </ul>

                  {/* Download Button */}
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success mt-3"
                  >
                    Download Resource
                  </a>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Resource_Details
