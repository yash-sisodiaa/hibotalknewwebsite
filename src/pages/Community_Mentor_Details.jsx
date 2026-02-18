import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import Mentor_Navigation from "../components/mentors/Mentor_Navigation";
import Mentor_Sidebar from "../components/mentors/Mentor_Sidebar";


const Community_Mentor_Details = () => {
  const { id } = useParams();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userType = user?.user_type;

  const fetchCommunity = async () => {
    try {
      const res = await api.get(
        `/community/community/${id}?userId=${userId}&userType=${userType}`
      );

      setCommunity(res.data.data);
    } catch (error) {
      console.error("Error fetching community:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>Community</h3> 
            </div>

            <div className="CommunityDetailsArea">
                <div className="row">
                    <div className="col-lg-8 col-md-10">
                        <div className="CommunityBox">
                            <h3>
                                <span className="Icon"><img src={community?.mentor?.profile_pic || "/src/assets/images/Profile-1.png"} alt="Community Thumbnail" /> </span>
                                <span className="Name">{community?.mentor?.fullname}</span>
                                
                            </h3>
                            <figure>
                                <img src={community?.thumbnailUrl || "/src/assets/images/Community.png"} alt="Community Image" />
                            </figure>
                            <figcaption>
                                <h4>{community?.title}</h4>
                                <p>{community?.description}</p>
                               
                                <ul>
                                    <li><span><img src="/src/assets/images/Like.png"/> </span>{community?.likesCount || 0}</li>
                                    <li><span><img src="/src/assets/images/Message.png"/> </span>{community?.commentsCount || 0}</li>
                                   
                                </ul>
                            </figcaption>

                            <div className="CommentBox">
                                <h4>Comments</h4>

                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Add a Comment"/>
                                </div>

                                <ul>
                                    <li>
                                        <figure>
                                            <img src="/src/assets/images/Profile.png"/>
                                        </figure>
                                        <figcaption>
                                            <h5>@mahesh7412</h5>
                                            <p>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been </p>
                                            <h6>
                                                <strong>1days ago</strong>
                                                <a href="">Replies <img src="/src/assets/images/arrow-right.png"/> </a>
                                            </h6>
                                        </figcaption>
                                        <aside>
                                            <span><i className="fa fa-heart" aria-hidden="true"></i></span>
                                            <strong>12</strong>
                                        </aside>
                                    </li>

                                    <li>
                                        <figure>
                                            <img src="/src/assets/images/Profile.png"/>
                                        </figure>
                                        <figcaption>
                                            <h5>@mahesh7412</h5>
                                            <p>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been </p>
                                            <h6>
                                                <strong>1days ago</strong>
                                                <a href="">Replies <img src="/src/assets/images/arrow-right.png"/> </a>
                                            </h6>
                                        </figcaption>
                                        <aside>
                                            <span><i className="fa fa-heart" aria-hidden="true"></i></span>
                                            <strong>12</strong>
                                        </aside>
                                    </li>
                                </ul>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
         
        </div>
    </div>
    </>
  );
};

export default Community_Mentor_Details;
