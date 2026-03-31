import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation';
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';
import { useNavigate } from 'react-router-dom';

const All_Courses = () => {

  const Navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const menteeId = user?.id;

  // const [categories,setCategories] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user?.id) return;

        const res = await api.get(`/getUserintrest/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });


        const specs = res.data.data.intrest || [];
        setSpecializations(specs);

        if (specs.length > 0) {
          setActiveSpec(specs[0].id);
        }

      } catch (err) {
        console.error(
          'USER FETCH ERROR 👉',
          err.response?.data || err.message
        );
      }
    };

    fetchUser();
  }, []);


  const fetchResources = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await api.get("/mentee/resources", {
        params: { menteeId, categoryId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //console.log('RESOURCES', res.data.data);
      setResources(res.data.data || []);

    } catch (err) {
      console.error(
        'RESOURCE FETCH ERROR',
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchResources(activeSpec);
  }, [activeSpec]);


  const handleWishlistToggle = async (resourceId, isLiked) => {

    try {
      if (isLiked) {
        await api.delete("/wishlist/remove", {
          data: {
            menteeId: menteeId,
            resourceId: resourceId
          }
        });
      } else {

        await api.post("/wishlist/add", {
          menteeId: menteeId,
          resourceId: resourceId
        });
      }
      fetchResources(activeSpec);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }

  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>All Resources</h3>
            {/* <div className="SearchBox">
                    <span><img src="/images/search.png" /></span>
                    <input type="text" placeholder="Search"/>
                </div> */}
          </div>
          <div className="HistoryArea">
            <div className="HistoryHead">

              <ul>
                {specializations.map((item) => (
                  <li key={item.id}>
                    <button
                      className={activeSpec === item.id ? 'active' : ''}
                      onClick={() => setActiveSpec(item.id)}
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
              {resources.map((item) => (
                <div className="col-sm-2" key={item.id}>
                  <div className="ResourcesBox"
                    onClick={() => Navigate(`/resource-details/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="Icon">
                      <i
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlistToggle(item.id, item.isLiked);
                        }}
                        className={`fa ${item.isLiked ? "fa-heart text-danger" : "fa-heart-o"
                          }`}
                        aria-hidden="true"
                      ></i>
                    </span>

                    <figure>
                      {/* VIDEO */}
                      {item.resourceType === 'video' && (
                        <>
                          <span className="Play">
                            <i className="fa fa-play" aria-hidden="true"></i>
                          </span>

                          <img
                            src={item.thumbnailUrl || '/images/Program-1.png'}
                            alt={item.heading}
                          />
                        </>
                      )}

                      {/* PDF / PPT / DOC – CUSTOM ICON */}
                      {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                        <div className="OnlyIcon">
                          {item.resourceType === 'pdf' && (
                            <i className="fa fa-file-pdf-o PdfIcon" aria-hidden="true"></i>
                          )}

                          {item.resourceType === 'ppt' && (
                            <i className="fa fa-file-powerpoint-o PptIcon" aria-hidden="true"></i>
                          )}

                          {item.resourceType === 'doc' && (
                            <i className="fa fa-file-word-o DocIcon" aria-hidden="true"></i>
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

export default All_Courses
