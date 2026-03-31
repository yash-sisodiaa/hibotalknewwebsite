import React, { useState } from 'react'
import { useEffect } from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'
import AuthModals from '../components/AuthModals'
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useLocation } from 'react-router-dom';

const All_Categories = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(location.state?.activeIndex ?? 0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const response = await api.get("/resource/resourceforweb");
                const programs = Array.isArray(response.data.data) ? response.data.data : [];
                // Sort categories by totalResources descending (highest first)
                programs.sort((a, b) => (b.totalResources || 0) - (a.totalResources || 0));
                setData(programs);

                // If activeIndex was passed from state, use it. Otherwise default to 0.
                if (location.state?.activeIndex !== undefined) {
                    setActiveIndex(location.state.activeIndex);
                }
            } catch (error) {
                console.error("Error fetching programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [location.state?.activeIndex]);

    const activeCategory = data[activeIndex];

    return (
        <>
            <Header />

            <section>
                <div className="ProgramArea">
                    <div className="container-fluid">

                        <div className="ProgramHead" style={{ marginBottom: "30px" }}>
                            {activeCategory ? (
                                <h2>{activeCategory.name} Programs</h2>
                            ) : (
                                <h2>Mentoring Programs</h2>
                            )}
                        </div>

                        <div className="ProgramBody">
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "50px" }}>
                                    <p>Loading resources...</p>
                                </div>
                            ) : activeCategory && activeCategory.resources && activeCategory.resources.length > 0 ? (
                                <div className="row">
                                    {activeCategory.resources.map((res) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={res.id}>
                                            <div className="ProgramBox" style={{ height: "100%" }}>
                                                <Link to={`/program-resource/${res.id}`}>

                                                    <figure className={!(res.resourceType === 'video' || res.thumbnailUrl) ? "NoThumbnail" : ""}>

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

                                                        {/* THUMBNAIL */}
                                                        {(res.resourceType === 'video' || res.thumbnailUrl) && (
                                                            <img
                                                                src={res.thumbnailUrl ? res.thumbnailUrl : "/images/Program-1.png"}
                                                                alt="resource"
                                                            />
                                                        )}

                                                    </figure>

                                                    <figcaption>

                                                        <h6>
                                                            Resource <span>{res.resourceType}</span>
                                                        </h6>

                                                        <h5>
                                                            <a>{res.heading || "Untitled Resource"}</a>
                                                        </h5>

                                                        <p>{res.subHeading || res.mentor?.fullname || "Unknown"}</p>

                                                    </figcaption>

                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", padding: "50px" }}>
                                    <p>No resources found for this category.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <AuthModals />
        </>
    );
};

export default All_Categories;
