import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModals from "../components/AuthModals";
import api from '../api/axiosInstance';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Mentors = () => {
  const location = useLocation();
  const initialSearch = location.state?.searchQuery || "";
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    getMentors();
  }, []);

  const getMentors = async () => {
    try {
      const res = await api.get("/review/allMentors");
      if (res.data.success) {
        setMentors(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    const searchTerm = search.toLowerCase();
    const fullname = m.mentor?.fullname?.toLowerCase() || '';

    // Join the array into a single string for easy searching
    const specializations = m.mentor?.specializationNames?.some((spec) =>
      spec.toLowerCase().includes(searchTerm)
    ) || false;

    const experience = m.mentor?.experience?.toLowerCase() || '';

    return (
      fullname.includes(searchTerm) ||
      specializations ||
      experience.includes(searchTerm)
    );
  });

  return (
    <>
      <Header />

      <section>
        <div className="BreadcumArea">
          <h2>Mentors</h2>
        </div>
      </section>

      <section>
        <div className="MentorsArea">
          <div className="container-fluid">
            <div className="TitleBox">
              <div className="SearchBox">
                <span>
                  <img src="/images/search.png" alt="" />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              {filteredMentors.map((item) => (
                <div className="col-xl-4 col-md-6 col-sm-6" key={item.mentorId}>

                  <Link to={`/mentor-profile-home/${item.mentor.id}`} state={{ avgRating: item.avgRating }}>
                    <div className="InspiresBox"  >

                      <figure>
                        <img
                          src={item.mentor.profile_pic || "/images/default-profile.png"}
                          alt=""
                        />
                      </figure>

                      <figcaption>
                        <span className="Rating">
                          {parseFloat(item.avgRating || 0).toFixed(1)}
                          <i className="fa fa-star"></i>
                        </span>

                        <h3>{item.mentor.fullname}</h3>

                        <p>{item.mentor.experience}</p>

                        <ul>
                          {(() => {
                            const specializationNames = Array.isArray(
                              item?.mentor?.specializationNames
                            )
                              ? item.mentor.specializationNames
                              : [];

                            const maxVisibleSpecs = 4;
                            const extraSpecs = Math.max(
                              0,
                              specializationNames.length - maxVisibleSpecs
                            );

                            return (
                              <>
                                {specializationNames
                                  .slice(0, maxVisibleSpecs)
                                  .map((spec, i) => (
                                    <li key={i}>
                                      <span>{spec}</span>
                                    </li>
                                  ))}

                                {extraSpecs > 0 && (
                                  <li>
                                    <span>+{extraSpecs} more</span>
                                  </li>
                                )}
                              </>
                            );
                          })()}
                        </ul>
                      </figcaption>

                    </div>
                  </Link>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AuthModals />
    </>
  );
};

export default Mentors;
