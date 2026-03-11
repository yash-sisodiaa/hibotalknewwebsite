import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation';
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar';
import { useNavigate } from 'react-router-dom';

const My_Profile = () => {
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [profilePic, setProfilePic] = useState(null);


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

  // Profile
  useEffect(() => {
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
        data.dob = `${year}-${month}-${day}`; // convert once
        }
        setProfile(data);

        if (data.intrested) {
          const ids = data.intrested.split(',').map(Number);
          setSelectedIds(ids);
        }

      } catch (error) {
        console.error('Profile fetch failed');
      }
    };

    fetchProfile();
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
      formData.append('intrested', selectedIds.join(','));

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
        navigate("/my-dashboard-mentor");
      

    }

  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

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


              {user?.original_type === "mentor" && (
                <aside>
                  <label className="Switch">
                    Switch to mentor profile
                    <input type="checkbox" onChange={handleSwitchRole} />
                    <span className="Slider"></span>
                  </label>
                </aside>
              )}

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
                      <label>Looking to improve</label>

                      <details open style={{ position: 'relative' }}>
                        <summary
                          className="form-control"
                          style={{ cursor: 'pointer', listStyle: 'none' }}
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
    </>
  );
};

export default My_Profile;
