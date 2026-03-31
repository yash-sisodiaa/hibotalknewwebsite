import React from 'react';
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

const MentorSection = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const menteeId = user?.id;

  const [videos, setVideos] = useState([]);
  const [specializationsforvideos, setSpecializationsforvideos] = useState([]);
  const [activeSpecforvideo, setActiveSpecforvideo] = useState(null);

  const fetchVideos = async (specialization_id) => {
    const token = localStorage.getItem('token');
    const res = await api.get(`/mentee/mentors`, {
      params: { specialization_id, menteeId },

      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setVideos(res.data.mentors || []);
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

        const res = await api.get(`/getUserintrest/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('USER DATA', res.data.data);

        const specs = res.data.data.intrest || [];
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

  const handleWishlistToggle = async (mentorId, isLiked) => {

    try {
      if (isLiked) {
        await api.delete("/wishlist/remove", {
          data: {
            menteeId: menteeId,
            mentorId: mentorId
          }
        });
      } else {

        await api.post("/wishlist/add", {
          menteeId: menteeId,
          mentorId: mentorId
        });
      }
      fetchVideos(activeSpecforvideo);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }

  return (
    <>

      <div className="HistoryArea">
        <div className="HistoryHead">
          <h3>All mentors<Link to="/all-mentors">View all</Link> </h3>
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
            {
              videos.slice(0, 6).map((item) => (
                <div className="col-lg-2 col-md-3 col-sm-4" key={item.id}>
                  <Link to={`/my-mentor-details/${item.id}`} style={{ textDecoration: "none" }}>
                    <div className="ResourcesBox ">

                      <span className="Icon">
                        <i
                          onClick={(e) => {
                            e.preventDefault();
                            handleWishlistToggle(item.id, item.isLiked);
                          }}
                          className={`fa ${item.isLiked ? "fa-heart text-danger" : "fa-heart-o"
                            }`}
                          style={{
                            color: item.isLiked ? "red" : "#fff"
                          }}
                          aria-hidden="true"
                        ></i>
                      </span>

                      <figure>
                        <img src={item.profile_pic} />
                      </figure>
                      <figcaption>
                        <p>{item.fullname}</p>
                      </figcaption>
                    </div>
                  </Link>

                </div>))
            }

          </div>
        </div>
      </div>

    </>
  )
}

export default MentorSection
