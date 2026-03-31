import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation';
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';
import { useNavigate } from 'react-router-dom';

const All_Mentors = () => {
  const Navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const menteeId = user?.id;

  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");


  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await api.get(`/mentee/mentors`, {
        params: {
          menteeId,
          searchTerm,
          category: selectedCategory,
          sort: selectedSort
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMentors(res.data.mentors || []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMentors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, selectedSort]);

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
      fetchMentors();
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }

  return (
    <div>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Our Mentors</h3>

            <div className="SearchBox d-flex align-items-center gap-3 position-relative">
              {/* Filter Dropdown */}
              <div className="dropdown">
                <a
                  href="javascript:void(0)"
                  className="dropdown-toggle d-flex align-items-center justify-content-center"
                  onClick={() => setFilterOpen(prev => !prev)}
                >
                  <img
                    src="images/filter.png"
                    alt="Filter"
                    style={{ height: "32px", width: "32px", cursor: "pointer" }}
                  />
                </a>

                {filterOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-end show shadow border-0 rounded-3 p-4"
                    style={{
                      minWidth: "300px",
                      maxWidth: "340px",
                      marginTop: "8px",
                      zIndex: 1050
                    }}
                  >
                    <h5 className="fw-bold mb-3 text-dark">Filters</h5>

                    {/* Filter by categories */}
                    <div className="mb-4">
                      <h6 className="fw-semibold text-muted small mb-2">Filter by categories</h6>
                      <div className="ps-4">  {/* ← yahan se right shift start */}
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="filter-subject"
                            checked={selectedCategory === "subject"}
                            onChange={() => {
                              setSelectedCategory("subject");
                              setSelectedSort("");
                            }}
                          />
                          <label className="form-check-label" htmlFor="filter-subject">
                            Subject
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="filter-ratings"
                            checked={selectedCategory === "ratings"}
                            onChange={() => {
                              setSelectedCategory("ratings");
                              setSelectedSort("");
                            }}
                          />
                          <label className="form-check-label" htmlFor="filter-ratings">
                            Ratings
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Sort By - right aligned feel */}
                    {selectedCategory && (
                      <div className="mb-4">
                        <h6 className="fw-semibold text-muted small mb-2">Sort By</h6>
                        <div className="ps-8">  {/* ← right shift for radio buttons */}
                          {selectedCategory === "subject" && (
                            <>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sort"
                                  id="sort-oldest"
                                  value="oldest"
                                  checked={selectedSort === "oldest"}
                                  onChange={(e) => setSelectedSort(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="sort-oldest">
                                  Old to new
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sort"
                                  id="sort-newest"
                                  value="newest"
                                  checked={selectedSort === "newest"}
                                  onChange={(e) => setSelectedSort(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="sort-newest">
                                  Most Recent
                                </label>
                              </div>
                            </>
                          )}

                          {selectedCategory === "ratings" && (
                            <>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sort"
                                  id="sort-high"
                                  value="high"
                                  checked={selectedSort === "high"}
                                  onChange={(e) => setSelectedSort(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="sort-high">
                                  High to low
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sort"
                                  id="sort-low"
                                  value="low"
                                  checked={selectedSort === "low"}
                                  onChange={(e) => setSelectedSort(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="sort-low">
                                  Low to high
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <div className="text-end mt-3">
                      <button
                        className="btn px-5 py-2 rounded-pill fw-medium"
                        style={{ backgroundColor: "#00E6D2", color: "#09090B" }}
                        onClick={() => setFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sirf YEH EK search input */}
              <input
                type="text"
                placeholder="Search mentors...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>



          <div className="row">
            {mentors.map((mentor) => (
              <div
                className="col-xl-4 col-lg-6 col-md-6 col-sm-6"
                key={mentor.id}
                onClick={() => Navigate(`/my-mentor-details/${mentor.id}`)}
                style={{ cursor: "pointer" }}
              >

                <div className="MontorBox">
                  <span className="Icon new">
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(mentor.id, mentor.isLiked);
                      }}
                      className={`fa ${mentor.isLiked ? "fa-heart text-danger" : "fa-heart-o"
                        }`}
                      aria-hidden="true"
                    ></i>
                  </span>
                  <figure>
                    <img
                      src={
                        mentor.profile_pic ||
                        "/images/default-profile.png"
                      }
                      alt={mentor.fullname}
                    />
                  </figure>

                  <h3>
                    <Link to={`/mentor-details/${mentor.id}`}>
                      {mentor.fullname}
                    </Link>
                  </h3>

                  <h5>{mentor.specializations}</h5>

                  <h6>
                    Experience: {mentor.experience}
                  </h6>

                  <p>
                    Qualification: {mentor.qualification}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {mentors.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No mentors found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default All_Mentors;
