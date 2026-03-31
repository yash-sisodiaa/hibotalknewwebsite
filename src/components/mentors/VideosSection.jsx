import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const VideosSection = ({ refresh }) => {

  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [specializationsforvideos, setSpecializationsforvideos] = useState([]);
  const [activeSpecforvideo, setActiveSpecforvideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // FETCH VIDEOS
  const fetchVideos = async (categoryId) => {
    try {

      if (!categoryId) return;

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get(`/resource/get-resources/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered = (res.data?.data || []).filter(
        (item) => item.resourceType === "video"
      );

      setVideos(filtered);

    } catch (err) {
      console.error("VIDEO FETCH ERROR", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH USER SPECIALIZATIONS
  useEffect(() => {
    const fetchUservideos = async () => {
      try {

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?.id) return;

        const res = await api.get(`/getUser/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const specs = res.data?.data?.specializations || [];

        setSpecializationsforvideos(specs);

        if (specs.length > 0) {
          setActiveSpecforvideo(specs[0].id);
        }

      } catch (err) {
        console.error(
          "USER FETCH ERROR 👉",
          err.response?.data || err.message
        );
      }
    };

    fetchUservideos();
  }, []);

  // WHEN CATEGORY CHANGE
  useEffect(() => {
    if (activeSpecforvideo) {
      fetchVideos(activeSpecforvideo);
    }
  }, [activeSpecforvideo, refresh]);

  return (
    <>
      <div className="HistoryArea">
        <div className="HistoryHead">
          <h3>
            My Video <Link to="/all-videos">View all</Link>
          </h3>

          <ul>
            {specializationsforvideos.map((item) => (
              <li key={item.id}>
                <button
                  className={activeSpecforvideo === item.id ? "active" : ""}
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

            {loading && <p style={{ padding: "0 15px" }}>Loading videos...</p>}

            {!loading &&
              videos.slice(0, 5).map((item) => (
                <div className="col-sm-2" key={`${item.id}-${activeSpecforvideo}`}>
                  <div
                    className="ResourcesBox"
                    onClick={() =>
                      navigate(`/resource-mentor-details/${item.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <figure>
                      <span className="Play">
                        <i className="fa fa-play"></i>
                      </span>

                      <img
                        src={item.thumbnailUrl || "/images/Program-1.png"}
                        alt={item.heading}
                      />
                    </figure>

                    <figcaption>
                      <p>{item.heading}</p>
                    </figcaption>
                  </div>
                </div>
              ))}

            {/* ADD VIDEO */}
            <div className="col-sm-3">
              <div
                className="AddBox"
                data-toggle="modal"
                data-target="#VideoModal"
              >
                <span>+</span>
                <p>Add Video</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default VideosSection;