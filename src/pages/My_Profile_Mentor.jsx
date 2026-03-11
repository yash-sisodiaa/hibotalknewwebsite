import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Mentor_Navigation from '../components/mentors/Mentor_Navigation';
import Mentor_Sidebar from '../components/mentors/Mentor_Sidebar';
import { useNavigate } from 'react-router-dom';


const My_Profile_Mentor = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [profilePic, setProfilePic] = useState(null);


   const fetchProfile = async () => {
    try {
      const res = await api.get('/get-profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = res.data.data;

      if (data.dob) {
        const [day, month, year] = data.dob.split('/');
        data.dob = `${year}-${month}-${day}`;
      }

      setProfile(data);

      if (data.specialization) {
        const ids = data.specialization.split(',').map(Number);
        setSelectedIds(ids);
      }

    } catch (error) {
      console.error('Profile fetch failed');
    }
  };

  // Now useEffect only calls it
  useEffect(() => {
    fetchProfile();
  }, []);


  // 2016-01-21 → 21/01/2016
  const formatForBackend = (dateString) => {
    if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => {

    // Agar already selected hai → remove karne do
    if (prev.includes(id)) {
      return prev.filter(item => item !== id);
    }

    // Agar 5 already selected hain → aur add mat karo
    if (prev.length >= 5) {
      alert('You can select maximum 5 improvement areas.');
      return prev;
    }

    // Warna add karo
    return [...prev, id];
  });
  };

  // Specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get('/specializations');
        setSpecializations(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch specializations');
      }
    };
    fetchSpecializations();
  }, []);


  // Image Preview
  useEffect(() => {
    if (profilePic) {
      const imageUrl = URL.createObjectURL(profilePic);
      setProfile(prev => ({ ...prev, profile_pic: imageUrl }));
    }
  }, [profilePic]);

  // Save Profile
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append('fullname', profile.fullname);
      formData.append('dob', formatForBackend(profile.dob));
      formData.append('bio', profile.bio);
      formData.append('specialization', selectedIds.join(','));
      formData.append('qualification', profile.qualification);
      formData.append('experience', profile.experience);

      if (profilePic) {
        formData.append('profile_pic', profilePic);
      }

      const res = await api.put('/edit-profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile Updated Successfully');
      setProfile(res.data.data);

       await fetchProfile();

    } catch (error) {
      console.error('Update failed', error);
      alert('Something went wrong');
    }
  };

  // Switch Role
  const handleSwitchRole = async () => {
  try {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await api.post(
  `/switch-role/${user.id}`,
  {
    intrested: selectedIds.join(","), 
    isLogout: true
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

    if (res.data.success) {

      // new token save
      localStorage.setItem("token", res.data.token);

      // user update
      const updatedUser = {
        ...user,
        user_type: res.data.user_type,
        intrested: selectedIds.join(",")
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // redirect
     
        navigate("/my-dashboard-mentee");
      

    }

  } catch (error) {
    console.log(error);
  }
};


   // Switch Role
  const handleDirectSwitchRole = async () => {
  try {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await api.post(
  `/switch-role/${user.id}`,
  {

    isLogout: true
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

    if (res.data.success) {

      // new token save
      localStorage.setItem("token", res.data.token);

      // user update
      const updatedUser = {
        ...user,
        user_type: res.data.user_type
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // redirect
        navigate("/my-dashboard-mentee");
      

    }

  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>My Profile</h3>
          </div>

          <div className="MontorArea">
            <div className="MontorName align-items-center">

              <figure style={{ position: 'relative' }}>
                <img src={profile?.profile_pic} alt="Profile" />

                <label className="camera-icon">
                  <i className="fa fa-camera"></i>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />
                </label>
              </figure>

              <figcaption>
                <h3>{profile?.fullname}</h3>
              </figcaption>

              <aside>
                <label className="Switch">
                  Switch to mentee profile

                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {

                        if (user?.intrested && user.intrested.trim() !== "") {
                          handleDirectSwitchRole(); // direct switch
                        } else {
                          window.$("#MenteeModal").modal("show"); // modal open
                        }

                      }
                    }}
                  />

                  <span className="Slider"></span>
                </label>
              </aside>

            </div>

            <div className="MontorInfo">
              <div className="BasicInfo">
                <h4>Basic Info</h4>

                <div className="row">

                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile?.fullname || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, fullname: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile?.email || ''}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group">
                      <label>DOB</label>
                      <input
                        type="date"
                        className="form-control"
                        value={profile?.dob || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, dob: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group">
                      <label>Enter Short Bio</label>
                      <textarea
                        rows="5"
                        className="form-control"
                        value={profile?.bio || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group">
                      <label>Specialization</label>

                      <details open style={{ position: 'relative' }}>
                        <summary
                          className="form-control"
                          style={{ cursor: 'pointer', listStyle: 'none' }}
                        >
                          Select Specialization
                        </summary>

                        <div
                          className="border p-2"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            background: '#fff',
                            zIndex: 10,
                            maxHeight: '150px',
                            overflowY: 'auto'
                          }}
                        >
                          {specializations.map(item => (
                            <div className="form-check" key={item.id}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                              <label className="form-check-label">
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </details>

                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                                <div className="form-group">
                                    <label>Qualifications</label>
                                    <select 
                                    className="form-control"
                                    value={profile?.qualification}
                                    onChange={(e)=> setProfile({...profile,qualification: e.target.value})}
                                    >
                                    
                                    <option value="High School Diploma">High School Diploma</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                                    <option value="Master’s Degree">Master’s Degree</option>
                                    <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                                    <option value="MBA/PGDM">MBA/PGDM</option>
                                    <option value="B.Tech/B.E.">B.Tech/B.E.</option>
                                    <option value="M.Tech/M.E.">M.Tech/M.E.</option>
                                    <option value="BBA/BBS/BMS">BBA/BBS/BMS</option>
                                    <option value="MCA">MCA</option>
                                    <option value="CA/ICWA/CS">CA/ICWA/CS</option>
                                    <option value="LLB/LLM">LLB/LLM</option>
                                    <option value="Other Professional Certification">
                                        Other Professional Certification
                                    </option>
                                    </select>
                                </div>
                    </div>

                    <div className="col-lg-4 col-sm-6">
                                    <div className="form-group">
                                        <label>Your Experience</label>
                                        <select 
                                        className="form-control"
                                        value={profile?.experience}
                                        onChange={(e)=> setProfile({...profile,experience: e.target.value})}
                                        >
                                            
                                            <option value="< 1 year">&lt; 1 year</option>
                                            <option value="1-2 years of experience">1–2 years of experience</option>
                                            <option value="3-5 years of experience">3–5 years of experience</option>
                                            <option value="6-10 years of experience">6–10 years of experience</option>
                                            <option value="10+ years of experience">10+ years of experience</option>
                                            <option value="Freelance experience, 3+ years">Freelance experience, 3+ years</option>
                                            <option value="Corporate mentorship, 5+ years">Corporate mentorship, 5+ years</option>
                                        </select>
                                    </div>
                                </div>

                </div>
              </div>

              <div className="Button">
                <button className="Save" onClick={handleSave}>
                  Save
                </button>
                <button className="Cancel">
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

       <div className="modal fade" data-backdrop="static" id="MenteeModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox Personal">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <h3>Basic Info</h3>
                        </div>
                        <div className="LoginBody">
                            <div className="row">
                                
                        
                                <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Looking to improve</label>

                                    <details style={{ position: 'relative' }}>
                                    <summary
                                        className="form-control"
                                        style={{
                                        cursor: 'pointer',
                                        listStyle: 'none'
                                        }}
                                    >
                                        Select improvement areas
                                    </summary>

                                    <div
                                        className="border p-2"
                                        style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        background: '#fff',
                                        zIndex: 10,
                                        maxHeight: '150px',
                                        overflowY: 'auto'
                                        }}
                                    >
                                       {specializations.map(item => {
                                    
                                    return (
                                        <div className="form-check" key={item.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id, 'intrested')}
                                        />
                                        <label className="form-check-label">
                                            {item.name}
                                        </label>
                                        </div>
                                    );
                                    })}

                                    </div>
                                    </details>
                                </div>
                               </div>
                                
                                
                            </div>
                            <button className="myButton" type="button" onClick={handleSwitchRole}>Switch Role</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
  );
};


export default My_Profile_Mentor
