import React, { useState } from 'react'
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import $ from "jquery";
import AuthModals from '../components/AuthModals';
import api from '../api/axiosInstance';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([{ resources: [] }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mentors, setMentors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("mentor");

  const handleSearchNavigate = (e) => {

    if (!homeSearchQuery.trim()) {
      alert("Please enter something to search");
      return;
    }

    navigate('/course-and-mentor', { state: { searchQuery: homeSearchQuery, searchType } });
  };


  //   useEffect(() => {

  //   // Mentor → Dashboard
  //   $("#Mentor .myButton").on("click", function (e) {
  //     e.preventDefault();
  //     window.location.href = "/my-dashboard-mentor";
  //   });

  //   $("#Mentee .myButton").on("click", function (e) {
  //     e.preventDefault();
  //     window.location.href = "/my-dashboard-mentee.html";
  //   });

  //   $("#MentorModal .myButton").on("click", function (e) {
  //     e.preventDefault();
  //     window.location.href = "/my-dashboard-mentor.html";
  //   });

  //   $("#MenteeModal .myButton").on("click", function (e) {
  //     e.preventDefault();
  //     window.location.href = "/my-dashboard-mentee.html";
  //   });

  //   // Program tab active
  //   $(".ProgramArea .ProgramHead ul li button").on("click", function () {
  //     $(".ProgramArea .ProgramHead ul li button").removeClass("active");
  //     $(this).addClass("active");
  //   });

  //   // 🧹 CLEANUP (VERY IMPORTANT)
  //   return () => {
  //     $("#Mentor .myButton").off("click");
  //     $("#Mentee .myButton").off("click");
  //     $("#MentorModal .myButton").off("click");
  //     $("#MenteeModal .myButton").off("click");
  //     $(".ProgramArea .ProgramHead ul li button").off("click");
  //   };

  // }, []);



  /////////////main api's///////////////

  useEffect(() => {
    const fetchPrograms = async () => {

      try {
        const response = await api.get("/resource/resourceforweb");

        const programs = Array.isArray(response.data.data) ? response.data.data : [];
        // Sort categories by totalResources descending (highest first)
        programs.sort((a, b) => (b.totalResources || 0) - (a.totalResources || 0));

        setData(programs);
        setActiveIndex(0);

      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, [])


  useEffect(() => {
    api
      .get("/review/highestrating")
      .then((res) => {
        if (res.data.success) {
          setMentors(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);


  useEffect(() => {
    api
      .get("/review/getTestimonials")
      .then((res) => {
        if (res.data.success) {
          setTestimonials(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);



  // Program Carousel Initialization
  useEffect(() => {
    if (data[activeIndex].resources.length === 0) return;

    const $slider = $('#ProgramSlider');

    try {
      if ($slider.hasClass('owl-carousel')) {
        $slider.trigger('destroy.owl.carousel');
        $slider.find('.owl-stage-outer').children().unwrap();
        $slider.removeClass('owl-loaded');
      }
    } catch (err) {
      console.warn("Carousel destroy skipped", err);
    }

    $slider.owlCarousel({
      loop: false,
      margin: 20,
      dots: true,
      autoplay: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    });
  }, [data, activeIndex]);



  useEffect(() => {
    if (mentors.length > 0) {
      const timer = setTimeout(() => {
        const $slider = $('#InspiresSlider');

        if ($slider.length) {
          try {
            // Proper destroy
            if ($slider.hasClass('owl-loaded')) {
              $slider.trigger('destroy.owl.carousel');
              $slider.removeClass('owl-loaded');
              $slider.html($slider.find('.item')); // reset content safely
            }
          } catch (err) {
            console.log("Destroy error:", err);
          }

          // Init again
          $slider.owlCarousel({
            loop: true, // 👈 force enable
            margin: 20,
            dots: true,
            nav: false,
            autoplay: true,
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 3 } //  change from 4 to 3
            }
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [mentors]);

  //console.log("mentor", mentors.length)

  useEffect(() => {
    if (testimonials.length > 0) {
      setTimeout(() => {
        if ($('#Testimonials').length) {
          if ($('#Testimonials').hasClass('owl-carousel')) {
            $('#Testimonials').trigger('destroy.owl.carousel');
          }

          $('#Testimonials').owlCarousel({
            loop: true,
            margin: 20,
            //nav: true,
            // navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
            //dots: true,
            autoplay: true,
            responsive: {
              0: { items: 1 },
              600: { items: 1 },
              1000: { items: 3 }
            }
          });
        }
      }, 50);
    }
  }, [testimonials]);








  return (
    <>

      <Header />

      <section>
        <div className="SlideArea">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="SlideLeft">
                  <h1>Unleashing potential, one connection at a time </h1>
                  <p>It’s about igniting dreams, breaking silences, and opening doors that once felt closed.
                    The app that makes mentorship accessible and human.</p>
                  <Link href="javascript:void(0);" data-toggle="modal" data-target="#RegisterModal">
                    Start Mentoring
                    <img src="/images/arrow.png" />
                  </ Link >
                </div>
              </div>

              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="SlideRight">
                  <img src="/images/Slide.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="FilterArea">
          <div className="FilterBox">
            <span className="Icon"><img src="/images/search.png" /> </span>

            <input
              type="text"
              placeholder="Search for mentors,courses…"
              value={homeSearchQuery}
              onChange={(e) => setHomeSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchNavigate()}
            />

            {/* Radio buttons: Mentor / Course */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", whiteSpace: "nowrap", transform: "translateY(5px)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontWeight: searchType === 'mentor' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="searchType"
                  value="mentor"
                  checked={searchType === 'mentor'}
                  onChange={() => setSearchType('mentor')}
                />
                Mentor
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontWeight: searchType === 'course' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="searchType"
                  value="course"
                  checked={searchType === 'course'}
                  onChange={() => setSearchType('course')}
                />
                Course
              </label>
            </div>

            <button type="button" className="FilterSearchBtn" onClick={handleSearchNavigate}>Search</button>
            {/* <div className="dropdown-menu">
                        <article>
                            <h3>Filters</h3>
                        </article>
                        <article>
                            <aside>
                                <h6>Filter by categories</h6>
                                <ul>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Subject</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Ratings</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Availability</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Price</span>
                                    </li>
                                </ul>
                            </aside>
                            <aside>
                                <h6>Filter by language</h6>
                                <ul>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>English</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>French</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Spanish</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name=""/>
                                        <span>Portuguese</span>
                                    </li>
                                </ul>
                            </aside>
                            <aside>
                                <h6>Sort By</h6>
                                <ol>
                                    <li>
                                        <label className="Radio">Newest to oldest
                                            <input type="radio" name="sort"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                    <li>
                                        <label className="Radio">Highest to lowest
                                            <input type="radio" name="sort"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                    <li>
                                        <label className="Radio">Lowest to highest
                                            <input type="radio" name="sort"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                    <li>
                                        <label className="Radio">Most Recents
                                            <input type="radio" name="sort"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                </ol>
                            </aside>
                            <aside>
                                <button>Apply</button>
                            </aside>
                        </article>
                    </div> */}
          </div>
        </div>
      </section>

      <section>
        <div className="ProgramArea">
          <div className="container-fluid">

            {/* Category Buttons */}
            <div className="ProgramHead" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <h2>Explore Inspiring Mentoring Programs</h2>
                <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0 }}>
                  {data.slice(0, 7).map((cat, i) => (
                    <li key={cat.id}>
                      <button
                        className={i === activeIndex ? "active" : ""}
                        onClick={() => setActiveIndex(i)}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View All Button */}


            </div>

            {/* Program Carousel */}
            <div className="ProgramBody">
              <div id="demos">
                <div className="owl-carousel owl-theme" id="ProgramSlider" key={activeIndex}>
                  {data[activeIndex].resources.slice(0, 5).map((res) => (
                    <div className="item" key={res.id}>
                      <div className="ProgramBox">
                        <Link to={`/program-resource/${res.id}`}>
                          <figure className={!(res.resourceType === 'video' || res.thumbnailUrl) ? "NoThumbnail" : ""}>
                            {/* Resource Type Icon */}
                            {/* FILE ICONS */}
                            {(res.resourceType === 'pdf' || res.resourceType === 'ppt' || res.resourceType === 'doc') && (
                              <div className="OnlyIcon">
                                {res.resourceType === 'pdf' && (
                                  <i className="fa fa-file-pdf-o PdfIcon"></i>
                                )}
                                {res.resourceType === 'ppt' && (
                                  <i className="fa fa-file-powerpoint-o PptIcon"></i>
                                )}
                                {res.resourceType === 'doc' && (
                                  <i className="fa fa-file-word-o DocIcon"></i>
                                )}
                              </div>
                            )}

                            {/* VIDEO PLAY ICON */}
                            {res.resourceType === 'video' && (
                              <span className="Play">
                                <i className="fa fa-play"></i>
                              </span>
                            )}



                            {/* Thumbnail */}
                            {(res.resourceType === 'video' || res.thumbnailUrl) && (
                              <img
                                src={res.thumbnailUrl || "/images/Program-1.png"}
                                alt={res.heading}
                              />
                            )}
                          </figure>

                          <figcaption>
                            <h6>
                              {res.totalViews} {res.totalViews <= 1 ? "view" : "views"}
                            </h6>
                            <h5>
                              {res.heading}
                            </h5>
                            <p>{res.mentor?.fullname || "Unknown Mentor"}</p>
                          </figcaption>
                        </Link>

                      </div>

                    </div>

                  ))}
                </div>

              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/all-categories" state={{ activeIndex }}>
                  <button type="button" className="FilterSearchBtn">View All</button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>




      <section>
        <div className="InspiresArea">
          <div className="container-fluid">
            <div className="InspiresHead">
              <h2>Mentorship That Inspires</h2>
              <p>
                Our mentors are the driving force behind our growth and vision. With their wisdom, <br />
                experience, and unwavering guidance, they empower us to learn, lead, and achieve excellence
                every day.
              </p>
            </div>
            <div className="InspiresBody">

              <div id="demos">
                <div className="owl-carousel owl-theme" id="InspiresSlider" key={mentors.length}>
                  {mentors.map((item) => {
                    const maxVisibleSpecs = 4;
                    const extraSpecs = item.mentor.specializationNames.length - maxVisibleSpecs;

                    return (
                      <div className="item" key={item.mentor.id}>
                        <Link to={`/mentor-profile-home/${item.mentor.id}`}
                          state={{ avgRating: item.avgRating }}
                        >
                          <div className="InspiresBox">
                            <figure>
                              <img src={item.mentor.profile_pic} alt={item.mentor.fullname} />
                            </figure>
                            <figcaption>
                              <span className="Rating">
                                {Number(item.avgRating).toFixed(1)}{" "}
                                <i className="fa fa-star" aria-hidden="true"></i>
                              </span>
                              <h3>
                                {item.mentor.fullname}
                              </h3>
                              <p>{item.latestComment}</p>
                              <ul>
                                {item.mentor.specializationNames.slice(0, maxVisibleSpecs).map((spec, i) => (
                                  <li key={i}>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                                {extraSpecs > 0 && (
                                  <li>
                                    <span>+{extraSpecs} more</span>
                                  </li>
                                )}
                              </ul>
                            </figcaption>
                          </div>
                        </Link>

                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", }}>
                <Link to="/mentors">
                  <button type="button" className="FilterSearchBtn">View All</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section>
        <div className="TestimonialArea">
          <div className="container-fluid">
            <div className="TestimonialHead">
              <h3>Testimonials</h3>
              <p>
                Each mentor not only shares their expertise but also inspires <br />
                confidence, clarity, and purpose.
              </p>
            </div>

            <div className="TestimonialBody">
              <div id="demos">
                <div className="owl-carousel owl-theme" id="Testimonials">

                  {testimonials.map((item, index) => (
                    <div className="item" key={index}>
                      <div className="TestimonialBox">

                        <article>
                          {[...Array(item.rating)].map((_, i) => (
                            <i key={i} className="fa fa-star" aria-hidden="true"></i>
                          ))}

                          <p>
                            "{item.comment}"
                          </p>
                        </article>

                        <aside>
                          <span className="Icon">
                            <img src={item.mentee.profile_pic} />
                          </span>

                          <h3>{item.mentee.fullname}</h3>
                          <p>
                            {(item.experience || "Mentee")
                              .split(" ")
                              .slice(0, 5)
                              .join(" ")}
                            {(item.experience || "Mentee").split(" ").length > 5 && "..."}
                          </p>
                        </aside>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section>
        <div className="FAQArea">
          <div className="container-fluid">
            <h3>Frequently Asked Questions</h3>
            <div id="accordion">
              <div className="card">
                <div className="card-header collapsed" data-toggle="collapse" href="#collapseOne">
                  <h6>How do I book a session?</h6>
                </div>
                <div id="collapseOne" className="collapse" data-parent="#accordion">
                  <div className="card-body">
                    <div className="FAQContent">
                      <p>You can book a session with any mentor by searching for them or selecting from All Mentors </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header collapsed" data-toggle="collapse" href="#collapseTwo">
                  <h6>How do I give a rating to a mentor?</h6>
                </div>
                <div id="collapseTwo" className="collapse" data-parent="#accordion">
                  <div className="card-body">
                    <div className="FAQContent">
                      <p>After successfully completing a session, you can give a rating to the mentor. </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header collapsed" data-toggle="collapse" href="#collapseThree">
                  <h6>Why can’t I post in the community?</h6>
                </div>
                <div id="collapseThree" className="collapse" data-parent="#accordion">
                  <div className="card-body">
                    <div className="FAQContent">
                      <p>Only mentors are allowed to post in the community.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header collapsed" data-toggle="collapse" href="#collapseFour">
                  <h6>Why can’t I start a session?</h6>
                </div>
                <div id="collapseFour" className="collapse" data-parent="#accordion">
                  <div className="card-body">
                    <div className="FAQContent">
                      <p>You can start your session 15 minutes before the scheduled session time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="button" className="FilterSearchBtn" onClick={() => navigate('/faq')}>
                View All
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="GuidanceArea">
          <div className="container-fluid">
            <div className="GuidanceBox">
              <div className="row">
                <div className="col-sm-8">
                  <div className="GuidanceLeft">
                    <h3>Learn from Experts. Grow with Guidance</h3>
                    <p>HiboTalk is a mentorship platform offering video learning and live one-to-one
                      sessions with experienced mentors.</p>
                    <ul>
                      <li>
                        <Link href="javascript:void(0)"><img src="/images/Download-1.png" /> </ Link >
                      </li>
                      <li>
                        <Link href="javascript:void(0)"><img src="/images/Download-2.png" /> </ Link >
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="GuidanceRight">
                    <img src="/images/Phone.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModals />
    </>
  )
}

export default Home;
