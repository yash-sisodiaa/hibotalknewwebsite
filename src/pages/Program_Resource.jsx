import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'
import api from '../api/axiosInstance'
import $ from "jquery";

const Program_Resource = () => {

  const isLoggedIn = !!localStorage.getItem("token");

  const { id } = useParams()
  const [resource, setResource] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)



  const fetchResource = useCallback(async () => {
    try {
      const res = await api.get(`/resource/resource/${id}`)
      if (res.data.success) {
        setResource(res.data.data)
        // Fetch reviews for the mentor
        const mentorId = res.data.data.mentorId
        const reviewRes = await api.get(`/review/mentor/${mentorId}`)
        //console.log("mentorId",mentorId)
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.data)
        }
      }
    } catch (error) {
      console.error("Error fetching resource:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleDownload = () => {
    const token = localStorage.getItem("token");
    if (token) {
      window.open(resource.fileUrl, '_blank');
    } else {
      $('#LoginModal').modal('show');
    }
  }

  useEffect(() => {
    fetchResource()
  }, [id, fetchResource])

  useEffect(() => {
    if (reviews.length > 0) {
      setTimeout(() => {
        const slider = $("#Student")

        if (slider.hasClass("owl-loaded")) {
          slider.trigger("destroy.owl.carousel")
          slider.removeClass("owl-loaded")
          slider.find(".owl-stage-outer").children().unwrap()
        }

        slider.owlCarousel({
          loop: true,
          margin: 20,
          nav: true,
          dots: true,
          autoplay: true,
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1200: { items: 3 }
          }
        })
      }, 200)
    }
  }, [reviews])


  if (!resource) return <p></p>

  const mentor = resource.mentor

  return (
    <>
      <Header />

      <section>
        <div className="DetailsArea">
          <div className="container-fluid">
            <div className="row">
              {/* LEFT SIDE (Preview Section) */}
              <div className="col-lg-6 col-md-12">
                <div className="DetailsLeft">
                  {/* VIDEO */}
                  {resource.resourceType === "video" && (
                    isLoggedIn ? (
                      <video controls width="100%" poster={resource.thumbnailUrl}>
                        <source src={resource.fileUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <div
                        style={{ position: "relative", cursor: "pointer" }}
                        onClick={() => $('#LoginModal').modal('show')}
                      >
                        <img
                          src={resource.thumbnailUrl}
                          alt="preview"
                          style={{ width: "100%", filter: "blur(1px)" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          🔒 Login to watch
                        </div>
                      </div>
                    )
                  )}

                  {/* PDF */}
                  {resource.resourceType === "pdf" && (
                    isLoggedIn ? (
                      <iframe
                        src={resource.fileUrl}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <div
                        style={{ position: "relative", height: "500px", cursor: "pointer" }}
                        onClick={() => $('#LoginModal').modal('show')}
                      >
                        <iframe
                          src={resource.fileUrl}
                          title="PDF Preview"
                          width="100%"
                          height="500px"
                          style={{ pointerEvents: "none", filter: "blur(1.5px)" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "black",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          🔒 Login to view PDF
                        </div>
                      </div>
                    )
                  )}

                  {["ppt", "doc"].includes(resource.resourceType) && (
                    <div
                      style={{
                        position: "relative",
                        height: "500px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: !isLoggedIn ? "pointer" : "default"
                      }}
                      onClick={() => {
                        if (!isLoggedIn) {
                          $('#LoginModal').modal('show');
                        }
                      }}
                    >

                      {/* BACKGROUND IMAGE */}
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${resource.resourceType === "ppt"
                            ? "/images/img-ppt.png"
                            : "/images/img-doc.png"
                            })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",


                        }}
                      />

                      {/* ICON */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          fontSize: "40px",
                          opacity: 0.3,
                          zIndex: 2
                        }}
                      >
                        <i className={`fa ${resource.resourceType === "ppt"
                          ? "fa-file-powerpoint-o"
                          : "fa-file-word-o"
                          }`} />
                      </div>

                      {/* LOCK OVERLAY */}
                      {!isLoggedIn && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.4)",
                            zIndex: 3
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "black",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            🔒 Login to view {resource.resourceType.toUpperCase()}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE (Details Section) */}
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="DetailsRight">
                  <h3>{resource.heading}</h3>

                  <h6>
                    {mentor?.fullname}
                  </h6>

                  <h4>About the Resource</h4>
                  <p>{resource.description}</p>

                  <h4>Details</h4>
                  <ul>
                    <li>Type: {resource.resourceType}</li>
                    <li>
                      Created:{" "}
                      {new Date(
                        resource.createdAt
                      ).toLocaleDateString()}
                    </li>
                    <li>
                      Language: English
                    </li>
                    <li>
                      Access: Lifetime Access
                    </li>
                  </ul>

                  {/* Download Button */}
                  <button
                    className="btn btn-success mt-3"
                    onClick={handleDownload}
                  >
                    Download Resource
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section>
        <div className="TestimonialArea Student">
          <div className="container-fluid">
            <div className="TestimonialHead">
              <h4>Student Reviews</h4>
            </div>

            <div className="TestimonialBody">
              {reviews.length > 0 ? (
                <div id="demos">
                  <div className="owl-carousel owl-theme" id="Student">
                    {reviews.map((review) => (
                      <div className="item" key={review.id}>
                        <div className="TestimonialBox">
                          <article>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i
                                key={i}
                                className={`fa fa-star ${i < review.rating ? "text-warning" : "text-secondary"}`}
                              />
                            ))}
                            <p>"{review.comment}"</p>
                          </article>
                          <aside>
                            <span className="Icon">
                              <img
                                src={review.mentee?.profile_pic || "/images/Profile.png"}
                                alt={review.mentee?.fullname}
                              />
                            </span>
                            <h3>{review.mentee?.fullname || "Anonymous"}</h3>
                            <p>{(review.experience || "Mentee")
                              .split(" ")
                              .slice(0, 5)
                              .join(" ")}
                              {(review.experience || "Mentee").split(" ").length > 5 && "..."}</p>
                          </aside>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <AuthModals />
    </>
  )
}

export default Program_Resource
