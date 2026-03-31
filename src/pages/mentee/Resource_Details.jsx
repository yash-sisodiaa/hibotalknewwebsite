import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
//import { useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar'

const Resource_Details = () => {

  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const recordClick = async (resId) => {
    if (hasClicked) return;
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
      const menteeId = user?.id;
      if (!menteeId) return;

      await api.post('/clicks', {
        menteeId,
        resourceId: resId
      });
      setHasClicked(true);
    } catch (error) {
      console.error("Error recording click:", error);
    }
  };

  const recordView = async (resId) => {
    if (hasViewed) return;
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
      const menteeId = user?.id;
      if (!menteeId) return;

      await api.post('/views', {
        menteeId,
        resourceId: resId
      });
      setHasViewed(true);
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const markCompleted = async () => {
    if (hasCompleted || !resource) return;
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
      const menteeId = user?.id;

      if (!menteeId) return;

      const res = await api.post('/completed-courses', {
        menteeId: menteeId,
        resourceId: resource.id
      });

      if (res.data.success) {
        //console.log("Course marked as completed");
        setHasCompleted(true);
      }
    } catch (error) {
      console.error("Error marking course completed:", error);
    }
  };

  useEffect(() => {
    if (!resource || resource.resourceType === 'video' || hasCompleted) return;

    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isBottom) {
        markCompleted();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [resource, hasCompleted]);

  const fetchResource = async () => {
    try {
      const res = await api.get(`/resource/resource/${id}`);

      if (res.data.success) {
        setResource(res.data.data);
        recordClick(res.data.data.id);

        // Non-video resources: record view after a short delay
        if (res.data.data.resourceType !== 'video') {
          setTimeout(() => recordView(res.data.data.id), 2000);
        }
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

      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Resource Details</h3>
          </div>

          <div className="SessionsArea">
            <div className="DetailsArea">
              <div className="row">

                {/* LEFT SIDE (Preview Section) */}
                <div className="col-lg-6 col-md-12">
                  <div className="DetailsLeft" onWheel={() => {
                    if (resource?.resourceType !== 'video') markCompleted();
                  }}>

                    {/* VIDEO */}
                    {resource.resourceType === "video" && (
                      <video
                        controls
                        width="100%"
                        poster={resource.thumbnailUrl}
                        onEnded={markCompleted}
                        onTimeUpdate={(e) => {
                          const { currentTime, duration } = e.target;
                          if (duration > 0 && (currentTime / duration) >= 0.5) {
                            recordView(resource.id);
                          }
                        }}
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
                        onLoad={markCompleted}
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
                          onClick={() => {
                            markCompleted();
                            recordView(resource.id);
                          }}
                        >
                          Download PPT
                        </a>
                      </div>
                    )}

                    {resource.resourceType === "doc" && (
                      <div className="OnlyIcon" style={{ height: "300px" }}>
                        <i className="fa fa-file-word-o DocIcon" />
                        <br />
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          onClick={() => {
                            markCompleted();
                            recordView(resource.id);
                          }}
                        >
                          Download DOC
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
                      onClick={() => {
                        markCompleted();
                        recordView(resource.id);
                      }}
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
