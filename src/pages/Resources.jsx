import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'
import api from '../api/axiosInstance'
import { Link, useLocation } from 'react-router-dom'



const Resources = () => {

  const [resources, setResources] = useState([])
  const [search, setSearch] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")

  const location = useLocation();
  const mentorId = location.state?.mentorId;

  useEffect(() => {
    getResources()
  }, [mentorId])

  const getResources = async () => {
    try {

      let url = '/resource/allresource';

      // agar mentorId aaya hai to query me add karo
      if (mentorId) {
        url += `?mentorId=${mentorId}`;
      }

      const res = await api.get(url);
      setResources(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.heading?.toLowerCase().includes(search.toLowerCase()) ||
      item.subHeading?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType ? item.resourceType === selectedType : true;
    return matchesSearch && matchesType;
  })

  return (
    <>
      <Header />

      <section>
        <div className="BreadcumArea">
          <h2>Resources</h2>
        </div>
      </section>

      <section>
        <div className="MentorsArea">
          <div className="container-fluid">

            <div className="TitleBox">
              <div className="SearchBox d-flex align-items-center gap-3 position-relative">
                <span><img src="/images/search.png" /></span>

                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filter Dropdown (same as all-mentors page) */}
                <div className="dropdown">
                  <a
                    href="javascript:void(0)"
                    className="dropdown-toggle d-flex align-items-center justify-content-center"
                    onClick={() => setFilterOpen(prev => !prev)}
                  >
                    <img
                      src="/images/filter.png"
                      alt="Filter"
                      style={{ height: "32px", width: "32px", cursor: "pointer" }}
                    />
                  </a>

                  {filterOpen && (
                    <div
                      className="dropdown-menu show shadow border-0 rounded-3 p-4"
                      style={{
                        minWidth: "300px",
                        maxWidth: "340px",
                        marginTop: "8px",
                        right: 0,
                        left: "auto",
                        zIndex: 1050
                      }}
                    >
                      <h5 className="fw-bold mb-3 text-dark">Filters</h5>

                      {/* Filter by resource type */}
                      <div className="mb-4">
                        <h6 className="fw-semibold text-muted small mb-2">Filter by Type</h6>
                        <div className="ps-4">
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="resourceType"
                              id="filter-all"
                              checked={selectedType === ""}
                              onChange={() => setSelectedType("")}
                            />
                            <label className="form-check-label" htmlFor="filter-all">
                              All
                            </label>
                          </div>

                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="resourceType"
                              id="filter-video"
                              checked={selectedType === "video"}
                              onChange={() => setSelectedType("video")}
                            />
                            <label className="form-check-label" htmlFor="filter-video">
                              Video
                            </label>
                          </div>

                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="resourceType"
                              id="filter-pdf"
                              checked={selectedType === "pdf"}
                              onChange={() => setSelectedType("pdf")}
                            />
                            <label className="form-check-label" htmlFor="filter-pdf">
                              PDF
                            </label>
                          </div>

                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="resourceType"
                              id="filter-ppt"
                              checked={selectedType === "ppt"}
                              onChange={() => setSelectedType("ppt")}
                            />
                            <label className="form-check-label" htmlFor="filter-ppt">
                              PPT
                            </label>
                          </div>

                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="resourceType"
                              id="filter-doc"
                              checked={selectedType === "doc"}
                              onChange={() => setSelectedType("doc")}
                            />
                            <label className="form-check-label" htmlFor="filter-doc">
                              Document
                            </label>
                          </div>
                        </div>
                      </div>

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

              </div>
            </div>

            <div className="row">

              {filteredResources.map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6" key={item.id}>

                  <div className="ProgramBox">
                    <Link to={`/program-resource/${item.id}`}>
                      <figure className={!(item.resourceType === 'video' || item.thumbnailUrl) ? "NoThumbnail" : ""}>

                        {/* FILE ICONS */}
                        {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                          <div className="OnlyIcon">

                            {item.resourceType === 'pdf' && (
                              <i className="fa fa-file-pdf-o PdfIcon"></i>
                            )}

                            {item.resourceType === 'ppt' && (
                              <i className="fa fa-file-powerpoint-o PptIcon"></i>
                            )}

                            {item.resourceType === 'doc' && (
                              <i className="fa fa-file-word-o DocIcon"></i>
                            )}

                          </div>
                        )}

                        {/* VIDEO PLAY ICON */}
                        {item.resourceType === 'video' && (
                          <span className="Play">
                            <i className="fa fa-play"></i>
                          </span>
                        )}

                        {/* THUMBNAIL */}
                        {(item.resourceType === 'video' || item.thumbnailUrl) && (
                          <img
                            src={item.thumbnailUrl ? item.thumbnailUrl : "/images/Program-1.png"}
                            alt="resource"
                          />
                        )}

                      </figure>



                      <figcaption>

                        <h6>
                          Resource <span>{item.resourceType}</span>
                        </h6>

                        <h5>
                          <a>
                            {item.heading || "Untitled Resource"}
                          </a>
                        </h5>

                        <p>{item.subHeading}</p>

                      </figcaption>
                    </Link>
                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AuthModals />

    </>
  )
}

export default Resources
