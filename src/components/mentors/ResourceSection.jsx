import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const ResourceSection = ({ refresh }) => {

  const navigate = useNavigate();

  const [specializations, setSpecializations] = useState([]);
  const [activeSpec, setActiveSpec] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET USER + SPECIALIZATIONS
  useEffect(() => {
    const fetchUser = async () => {
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

        setSpecializations(specs);

        if (specs.length > 0) {
          setActiveSpec(specs[0].id);
        }

      } catch (err) {
        console.error(
          "USER FETCH ERROR 👉",
          err.response?.data || err.message
        );
      }
    };

    fetchUser();
  }, []);

  // FETCH RESOURCES
  const fetchResources = async (categoryId) => {
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
        (item) =>
          item.resourceType === "pdf" ||
          item.resourceType === "ppt" ||
          item.resourceType === "doc"
      );

      setResources(filtered);

    } catch (err) {
      console.error(
        "RESOURCE FETCH ERROR",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ACTIVE SPEC CHANGE
  useEffect(() => {
    if (activeSpec) {
      fetchResources(activeSpec);
    }
  }, [activeSpec, refresh]);

  return (
    <>
      <div className="HistoryArea">
        <div className="HistoryHead">
          <h3>
            My Resources <Link to="/all-resources">View all</Link>
          </h3>

          <ul>
            {specializations.map((item) => (
              <li key={item.id}>
                <button
                  className={activeSpec === item.id ? "active" : ""}
                  onClick={() => setActiveSpec(item.id)}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="HistoryBody">
          <div className="row">

            {loading && <p>Loading resources...</p>}

            {!loading &&
              resources.slice(0, 5).map((item) => (
                <div className="col-sm-2" key={`${item.id}-${activeSpec}`}>
                  <div
                    className="ResourcesBox"
                    onClick={() =>
                      navigate(`/resource-mentor-details/${item.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <figure>

                      {(item.resourceType === "pdf" ||
                        item.resourceType === "ppt" ||
                        item.resourceType === "doc") && (
                          <div className="OnlyIcon">

                            {item.resourceType === "pdf" && (
                              <i
                                className="fa fa-file-pdf-o PdfIcon"
                                aria-hidden="true"
                              ></i>
                            )}

                            {item.resourceType === "ppt" && (
                              <i
                                className="fa fa-file-powerpoint-o PptIcon"
                                aria-hidden="true"
                              ></i>
                            )}

                            {item.resourceType === "doc" && (
                              <i
                                className="fa fa-file-word-o DocIcon"
                                aria-hidden="true"
                              ></i>
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

            {/* ADD RESOURCE */}
            <div className="col-sm-3">
              <div
                className="AddBox"
                data-toggle="modal"
                data-target="#ResourcesModal"
              >
                <span>+</span>
                <p>Add Resources</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceSection;