import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';

const CommunitySection = () => {

    const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Recent Communities
  const fetchMyCommunities = async () => {
    try {
      const res = await api.get(
        `/community/recent?userId=${user?.id}&userType=${user?.user_type}`
      );

      setCommunities(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyCommunities();
    }
  }, []);

  //  Like Toggle
  const handleToggleLike = async (communityId, isLiked) => {
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

      // Update UI without refresh
      setCommunities((prev) =>
        prev.map((item) =>
          item.id === communityId
            ? {
                ...item,
                isLiked: isLiked ? 0 : 1,
                likesCount: isLiked
                  ? item.likesCount - 1
                  : item.likesCount + 1,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Like toggle failed", error);
    }
  };

  return (
    <>
    <div  className="HistoryArea">
                    <div  className="HistoryHead">
                        <h3>All Community Highlights  <Link to="/all-community">View all</Link> </h3> 
                    </div>
                    <div  className="HistoryBody">
                        <div  className="row">
                            {communities.slice(0, 6).map((item) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6"
              key={item.id}
            >
              <div
                className="CommunityBox"
                onClick={() =>
                  navigate(`/community-mentor-details/${item.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <h3>
                  <span className="Icon">
                    <img src={item.thumbnailUrl} alt="" />
                  </span>

                  <span className="Name">
                    {item?.mentor?.fullname}
                  </span>

                  <span className="Time">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </h3>

                <figcaption>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <h6>#Updatealert</h6>

                  <ul>
                    {/*Like Button */}
                    <li
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        handleToggleLike(
                          item.id,
                          item.isLiked === 1
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        <i
                          className={`fa ${
                            item.isLiked === 1
                              ? "fa-heart text-danger"
                              : "fa-heart-o"
                          }`}
                        ></i>
                      </span>{" "}
                      {item.likesCount}
                    </li>

                    {/* Comments */}
                    <li><span><img src="/images/Message.png" /> </span>{item.commentsCount}</li>
                  </ul>
                </figcaption>
              </div>
            </div>
          ))}
                            
                        <div className="col-lg-3 col-md-4 col-sm-6">
                        <div
                        className="AddBox"
                        data-toggle="modal"
                        data-target="#CommunityModal"
                        >
                        <span>+</span>
                        <p>Add Community</p>
                        </div>
                    </div>

                    </div>
                </div>
                </div>
    </>
  )
}

export default CommunitySection
