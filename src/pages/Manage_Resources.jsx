import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation'
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar'


const Manage_Resources = () => {

    const Navigate = useNavigate();
   
    const [activeMenu, setActiveMenu] = useState(null);

    //////////////resources/////////////////
    const [resources, setResources] = useState([]);


const fetchResources = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await api.get(`/resource/mentor-resources`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    //console.log('RESOURCES', res.data.data);
    const filtered = (res.data.data || []).filter(
  (item) => item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc'
   );
    
    setResources(filtered);

  } catch (err) {
    console.error(
      'RESOURCE FETCH ERROR 👉',
      err.response?.data || err.message
    );
  }
};

useEffect(() => {
  fetchResources();
}, []);


//////////////for videos/////////////////

const [videos, setVideos] = useState([]);

    const fetchVideos = async () => {
  const token = localStorage.getItem('token');
  const res = await api.get(`/resource/mentor-resources/`, {
      params: {
        resourceType: 'video'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

  setVideos(res.data.data || []);
};

useEffect(() => {
  fetchVideos();
}, []);

/////////////handle delete /////////////////
const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resource?");
        if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      
      await api.delete(`/resource/delete-resource/${id}`, {
         headers: {
              Authorization: `Bearer ${token}`
         }
      })

      fetchResources();
      fetchVideos();
      
      setActiveMenu(null);
      alert("Resource deleted successfully");
    } catch (error) {
        console.error("DELETE ERROR 👉", error.response?.data || error.message);
        alert("Failed to delete resource");
    }
}

//////////////edit resource //////////////

const openEditModal = async (id) => {
  try {

    const res = await api.get(`/resource/resource/${id}`);

    const data = res.data.data;

    setSelectedResourceId(id);

    setForm({
      heading: data.heading || "",
      subHeading: data.subHeading || "",
      categoryId: data.categoryId || "",
      description: data.description || "",
      resourceType: data.resourceType || "",
      thumbnailUrl: data.thumbnailUrl || "",
      fileUrl: data.fileUrl || "",
    });
    
    setActiveMenu(null);
    

  } catch (err) {
    console.error("FETCH RESOURCE ERROR", err);
  }
};


const [loading, setLoading] = useState(false);

const [showEditModal, setShowEditModal] = useState(false);
const [selectedResourceId, setSelectedResourceId] = useState(null);

const [categories,setCategories] = useState([]);


const initialForm = {
  heading: "",
  subHeading: "",
  categoryId: "",
  description: "",
  resourceType: "",
  thumbnailUrl: null,
  fileUrl: null,
};

const [form,setForm] = useState(initialForm)

const resourceTypes = [
  { label: "PDF", value: "pdf" },
  { label: "PowerPoint", value: "ppt" },
  { label: "Doc", value: "doc" }
];


const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

const handleEditResource = async () => {
    try {
       
        setLoading(true)

      const formData = new FormData();

    formData.append("heading", form.heading);
    formData.append("subHeading", form.subHeading);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    formData.append("resourceType", form.resourceType);

    if (form.thumbnailUrl) {
      formData.append("thumbnailUrl", form.thumbnailUrl);
    }

    if (form.fileUrl) {
      formData.append("fileUrl", form.fileUrl);
    }

      await api.put(`/resource/edit-resource/${selectedResourceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

       alert("Resource updated successfully");

      setShowEditModal(false);
      setForm(initialForm);
      fetchResources();
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


///////////////edit video //////////////
const [showEditVideoModal, setShowEditVideoModal] = useState(false);

const resourceTypesforvideos = [
  { label: "Video", value: "video" },
];

const handleEditVideo = async () => {
    try {
       
        setLoading(true)

      const formData = new FormData();

    formData.append("heading", form.heading);
    formData.append("subHeading", form.subHeading);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    formData.append("resourceType", "video");

    if (form.thumbnailUrl) {
      formData.append("thumbnailUrl", form.thumbnailUrl);
    }

    if (form.fileUrl) {
      formData.append("fileUrl", form.fileUrl);
    }

      await api.put(`/resource/edit-resource/${selectedResourceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

       alert("Video updated successfully");

      setShowEditVideoModal(false);
      setForm(initialForm);
      fetchVideos();

      // window.$('#VideoModal').modal('hide');
      
      // setTimeout(() => {
      //   document.body.classList.remove('modal-open');
      //   document.body.style.overflow = 'auto';
      
      //   document
      //     .querySelectorAll('.modal-backdrop')
      //     .forEach(el => el.remove());
      
      // }, 300);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } 
    finally {
    setLoading(false);
  }
  };


  return (
    <>
    <Mentor_Navigation/>
    <Mentor_Sidebar/>

    <div className="WrapperArea">
        <div className="WrapperBox">
            <div className="TitleBox">
                <h3>All Resources</h3>
                {/* <div className="SearchBox">
                    <span><img src="/images/search.png" /></span>
                    <input type="text" placeholder="Search"/>
                </div> */}
            </div>

            <div className="HistoryBody">
                        <div className="row">
                            {resources.map((item) => (
                            <div className="col-sm-2" key={item.id}>
                                <div className="ResourcesBox"
                                  onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
                                  style={{ cursor: "pointer" }}
                                >    
                                
                                <div className="ActionWrapper">
                                <button
                                  className="DotsBtn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === item.id ? null : item.id);
                                  }}
                                >
                                  ⋮
                                </button>

                                  {activeMenu === item.id && (
                                    <div className="DropdownMenu">
                                      <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedResourceId(item.id);
                                        openEditModal(item.id);
                                        setShowEditModal(true);
                                      }}
                                      >
                                        Edit
                                      </button>
                                      <button onClick={(e) => {e.stopPropagation();
                                          handleDelete(item.id)}}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <figure>
                                {/* VIDEO */}
                                {/* {item.resourceType === 'video' && (
                                    <>
                                    <span className="Play">
                                        <i className="fa fa-play" aria-hidden="true"></i>
                                    </span>

                                    <img
                                        src={item.thumbnailUrl || '/images/Program-1.png'}
                                        alt={item.heading}
                                    />
                                    </>
                                )} */}

                                {/* PDF / PPT / DOC – CUSTOM ICON */}
                                {(item.resourceType === 'pdf' || item.resourceType === 'ppt' || item.resourceType === 'doc') && (
                                <div className="OnlyIcon">
                                    {item.resourceType === 'pdf' && (
                                    <i className="fa fa-file-pdf-o PdfIcon" aria-hidden="true"></i>
                                    )}

                                    {item.resourceType === 'ppt' && (
                                    <i className="fa fa-file-powerpoint-o PptIcon" aria-hidden="true"></i>
                                    )}

                                    {item.resourceType === 'doc' && (
                                    <i className="fa fa-file-word-o DocIcon" aria-hidden="true"></i>
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

                        </div>
                    </div>
            
           </div>
            
            
            <div className="TitleBox" style={{ margin: "20px" }}>
                <h3>All Videos</h3>
            </div>
            
           <div className="HistoryBody" style={{ paddingLeft: "20px" }}>
            
            <div className="row">
          {videos.length === 0 && (
            <p style={{ padding: '0 15px' }}>No videos found</p>
          )}

          {videos.map((item) => (
            <div className="col-sm-2" key={item.id}>
              <div className="ResourcesBox"
                onClick={()=> Navigate(`/resource-mentor-details/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                
                <div className="ActionWrapper">
            <button
              className="DotsBtn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === item.id ? null : item.id);
              }}
            >
              ⋮
            </button>

            {activeMenu === item.id && (
              <div className="DropdownMenu">
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedResourceId(item.id);
                  openEditModal(item.id);
                  setShowEditVideoModal(true)
                }}
                >Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                  Delete
                </button>
              </div>
            )}
          </div>
                <figure>
                  <span className="Play">
                    <i className="fa fa-play"></i>
                  </span>

                  <img
                    src={item.thumbnailUrl || '/images/Program-1.png'}
                    alt={item.heading}
                  />
                </figure>

                <figcaption>
                  <p>{item.heading}</p>
                </figcaption>
              </div>
            </div>
          ))}
        </div>
        </div>

         <div  className={`modal fade ${showEditModal ? "show d-block" : ""}`} id="ResourcesModal">
            <div  className="modal-dialog">
                <div  className="modal-content">
                    <div  className="LoginBox Resources NewLoginBox">
                        <div  className="LoginHead">
                            <button
                              type="button"
                              className="Close"
                              onClick={() => setShowEditModal(false)}
                            >
                              ×
                            </button>
                            <h3>Edit Resources</h3>
                        </div>
                        <div  className="LoginBody">
                            


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

                              {form.fileUrl && typeof form.fileUrl === "string" && (
                                <div style={{ marginBottom: "10px" }}>
                                  Current File: 
                                  <a href={form.fileUrl} target="_blank" rel="noreferrer">
                                    View File
                                  </a>
                                </div>
                              )}

                              <input
                                type="file"
                                name="fileUrl"
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



                            <div  className="form-group">
                                <input type="text" name="heading" className="form-control" placeholder="Enter Heading" value={form.heading} onChange={handleChange}/>
                            </div>

                            <div  className="form-group">
                                <input type="text" name="subHeading" className="form-control" placeholder="Enter Sub Heading"  value={form.subHeading} onChange={handleChange}/>
                            </div>

                            <div  className="form-group">
                                <select  className="form-control" name="categoryId" value={form.categoryId} onChange={handleChange}>
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

                            <div  className="form-group">
                                <textarea rows="5" name="description" className="form-control" placeholder="Small write up" value={form.description} onChange={handleChange}></textarea>
                            </div>

                            <button className="upload-btn" onClick={handleEditResource} disabled={loading}>
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



        <div  className={`modal fade ${showEditVideoModal ? "show d-block" : ""}`} id="VideoModal">
            <div  className="modal-dialog">
                <div  className="modal-content">
                    <div  className="LoginBox Resources NewLoginBox">
                        <div  className="LoginHead">
                             <button
                              type="button"
                              className="Close"
                              onClick={() => setShowEditVideoModal(false)}
                            >×</button>
                            <h3>Edit Video</h3>
                        </div>
                        
                       <div className="LoginBody">
                        <input type="hidden" name="resourceType" value="video" />

                        <div className="form-group">
                          {form.thumbnailUrl && typeof form.thumbnailUrl === "string" && (
                              <div style={{ marginBottom: "10px" }}>
                                  Current File: 
                                  <a href={form.thumbnailUrl} target="_blank" rel="noreferrer">
                                    View File
                                  </a>
                                </div>
                            )}
                        <div className="UploadBox">
                          
                            <p>
                            Upload Thumbnail <img src="/src/assets/images/Upload.png" />
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

                              {form.fileUrl && typeof form.fileUrl === "string" && (
                                <div style={{ marginBottom: "10px" }}>
                                  Current File: 
                                  <a href={form.fileUrl} target="_blank" rel="noreferrer">
                                    View File
                                  </a>
                                </div>
                              )}

                              <input
                                type="file"
                                name="fileUrl"
                                className="form-control"
                                accept="video/*"
                                onChange={handleChange}
                              />

                            </div>



                            <div  className="form-group">
                                <input type="text" name="heading" className="form-control" placeholder="Enter Heading" value={form.heading} onChange={handleChange}/>
                            </div>

                            <div  className="form-group">
                                <input type="text" name="subHeading" className="form-control" placeholder="Enter Sub Heading"  value={form.subHeading} onChange={handleChange}/>
                            </div>

                            <div  className="form-group">
                                <select  className="form-control" name="categoryId" value={form.categoryId} onChange={handleChange}>
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

                            <div  className="form-group">
                                <textarea rows="5" name="description" className="form-control" placeholder="Small write up" value={form.description} onChange={handleChange}></textarea>
                            </div>

                            <button onClick={handleEditVideo} disabled={loading}>{loading ? (
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

export default Manage_Resources
