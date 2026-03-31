import React, { act, use } from 'react'
import $ from "jquery";
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import VideosSection from '../components/mentors/VideosSection';
import CommunitySection from '../components/mentors/CommunitySection';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';
import ResourceSection from '../components/mentors/ResourceSection';
import Upcoming_Mentor_Session from '../components/mentors/Upcoming_Mentor_Session';
//import CommonLoader from '../components/CommonLoader';
import { getFcmToken } from "../utils/getFcmToken";

const My_Dashboard_Mentor = () => {



  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler2 = function () {
      $(".HistoryArea:nth-child(2) .HistoryHead ul li button")
        .removeClass("active");
      $(this).addClass("active");
    };

    const handler3 = function () {
      $(".HistoryArea:nth-child(3) .HistoryHead ul li button")
        .removeClass("active");
      $(this).addClass("active");
    };

    $(".HistoryArea:nth-child(2) .HistoryHead ul li button").on("click", handler2);
    $(".HistoryArea:nth-child(3) .HistoryHead ul li button").on("click", handler3);

    return () => {
      $(".HistoryArea:nth-child(2) .HistoryHead ul li button").off("click", handler2);
      $(".HistoryArea:nth-child(3) .HistoryHead ul li button").off("click", handler3);
    };
  }, []);

  ////////////////notification states/////////////////////
  useEffect(() => {

    const setupNotifications = async () => {
      try {

        const token = await getFcmToken();

        if (token) {

          await api.put(
            "/notification-status",
            { status: true },   // body data
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            }
          );

        }

      } catch (error) {
        console.log("Notification setup error:", error);
      }
    };

    setupNotifications();

  }, []);


  //////////////////////////onboarding check////////////////////////////
  const [onboarding, setOnboarding] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        const res = await api.get('/onboarding-status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = res.data.data;
        setOnboarding(data);
        // Show popup only if all three are not yet done AND we came from Home
        if ((!data.hasMeeting || !data.hasResource || !data.hasCommunity) && location.state?.fromHome) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.log('Onboarding status error:', err);
      }
    };
    fetchOnboardingStatus();
  }, []);


  const [loading, setLoading] = useState(false);


  ////////////////////////////my resources////////////////////////////
  const [categories, setCategories] = useState([]);
  const [refreshResources, setRefreshResources] = useState(false);

  const initialForm = {
    heading: "",
    subHeading: "",
    categoryId: "",
    description: "",
    resourceType: "",
    thumbnail: null,
    file: null,
  };


  const [form, setForm] = useState(initialForm)

  const resourceTypes = [
    { label: "PDF", value: "pdf" },
    { label: "PowerPoint", value: "ppt" },
    { label: "Doc", value: "doc" }
  ];


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      // thumbnail preview
      if (name === "thumbnail" && file instanceof File) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddResource = async () => {
    try {

      setLoading(true)

      const formData = new FormData();

      formData.append("heading", form.heading);
      formData.append("subHeading", form.subHeading);
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      formData.append("resourceType", form.resourceType);

      if (form.thumbnail) {
        formData.append("thumbnailUrl", form.thumbnail);
      }

      if (!form.file) {
        alert("File is required");
        return;
      }

      formData.append("fileUrl", form.file);

      await api.post("/resource/add-resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Resource added successfully");
      setRefreshResources(prev => !prev);
      setForm(initialForm);
      window.$('#ResourcesModal').modal('hide');
      window.$('#SuccessfullModal').modal('show');
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const getSpecializations = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user?.id) return;

        const res = await api.get(`/getUser/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCategories(res.data.data.specializations);
      } catch (err) {
        console.log(err);
      }
    };

    getSpecializations();
  }, []);





  //////////////////////////////my videos////////////////////////////

  const resourceTypesforvideos = [
    { label: "Video", value: "video" },
  ];

  const [refreshVideo, setRefreshVideo] = useState(false);

  const handleAddVideo = async () => {
    try {

      if (!form.thumbnail) {
        alert("Thumbnail is required");
        return;
      }

      setLoading(true)
      const formData = new FormData();

      formData.append("heading", form.heading);
      formData.append("subHeading", form.subHeading);
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      formData.append("resourceType", "video");

      if (form.thumbnail) {
        formData.append("thumbnailUrl", form.thumbnail);
      }

      if (!form.file) {
        alert("File is required");
        return;
      }

      formData.append("fileUrl", form.file);

      await api.post("/resource/add-resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: 60000
      });

      alert("Video added successfully");
      setRefreshVideo(prev => !prev)
      setForm(initialForm);
      setPreviewImage(null);

      window.$('#VideoModal').modal('hide');

      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';

        document
          .querySelectorAll('.modal-backdrop')
          .forEach(el => el.remove());

        navigate('/my-dashboard-mentor');
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  //////////////////////////////my communties////////////////////////////

  const [refreshCommunity, setRefreshCommunity] = useState(false);

  const initialCommunityForm = {
    title: "",
    description: "",
    image: null,
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [communityForm, setCommunityForm] = useState(initialCommunityForm);

  const handleCommunityChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setCommunityForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // image preview
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setCommunityForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddCommunity = async () => {
    try {
      if (!communityForm.title || !communityForm.description) {
        alert("Title and caption are required");
        return;
      }

      if (!communityForm.image) {
        alert("Thumbnail is required");
        return;
      }

      const formData = new FormData();
      formData.append("title", communityForm.title);
      formData.append("description", communityForm.description);
      formData.append("image", communityForm.image);

      await api.post("/community/add-community", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Community post added successfully");

      setRefreshCommunity(prev => !prev);

      //  success
      setCommunityForm(initialCommunityForm);
      setPreviewImage(null);


      // modal close
      window.$("#CommunityModal").modal("hide");


      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';

        document
          .querySelectorAll('.modal-backdrop')
          .forEach(el => el.remove());

        navigate('/my-dashboard-mentor');
      }, 300);


    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };



  return (
    <>
      <style>{`
    .OnlyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
}

.PdfIcon {
  font-size: 64px;
  color: #e53935; /* red */
}

.PptIcon {
  font-size: 64px;
  color: #fb8c00; /* orange */
}

.ResourceTypeBox {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.ResourceTypeBox input {
  accent-color: #007bff;
}

/* Onboarding Modal Styles */
.OnboardingOverlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.OnboardingModal {
  background: #fff;
  border-radius: 16px;
  padding: 36px 32px 28px 32px;
  min-width: 340px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  position: relative;
}
.OnboardingModal h3 {
  font-family: "Aptos Bold", sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #1a1a2e;
}
.OnboardingModal p {
  color: #666;
  font-family: "Aptos", sans-serif;
  font-size: 12px;
  margin-bottom: 22px;
}
.OnboardingItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1.5px solid #eee;
  transition: background 0.2s, border 0.2s;
  background: #fafafa;
}
.OnboardingItem:hover {
  background: #f0f4ff;
  border-color: #4f8ef7;
}
.OnboardingItem .OLabel {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px;
  color: #333;
}
.OnboardingItem .OInfo {
  display: flex;
  flex-direction: column;
}
.OnboardingItem .OTitle {
  font-family: "Aptos Bold", sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
}
.OnboardingItem .OLabel p {
  font-family: "Aptos", sans-serif;
  font-size: 12px;
  color: #666;
  margin: 5px 0 0 0 !important;
  line-height: 1.4;
}
.OnboardingItem .OLabel .OStep {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #4f8ef7;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;

  font-weight: 700;
  flex-shrink: 0;
}
.OnboardingItem .OStatus {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}
.OStatus.done {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}
.OStatus.pending {
  background: #fff;
  border-color: #f87171;
  color: #f87171;
}
.OnboardingClose {
  position: absolute;
  top: 14px; right: 18px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #aaa;
  line-height: 1;
}
.OnboardingClose:hover { color: #333; }
      `}</style>
      <Mentor_Navigation />

      <Mentor_Sidebar />

      {/* Onboarding Popup Modal */}
      {showOnboarding && onboarding && (
        <div className="OnboardingOverlay">
          <div className="OnboardingModal">
            <button className="OnboardingClose" onClick={() => setShowOnboarding(false)}>×</button>
            <h3>🚀 Complete Your Setup</h3>
            <p>Finish these steps to get the most out of HiboTalk and start engaging with your audience effectively. </p>

            {/* Step 1: Meeting */}
            <div
              className="OnboardingItem"
              onClick={() => navigate('/my-mentor-sessions')}
            >
              <div className="OLabel">
                <span className="OStep">1</span>
                <div className="OInfo">
                  <span className="OTitle">Add Your First Meeting Link</span>
                  <p>Set up your availability and create your first meeting link so mentees can book time with you easily. </p>
                </div>
              </div>
              <div className={`OStatus ${onboarding.hasMeeting ? 'done' : 'pending'}`}>
                {onboarding.hasMeeting ? '✓' : '✗'}
              </div>
            </div>

            {/* Step 2: Resource */}
            <div
              className="OnboardingItem"
              onClick={() => {
                setShowOnboarding(false);
                setTimeout(() => window.$('#ResourcesModal').modal('show'), 100);
              }}
            >
              <div className="OLabel">
                <span className="OStep">2</span>
                <div className="OInfo">
                  <span className="OTitle">Upload Your First Resource</span>
                  <p>Share valuable content such as documents, videos, or guides to help your audience learn from you. </p>
                </div>
              </div>
              <div className={`OStatus ${onboarding.hasResource ? 'done' : 'pending'}`}>
                {onboarding.hasResource ? '✓' : '✗'}
              </div>
            </div>

            {/* Step 3: Community */}
            <div
              className="OnboardingItem"
              onClick={() => {
                setShowOnboarding(false);
                setTimeout(() => window.$('#CommunityModal').modal('show'), 100);
              }}
            >
              <div className="OLabel">
                <span className="OStep">3</span>
                <div className="OInfo">
                  <span className="OTitle">Create Your First Community Post</span>
                  <p>Start engaging with your community by sharing insights, updates, or discussions.</p>
                </div>
              </div>
              <div className={`OStatus ${onboarding.hasCommunity ? 'done' : 'pending'}`}>
                {onboarding.hasCommunity ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Dashboard</h3>
            <div className="DashboardButton">
              <Link to="/my-dashboard-request">Booking Requests </Link>

              <Link to="/my-mentor-sessions">Manage Calendar </Link>
            </div>
          </div>

          <div className="DashboardArea">

            <Upcoming_Mentor_Session />



            <ResourceSection refresh={refreshResources} />


            <VideosSection refresh={refreshVideo} />


            <CommunitySection refresh={refreshCommunity} />
          </div>
        </div>
      </div>


      {/* <div  className="HistoryArea">
                    <div  className="HistoryHead">
                        <h3>Mentors <a href="my-mentors.html">View all</a> </h3>
                        <ul>
                            <li><button  className="active">Leadership</button></li>
                            <li><button>Communication</button></li>
                            <li><button>Communication</button></li>
                            <li><button>Communication</button></li>
                            <li><button>Communication</button></li>
                        </ul>
                    </div>
                    <div  className="HistoryBody">
                        <div  className="row">
                            <div  className="col-lg-2 col-md-3 col-sm-4">
                                <div  className="ResourcesBox">
                                    <span  className="Chip">Leadership</span>
                                    <span  className="Icon"><img src="/src/assets/images/Heart.png" /> </span>
                                    <figure>
                                        <img src="/src/assets/images/Mentors.png" />
                                    </figure>
                                    <figcaption>
                                        <p>Course name</p>
                                    </figcaption>
                                </div>
                            </div>
                            <div  className="col-lg-2 col-md-3 col-sm-4">
                                <div  className="ResourcesBox">
                                    <span  className="Chip">Leadership</span>
                                    <span  className="Icon"><img src="/src/assets/images/Heart.png" /> </span>
                                    <figure>
                                        <img src="/src/assets/images/Mentors.png" />
                                    </figure>
                                    <figcaption>
                                        <p>Course name</p>
                                    </figcaption>
                                </div>
                            </div>
                            <div  className="col-lg-2 col-md-3 col-sm-4">
                                <div  className="ResourcesBox">
                                    <span  className="Chip">Leadership</span>
                                    <span  className="Icon"><img src="/src/assets/images/Heart.png" /> </span>
                                    <figure>
                                        <img src="/src/assets/images/Mentors.png" />
                                    </figure>
                                    <figcaption>
                                        <p>Course name</p>
                                    </figcaption>
                                </div>
                            </div>
                            <div  className="col-lg-2 col-md-3 col-sm-4">
                                <div  className="ResourcesBox">
                                    <span  className="Chip">Leadership</span>
                                    <span  className="Icon"><img src="/src/assets/images/Heart.png" /> </span>
                                    <figure>
                                        <img src="/src/assets/images/Mentors.png" />
                                    </figure>
                                    <figcaption>
                                        <p>Course name</p>
                                    </figcaption>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  */}


      <div className="ModalBox">

        <div className="modal fade" id="ResourcesModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="LoginBox Resources">
                <div className="LoginHead">
                  <button type="button" className="Close" data-dismiss="modal">×</button>
                  <h3>Add Resources</h3>
                </div>
                <div className="LoginBody">



                  <div className="form-group">
                    <label className="mb-2">Resource Type</label>

                    <select
                      className="form-control"
                      name="resourceType"
                      value={form.resourceType}
                      onChange={handleChange}
                    >
                      <option value="">Select Resource Type</option>

                      {resourceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div className="form-group">
                    <input
                      type="file"
                      name="file"
                      className="form-control"
                      accept={
                        form.resourceType === "pdf"
                          ? ".pdf"
                          : form.resourceType === "ppt"
                            ? ".ppt,.pptx"
                            : form.resourceType === "doc"
                              ? ".doc,.docx"
                              : ""
                      }
                      onChange={handleChange}
                    />
                  </div>



                  <div className="form-group">
                    <input type="text" name="heading" className="form-control" placeholder="Enter Heading" value={form.heading} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <input type="text" name="subHeading" className="form-control" placeholder="Enter Sub Heading" value={form.subHeading} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <select className="form-control" name="categoryId" value={form.categoryId} onChange={handleChange}>
                      <option value="">Select category</option>
                      {
                        categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="form-group">
                    <textarea rows="5" name="description" className="form-control" placeholder="Small write up" value={form.description} onChange={handleChange}></textarea>
                  </div>

                  <button className="upload-btn" onClick={handleAddResource} disabled={loading}>
                    {loading ? (
                      <>
                        {/* <CommonLoader size={18} style={{ marginLeft: "8px" }}/> */}
                        <span style={{ marginLeft: "8px" }}>Uploading...</span>
                      </>
                    ) : (
                      "Upload File"
                    )}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="SuccessfullModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="LoginBox Resources">
                <div className="LoginHead">
                  <button type="button" className="Close" data-dismiss="modal">×</button>
                  <h3>Add Resources</h3>
                </div>
                <div className="LoginBody">

                  <article>
                    <img src="/images/Trick.png" />
                    <h4>File Uploaded</h4>
                    <p>Your students who have access to this <br /> course will get the notification of
                      uploaded <br /> resource.</p>
                  </article>

                  <button
                    onClick={() => {
                      window.$('#SuccessfullModal').modal('hide');
                      navigate("/manage-resources");
                    }}
                  >
                    Manage Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="CommunityModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="LoginBox Resources">
                <div className="LoginHead">
                  <button
                    type="button"
                    className="Close"
                    data-dismiss="modal"
                  >
                    ×
                  </button>
                  <h3>Add Community Post</h3>
                </div>

                <div className="LoginBody">
                  <div className="form-group">

                    <figure


                    >
                      <img
                        src={previewImage || "/images/Placeholder.png"}
                        alt="Preview"
                        style={{
                          width: "27%",
                          height: "50%",
                          marginLeft: "35%",
                          overflow: "hidden",
                          objectFit: "cover"
                        }}
                      />
                    </figure>
                    <div className="UploadBox">
                      <p>
                        Upload Thumbnail{" "}
                        <img src="/images/Upload.png" />
                      </p>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleCommunityChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      name="title"
                      value={communityForm.title}
                      onChange={handleCommunityChange}
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      rows="5"
                      className="form-control"
                      placeholder="Caption"
                      name="description"
                      value={communityForm.description}
                      onChange={handleCommunityChange}
                    />
                  </div>

                  <button onClick={handleAddCommunity}>
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="VideoModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="LoginBox Resources">
                <div className="LoginHead">
                  <button type="button" className="Close" data-dismiss="modal">×</button>
                  <h3>Add Video</h3>
                </div>

                <div className="LoginBody">
                  <input type="hidden" name="resourceType" value="video" />

                  <div className="form-group">
                    <figure


                    >
                      <img
                        src={previewImage || "/images/Placeholder.png"}
                        alt="Preview"
                        style={{
                          width: "27%",
                          height: "50%",
                          marginLeft: "35%",
                          overflow: "hidden",
                          objectFit: "cover"
                        }}
                      />
                    </figure>
                    <div className="UploadBox">
                      <p>
                        Upload Thumbnail <img src="/images/Upload.png" />
                      </p>
                      <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>
                  </div>


                  <div className="form-group">
                    <label className="mb-2">Resource Type</label>

                    <select
                      className="form-control"
                      name="resourceType"
                      value={form.resourceType}
                      onChange={handleChange}
                    >

                      {resourceTypesforvideos.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div className="form-group">
                    <input
                      type="file"
                      name="file"
                      className="form-control"
                      onChange={handleChange}
                      accept="video/*"
                    />
                  </div>



                  <div className="form-group">
                    <input type="text" name="heading" className="form-control" placeholder="Enter Heading" value={form.heading} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <input type="text" name="subHeading" className="form-control" placeholder="Enter Sub Heading" value={form.subHeading} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <select className="form-control" name="categoryId" value={form.categoryId} onChange={handleChange}>
                      <option value="">Select category</option>
                      {
                        categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="form-group">
                    <textarea rows="5" name="description" className="form-control" placeholder="Small write up" value={form.description} onChange={handleChange}></textarea>
                  </div>

                  <button onClick={handleAddVideo} disabled={loading}>{loading ? (
                    <>
                      {/* <CommonLoader size={18} style={{ marginLeft: "8px" }}/> */}
                      <span style={{ marginLeft: "8px" }}>Uploading...</span>
                    </>
                  ) : (
                    "Upload Video"
                  )}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default My_Dashboard_Mentor;
