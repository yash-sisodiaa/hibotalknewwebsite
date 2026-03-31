import React from 'react'
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';

const My_Community = () => {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const profilePic = user?.profile_pic;

  // Fetch Recent Communities
  const fetchMyCommunities = async () => {
    try {
      const res = await api.get(`/community/my-communities`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCommunities(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyCommunities();
    }
  }, []);

  // Like Toggle
  const handleToggleLike = async (communityId, isLiked) => {
    try {
      const payload = {
        user_id: user.id,
        community_id: communityId,
        user_type: user.user_type,
      };

      if (isLiked) {
        await api.delete("/like/unlike", { data: payload });
      } else {
        await api.post("/like/like", payload);
      }

      // Update UI without refresh
      setCommunities((prev) =>
        prev.map((item) =>
          item.id === communityId
            ? {
              ...item,
              isLiked: isLiked ? 0 : 1,
              likesCount: isLiked
                ? item.likesCount - 1
                : item.likesCount + 1,
            }
            : item
        )
      );
    } catch (error) {
      console.error("Like toggle failed", error);
    }
  };

  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    title: "",
    description: "",
    thumbnailUrl: null,
  };

  const [form, setForm] = useState(initialForm);

  // States for Add Community Modal
  const [communityForm, setCommunityForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleCommunityChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCommunityForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
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

      setLoading(true);
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
      setLoading(false);
      setCommunityForm({ title: "", description: "", image: null });
      setPreviewImage(null);

      // Close modal using jQuery as requested by existing layout triggers
      window.$("#CommunityModal").modal("hide");
      fetchMyCommunities();
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this community post?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/community/delete-community/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchMyCommunities();
      alert("Community post deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete community post");
    }
  };

  const openEditModal = async (id) => {
    try {
      const res = await api.get(`/community/community/${id}`);
      const data = res.data.data;
      setSelectedCommunityId(id);
      setForm({
        title: data.title || "",
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
      });
      setShowEditModal(true);
      setActiveMenu(null);
    } catch (err) {
      console.error("Fetch community failed", err);
    }
  };

  const handleEditCommunity = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);


      if (form.thumbnailUrl instanceof File) {
        formData.append("image", form.thumbnailUrl);
      }

      await api.put(`/community/edit-community/${selectedCommunityId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Community updated successfully");
      setShowEditModal(false);
      fetchMyCommunities();
    } catch (err) {
      console.error("Update failed", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Mentor_Navigation />


      <Mentor_Sidebar />



      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>My Community</h3>
            <div class="DashboardButton">
              {/* <div class="SearchBox">
                        <span><img src="images/search.png"></span>
                        <input type="text" placeholder="Search">
                    </div> */}
              <a href="javascript:void(0)" data-toggle="modal" data-target="#CommunityModal">Add Community </a>
            </div>
          </div>

          <div className="HistoryBody">
            <div className="row">
              {communities.map((item) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6"
                  key={item.id}
                >
                  <div
                    className="CommunityBox"
                    onClick={() =>
                      navigate(`/community-mentor-details/${item.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="ActionWrapper">
                      <button
                        className="DotsBtn"
                        style={{ marginRight: "16px", color: "white" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === item.id ? null : item.id);
                        }}
                      >
                        ⋮
                      </button>

                      {activeMenu === item.id && (
                        <div className="DropdownMenu" style={{ right: "19px", top: "35px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(item.id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <h3>
                      <span className="Icon">
                        <img src={profilePic} alt="" />
                      </span>

                      <span className="Name">
                        {item?.mentor?.fullname}
                      </span>

                      <span className="Time">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </h3>

                    <figcaption>
                      <h4>
                        {item.title?.length > 20
                          ? item.title.slice(0, 20) + "..."
                          : item.title}
                      </h4>

                      <p>
                        {item.description?.length > 20
                          ? item.description.slice(0, 20) + "..."
                          : item.description}
                      </p>
                      <h6>#Updatealert</h6>

                      <ul>
                        {/*Like Button */}
                        <li
                          onClick={(e) => {
                            e.stopPropagation(); // prevent navigation
                            handleToggleLike(
                              item.id,
                              item.isLiked === 1
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <span>
                            <i
                              className={`fa ${item.isLiked === 1
                                ? "fa-heart text-danger"
                                : "fa-heart-o"
                                }`}
                            ></i>
                          </span>{" "}
                          {item.likesCount}
                        </li>

                        {/* Comments */}
                        <li><span><img src="/images/Message.png" /> </span>{item.commentsCount}</li>
                      </ul>
                    </figcaption>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className={`modal fade newclass ${showEditModal ? "show d-block" : ""}`} id="EditCommunityModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="LoginBox Resources NewLoginBox">
              <div className="LoginHead">
                <button
                  type="button"
                  className="Close"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
                <h3>Edit Community Post</h3>
              </div>
              <div className="LoginBody">

                <div className="form-group text-center">
                  {form.thumbnailUrl && (
                    <div style={{ marginBottom: "10px" }}>
                      {form.thumbnailUrl instanceof File ? "New Preview:" : "Current Thumbnail:"}
                      <br />
                      <img
                        src={
                          form.thumbnailUrl instanceof File
                            ? URL.createObjectURL(form.thumbnailUrl)
                            : form.thumbnailUrl
                        }
                        alt="thumbnail"
                        style={{ width: "100px", marginTop: "5px", display: "block", margin: "auto" }}
                      />
                    </div>
                  )}
                  <div className="UploadBox">
                    <p style={{ textAlign: "center" }}>
                      Update Thumbnail <img src="/images/Upload.png" alt="" />
                    </p>
                    <input
                      type="file"
                      name="thumbnailUrl"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>



                <div className="form-group">
                  <textarea
                    rows="5"
                    name="description"
                    className="form-control"
                    placeholder="Caption"
                    value={form.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  onClick={handleEditCommunity}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Post"}
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
    </>
  )
}

export default My_Community
