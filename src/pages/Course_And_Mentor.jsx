import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModals from '../components/AuthModals';
import api from '../api/axiosInstance';

const Course_And_Mentor = () => {
    const location = useLocation();
    const initialSearch = location.state?.searchQuery || '';
    const initialType = location.state?.searchType || 'mentor';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [searchType, setSearchType] = useState(initialType);

    // ─── Mentor state ─────────────────────────────────────────────────────────
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);

    // ─── Course state ──────────────────────────────────────────────────────────
    const [resources, setResources] = useState([]);

    // ─── Fetch Mentors ─────────────────────────────────────────────────────────
    useEffect(() => {
        const getMentors = async () => {
            try {
                const res = await api.get('/review/allMentors');
                if (res.data.success) {
                    setMentors(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getMentors();
    }, []);

    // ─── Fetch Courses ─────────────────────────────────────────────────────────
    useEffect(() => {
        const getResources = async () => {
            try {
                const res = await api.get('/resource/allresource');
                setResources(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        getResources();
    }, []);

    // ─── Filter Mentors ────────────────────────────────────────────────────────
    useEffect(() => {
        const term = searchQuery.toLowerCase();
        setFilteredMentors(
            mentors.filter((m) => {
                const fullname = m.mentor?.fullname?.toLowerCase() || '';
                const specs = (m.mentor?.specializationNames || []).join(' ').toLowerCase();
                const experience = m.mentor?.experience?.toLowerCase() || '';
                return fullname.includes(term) || specs.includes(term) || experience.includes(term);
            })
        );
    }, [searchQuery, mentors]);

    // ─── Filter Courses ────────────────────────────────────────────────────────
    const filteredResources = resources.filter((item) => {
        const term = searchQuery.toLowerCase();
        return (
            item.heading?.toLowerCase().includes(term) ||
            item.subHeading?.toLowerCase().includes(term) ||
            item.category?.name?.toLowerCase().includes(term)
        );
    });

    return (
        <>
            <Header />

            {/* Breadcrumb */}
            <section>
                <div className="BreadcumArea">
                    <h2>{searchType === 'mentor' ? 'Search Mentors' : 'Search Courses'}</h2>
                </div>
            </section>

            <section>
                <div className="MentorsArea">
                    <div className="container-fluid">

                        {/* ── Search Bar ── */}
                        <div className="TitleBox mb-4">
                            <div className="SearchBox d-flex align-items-center gap-3">
                                <span><img src="/images/search.png" alt="" /></span>
                                <input
                                    type="text"
                                    placeholder="Search…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ flex: 1 }}
                                />

                                {/* Radio Buttons */}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: searchType === 'mentor' ? 600 : 400 }}>
                                    <input
                                        type="radio"
                                        name="searchTypePage"
                                        value="mentor"
                                        checked={searchType === 'mentor'}
                                        onChange={() => setSearchType('mentor')}
                                    />
                                    Mentor
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: searchType === 'course' ? 600 : 400 }}>
                                    <input
                                        type="radio"
                                        name="searchTypePage"
                                        value="course"
                                        checked={searchType === 'course'}
                                        onChange={() => setSearchType('course')}
                                    />
                                    Course
                                </label>
                            </div>
                        </div>

                        {/* ══════════════ MENTOR VIEW ══════════════ */}
                        {searchType === 'mentor' && (
                            <>
                                <div className="InspiresHead mb-3">
                                    <h2>Mentors</h2>
                                </div>

                                {filteredMentors.length === 0 ? (
                                    <p style={{ textAlign: 'center', marginTop: '30px' }}>No mentors found.</p>
                                ) : (
                                    <div className="row">
                                        {filteredMentors.map((item) => {
                                            const specializationNames = Array.isArray(item?.mentor?.specializationNames)
                                                ? item.mentor.specializationNames
                                                : [];
                                            const maxVisibleSpecs = 4;
                                            const extraSpecs = Math.max(0, specializationNames.length - maxVisibleSpecs);

                                            return (
                                                <div className="col-xl-4 col-md-6 col-sm-6" key={item.mentorId}>
                                                    <Link
                                                        to={`/mentor-profile-home/${item.mentor.id}`}
                                                        state={{ avgRating: item.avgRating }}
                                                    >
                                                        <div className="InspiresBox">
                                                            <figure>
                                                                <img
                                                                    src={item.mentor.profile_pic || '/images/default-profile.png'}
                                                                    alt={item.mentor.fullname}
                                                                />
                                                            </figure>
                                                            <figcaption>
                                                                <span className="Rating">
                                                                    {Number(item.avgRating || 0).toFixed(1)}{' '}
                                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                                </span>
                                                                <h3>{item.mentor.fullname}</h3>
                                                                <p>{item.mentor.experience}</p>
                                                                <ul>
                                                                    {specializationNames.slice(0, maxVisibleSpecs).map((spec, i) => (
                                                                        <li key={i}><span>{spec}</span></li>
                                                                    ))}
                                                                    {extraSpecs > 0 && (
                                                                        <li><span>+{extraSpecs} more</span></li>
                                                                    )}
                                                                </ul>
                                                            </figcaption>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ══════════════ COURSE VIEW ══════════════ */}
                        {searchType === 'course' && (
                            <div className="MentorsArea">
                                {filteredResources.length === 0 ? (
                                    <p style={{ textAlign: 'center', marginTop: '30px' }}>No courses found.</p>
                                ) : (
                                    <div className="row">
                                        {filteredResources.map((item) => (
                                            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6" key={item.id}>
                                                <div className="ProgramBox">
                                                    <Link to={`/program-resource/${item.id}`}>
                                                        <figure className={!(item.resourceType === 'video' || item.thumbnailUrl) ? "NoThumbnail" : ""}>
                                                            {/* FILE ICONS */}
                                                            {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                                                                <div className="OnlyIcon">
                                                                    {item.resourceType === 'pdf' && <i className="fa fa-file-pdf-o PdfIcon"></i>}
                                                                    {item.resourceType === 'ppt' && <i className="fa fa-file-powerpoint-o PptIcon"></i>}
                                                                    {item.resourceType === 'doc' && <i className="fa fa-file-word-o DocIcon"></i>}
                                                                </div>
                                                            )}
                                                            {/* VIDEO PLAY ICON */}
                                                            {item.resourceType === 'video' && (
                                                                <span className="Play"><i className="fa fa-play"></i></span>
                                                            )}
                                                            {/* THUMBNAIL */}
                                                            {(item.resourceType === 'video' || item.thumbnailUrl) && (
                                                                <img
                                                                    src={item.thumbnailUrl || '/images/Program-1.png'}
                                                                    alt="resource"
                                                                />
                                                            )}
                                                        </figure>

                                                        <figcaption>
                                                            <h6>Resource <span>{item.resourceType}</span></h6>
                                                            <h5>
                                                                <a>
                                                                    {item.heading || 'Untitled Resource'}
                                                                </a>
                                                            </h5>
                                                            <p>{item.subHeading}</p>
                                                        </figcaption>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </section>

            <Footer />
            <AuthModals />
        </>
    );
};

export default Course_And_Mentor;
