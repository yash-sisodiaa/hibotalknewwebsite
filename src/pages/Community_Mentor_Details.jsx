import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import Mentor_Navigation from "../components/mentors/Mentor_Navigation";
import Mentor_Sidebar from "../components/mentors/Mentor_Sidebar";


const Community_Mentor_Details = () => {
  const { id } = useParams();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userType = user?.user_type;

  useEffect(() => {
    if (id && userId) {
      fetchCommunity();
      fetchComments();
    }
  }, [id, userId]);   // userId bhi dependency me daala

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

  const fetchComments = async () => {
    try {
      const res = await api.get(`comment/${id}?userId=${userId}`);
      setComments(res.data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if(!newComment.trim()) return;

    try {
        await api.post('/comment/add',{
            content: newComment,
            userId,
            communityId: id
        })

        setNewComment("");
        fetchComments();
    } catch (error) {
        console.error("Error adding comment:", error);
    }
  }

  const handleToggleLike = async (commentId) => {
    try {
        await api.post(`/commentlike/toggle/${commentId}`, {
            userId
        });
        fetchComments();
    } catch (error) {
        console.error("Error toggling like:", error);
    }
  }

  const handleToggleLikes = async (communityId, isLiked) => {
    try {
      const payload = {
        user_id: user.id,
        community_id: communityId,
        user_type: user.user_type,
      };

      if (isLiked) {
        await api.delete("/like/unlike", { data: payload });
      } else {
        await api.post("/like/like", payload);
      }

       fetchCommunity(); 
    } catch (error) {
      console.error("Like toggle failed", error);
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
                                <span className="Icon"><img src={community?.mentor?.profile_pic || "/images/Profile-1.png"} alt="Community Thumbnail" /> </span>
                                <span className="Name">{community?.mentor?.fullname}</span>
                                
                            </h3>
                            <figure>
                                <img src={community?.thumbnailUrl || "/images/Community.png"} alt="Community Image" />
                            </figure>
                            <figcaption>
                                <h4>{community?.title}</h4>
                                <p>{community?.description}</p>
                               
                                <ul>
                    {/*Like Button */}
                    <li
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        handleToggleLikes(
                          community.id,
                          community.isLiked === 1
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        <i
                          className={`fa ${
                            community.isLiked === 1
                              ? "fa-heart text-danger"
                              : "fa-heart-o"
                          }`}
                        ></i>
                      </span>{" "}
                      {community.likesCount}
                    </li>

                    {/* Comments */}
                    <li><span><img src="/images/Message.png" /> </span>{community.commentsCount}</li>
                  </ul>
                            </figcaption>

                            <div className="CommentBox">
                                <h4>Comments</h4>

                                <div className="form-group position-relative">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Add a Comment...."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="btn position-absolute"
                                    style={{
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "transparent"
                                    }}
                                    onClick={handleAddComment}
                                >
                                    <i className="fa fa-paper-plane text-primary"></i>
                                </button>
                                </div>


                                <ul>
                            {comments.map((item) => (
                                <li key={item.id}>
                                <figure>
                                    <img
                                    src={
                                        item.user?.profile_pic ||
                                        "/images/Profile.png"
                                    }
                                    alt={item.user?.fullname}
                                    />
                                </figure>

                                <figcaption>
                                    <h5>{item.user?.fullname}</h5>

                                    <p>{item.content}</p>

                                    <h6>
                                    <strong>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </strong>

                                    
                                    </h6>
                                </figcaption>

                                <aside>
                                    <span>
                                    <i
                                      onClick={() => handleToggleLike(item.id)}
                                       className={`fa ${
                                            item.isLiked ? "fa-heart text-danger" : "fa-heart-o"
                                        }`}
                                        aria-hidden="true"
                                    ></i>
                                    </span>
                                    <strong>{item.likeCount}</strong>
                                </aside>
                                </li>
                            ))}
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
