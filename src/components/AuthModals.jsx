import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';


const AuthModals = () => {
    
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [specializations, setSpecializations] = useState([]);
    const [preview, setPreview] = useState(null);
    const [selectedRole, setSelectedRole] = useState('mentor');

//     useEffect(() => {
//   // Bootstrap ke 'hidden.bs.modal' event pe suno (jab modal fully hide ho jata hai)
//   const cleanupBackdrop = () => {
//     // Body reset
//     document.body.classList.remove('modal-open');
//     document.body.style.overflow = '';           // ya 'auto'
//     document.body.style.paddingRight = '';

//     // Saare backdrops remove kar do (multiple stack hone pe bhi safe)
//     const backdrops = document.querySelectorAll('.modal-backdrop');
//     backdrops.forEach(el => {
//       el.classList.remove('show');
//       el.remove();
//     });
//   };

//   // Global listener lagao (document pe, kyunki saare modals document ke andar hain)
//   $(document).on('hidden.bs.modal', cleanupBackdrop);

//   // Component unmount hone pe listener hata do (memory leak avoid)
//   return () => {
//     $(document).off('hidden.bs.modal', cleanupBackdrop);
//   };
// }, []);  


  const [form, setForm] = useState({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  user_type: 'mentor',

   // google
  social_id: '',
  social_login: false,

   // mentor
  dob: '',
  specialization: '',
  qualification: '',
  experience: '',
  bio: '',
  profile_pic: '',

   // mentee
  intrested: ''
});

const [loginForm, setLoginForm] = useState({
    email: '',
    password:''
})

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

const handleLoginChange = (e) => {
  const { name, value } = e.target;
  setLoginForm(prev => ({
    ...prev,
    [name]: value,
  }));
};


const handleOtpChange = (e, index) => {
  const value = e.target.value.replace(/\D/g, '');

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // move to next input
  if (value && e.target.nextElementSibling) {
    e.target.nextElementSibling.focus();
  }
};


const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace' && !otp[index]) {
    e.target.previousElementSibling?.focus();
  }
};



const handleCheckUser = async () => {

    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

     if (!form.fullname.trim()) {
    alert('Full name is required');
    return;
  }

  if (!form.email.trim()) {
    alert('Email is required');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    alert('Please enter a valid email');
    return;
  }

  if (!form.password) {
    alert('Password is required');
    return;
  }

  if (!passwordRegex.test(form.password)) {
  alert(
    'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
  );
  return;
}

  if (!form.confirmPassword) {
    alert('Confirm password is required');
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert('Password and confirm password do not match');
    return;
  }

  try {
    const res = await api.post('/check-user', {
      email: form.email,
    });

    // user exists
    alert(res.data.message);

  } catch (err) {
    //  YAHI IMPORTANT HAI
    if (err.response?.status === 404) {
      window.$('#RegisterModal').modal('hide');

      if (form.user_type === 'mentor') {
        window.$('#VerifyOTPMentorModal').modal('show');
      } else {
        window.$('#VerifyOTPMenteeModal').modal('show');
      }

      //  BACKGROUND ME OTP SEND
      handleSendOtp();
    } else {
      alert('Something went wrong');
    }
  }
};


const handleSendOtp = async () => {
  try {
    const res = await api.post('/send-otp', {
      email: form.email,
    });

    if (res.data.message == 'OTP sent to email') {
      alert(res.data.message || 'OTP sent');
    } else {
      alert(res.data.message || 'OTP not sent');
    }
  } catch (err) {
    alert('OTP send failed');
  }
};

const handleSendOtpforlogin = async () => {

    if (!email) {
    alert('Email is required');
    return;
  }
  try {
    const res = await api.post('/send-otp', {
      email: email,
    });

    if (res.data.message == 'OTP sent to email') {
      alert(res.data.message || 'OTP sent');
        
        window.$('#FogotModal').modal('hide');
        window.$('#VerifyOTPModal').modal('show');
    } else {
      alert(res.data.message || 'OTP not sent');
    }
  } catch (err) {
    alert('OTP send failed');
  }
};

const handleVerifyOtp = async () => {

    try {
        const res = await api.post('/verify-otp', {
            email: form.email,
            otp: otp.join('')
        }
        )
        if(res.data.message === 'OTP verified successfully'){
            
        if (form.user_type === 'mentor') {
        window.$('#VerifyOTPMentorModal').modal('hide');
        window.$('#MentorModal').modal('show');
      } else {
        window.$('#VerifyOTPMenteeModal').modal('hide');
        window.$('#MenteeModal').modal('show');
      }
        }else{
            alert(res.data.message || 'OTP verification failed');
        }
        
    } catch (error) {
       alert(
      error.response?.data?.message || 'OTP verification failed'
    );
    }
}

const handleVerifyOtpforlogin = async () => {

    try {
        const res = await api.post('/verify-otp', {
            email: email,
            otp: otp.join('')
        }
        )
        if(res.data.message === 'OTP verified successfully'){           
        window.$('#VerifyOTPModal').modal('hide');
        window.$('#ResetPasswordModal').modal('show');
      
        }else{
            alert(res.data.message || 'OTP verification failed');
        }
        
    } catch (error) {
       alert(
      error.response?.data?.message || 'OTP verification failed'
    );
    }
}

const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    alert('Both fields are required');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  if (!passwordRegex.test(newPassword)) {
    alert(
      'Password must be 8-20 characters with 1 letter, 1 number and 1 special character'
    );
    return;
  }

  const payload = {
    email,
    newPassword,
    confirmPassword
  };

  console.log('RESET PASSWORD PAYLOAD 👉', payload);

  try {
    const res = await api.post('/reset-password', payload);

    alert(res.data.message || 'Password changed successfully');

    window.$('#ResetPasswordModal').modal('hide');
    window.$('#LoginModal').modal('show');

    setNewPassword('');
    setConfirmPassword('');
    setOtp(['', '', '', '']);
  } catch (err) {
    console.error('RESET PASSWORD ERROR 👉', err.response?.data);
    alert(err.response?.data?.message || 'Password reset failed');
  }
};



const handleSpecializationChange = (id,field) => {
 setForm(prev => {
    let arr = prev[field]
      ? prev[field].split(',').map(Number)
      : [];

    const alreadySelected = arr.includes(id);

    if (!alreadySelected && arr.length >= 5) {
      alert('Maximum 5 selections allowed');
      return prev;
    }

    if (alreadySelected) {
      arr = arr.filter(item => item !== id);
    } else {
      arr.push(id);
    }

    return {
      ...prev,
      [field]: arr.join(',')
    };
  });
};


const handleRegister = async () => {
  try {


    // 🔹 Mentor validation
    if (form.user_type === 'mentor') {
      if (
        !form.dob ||
        !form.specialization ||
        !form.qualification ||
        !form.experience ||
        !form.bio
      ) {
        alert('Please fill all mentor details');
        return;
      }

      if (!form.profile_pic) {
        alert('Profile picture is required for mentors');
        return;
      }
    }

    // 🔹 Mentee validation
    if (form.user_type === 'mentee') {
      if (!form.intrested || !form.dob || !form.bio) {
        alert('Please fill mentee details');
        return;
      }
    }

    // 🔹 Prepare FormData
    const formData = new FormData();

    Object.keys(form).forEach(key => {

  // Only skip social fields if NOT social signup
  if (!form.social_login && (key === 'social_id' || key === 'social_login')) {
    return;
  }

  if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
    formData.append(key, form[key]);
  }
});


    // 🔹 Important fields for backend
    formData.append('original_type', form.user_type);
    formData.append('platform', 'android');
    

    const res = await api.post('/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.success) {

       localStorage.setItem('token', res.data.token);
       localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registration successful 🎉');



      // modal close
if (form.user_type === 'mentor') {
  window.$('#MentorModal').modal('hide');
} else {
  window.$('#MenteeModal').modal('hide');
}

setTimeout(() => {
  document.body.classList.remove('modal-open');
  document.body.style.overflow = 'auto';

  document
    .querySelectorAll('.modal-backdrop')
    .forEach(el => el.remove());

  if (form.user_type === 'mentor') {
    navigate('/my-dashboard-mentor');
  } else {
    navigate('/my-dashboard-mentee');
  }
}, 300);

    } else {
      alert(res.data.message || 'Registration failed');
    }

  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }
};

const googleLogin = useGoogleLogin({
  flow: "implicit",

  onSuccess: async (tokenResponse) => {

    try {
      // Step 1: Fetch Google user info
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      

      const user = await res.json();

      setForm(prev => ({
      ...prev,
      fullname: user.name,
      email: user.email,
      social_id: user.sub,
      social_login: true,
      password: '', // not needed
    }));
      

      // Step 2: Send to backend
      const response = await api.post("/oauth", {
        type: "google",
        email: user.email,
        social_id: user.sub,
        fullname: user.name,
        image: user.picture,
        original_type: form.user_type || "mentor",
      });

      
      if (response.data.success) {
       

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setTimeout(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';

    document
    .querySelectorAll('.modal-backdrop')
    .forEach(el => el.remove());

     if (form.user_type === 'mentor') {
          navigate('/my-dashboard-mentor');
        } else {
          navigate('/my-dashboard-mentee');
        }
  }, 300);

      } 

    } catch (error) {
      console.log("❌ Google Login Error:", error);
      console.log("❌ Error Response:", error?.response?.data);

      const errorData = error?.response?.data;

  if (error?.response?.status === 404 &&
      errorData?.message === "User not found. Please sign up first.") {

    window.$('#RegisterModal').modal('hide');


    if (form.user_type === "mentor") {
      window.$('#MentorModal').modal('show');
    } else {
      window.$('#MenteeModal').modal('show');
    }

  } else {
    alert(errorData?.message || "Something went wrong");
  }
    }
  },

  onError: (error) => {
    console.log("❌ Google Popup Error:", error);
  },
});

const googleLoginMain = useGoogleLogin({
  flow: "implicit",

  onSuccess: async (tokenResponse) => {

    try {
      // Step 1: Fetch Google user info
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      

      const user = await res.json();

      setForm(prev => ({
      ...prev,
      fullname: user.name,
      email: user.email,
      social_id: user.sub,
      social_login: true,
      password: '', // not needed
    }));
      

      // Step 2: Send to backend
      const response = await api.post("/oauth", {
        type: "google",
        email: user.email,
        social_id: user.sub,
        fullname: user.name,
        image: user.picture,
        original_type: selectedRole || "mentor",
      });

      
      if (response.data.success) {
       

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setTimeout(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';

    document
    .querySelectorAll('.modal-backdrop')
    .forEach(el => el.remove());

     if (selectedRole === 'mentor') {
          navigate('/my-dashboard-mentor');
        } else {
          navigate('/my-dashboard-mentee');
        }
  }, 300);

      } 

    } catch (error) {
      console.log("❌ Google Login Error:", error);
      console.log("❌ Error Response:", error?.response?.data);

      const errorData = error?.response?.data;

  if (error?.response?.status === 404 &&
      errorData?.message === "User not found. Please sign up first.") {

    window.$('#LoginModal').modal('hide');


    if (selectedRole === "mentor") {
      window.$('#MentorModal').modal('show');
    } else {
      window.$('#MenteeModal').modal('show');
    }

  } else {
    alert(errorData?.message || "Something went wrong");
  }
    }
  },

  onError: (error) => {
    console.log("❌ Google Popup Error:", error);
  },
});



const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    alert('Email and password are required');
    return;
  }

  const payload = {
    email: loginForm.email,
    password: loginForm.password,
    original_type: selectedRole
  };

  console.log('LOGIN PAYLOAD 👉', payload);

  try {
    const res = await api.post('/login', payload);

    console.log('LOGIN RESPONSE 👉', res.data);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

     window.$('#LoginModal').modal('hide');

    setTimeout(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';

    document
    .querySelectorAll('.modal-backdrop')
    .forEach(el => el.remove());

    if (selectedRole === 'mentor') {
      navigate('/my-dashboard-mentor');
    } else {
      navigate('/my-dashboard-mentee');
    }
  }, 300);

  } catch (err) {
  //console.error('LOGIN ERROR', err.response?.data || err.message);

  if (err.response) {
    const status = err.response.status;

    if (status === 401) {
      alert('Invalid email or password');
    } 
    else if (status === 403) {
      alert('You are not authorized to access this section');
    } 
    else {
      alert('Something went wrong. Please try again.');
    }

  } else {
    alert('Server not responding. Please check your internet.');
  }
}
}







  return (
    <>
    <style>{`
    .profile-pic-wrapper {
      position: relative;
      display: inline-block;
    }

    .profile-pic {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ddd;
    }

    .upload-icon {
      position: absolute;
      bottom: -5px;
      right: 8px;
      background: #000;
      color: #fff;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .upload-icon i {
      color: #fff;
      font-size: 14px;
    }
    `}</style>
    
    <div className="ModalBox">
        {/* Login Modal */}
        <div className="modal fade" data-backdrop="static" id="LoginModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <button type="button" className="Close" data-dismiss="modal"><img src="/images/Close.png" /> </button>

                            <span><img src="/images/Plus.png" /> </span>
                            <h3>Login to your account</h3>
                            <p>Welcome back, please enter your details</p>
                        </div>
                        <div className="LoginBody">
                            <h5>What do you want to do?</h5>

                            <div className="LoginTabs">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                         <Link className="nav-link active" data-toggle="tab" href="#Mentor" onClick={() => setSelectedRole('mentor')}>Mentor </ Link >
                                    </li>
                                    <li className="nav-item">
                                         <Link className="nav-link" data-toggle="tab" href="#Mentee" onClick={() => setSelectedRole('mentee')}>Mentee </ Link >
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-content">

                                <div className="tab-pane active" id="Mentor">
                                    <div className="form-group">
                                        <span className="Icon"><img src="/images/mail.png" /> </span>
                                        <input type="email" className="form-control" placeholder="Enter your email address" name="email" value={loginForm.email} onChange={handleLoginChange} />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src="/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>

                                        <input type="email" className="form-control" placeholder="Enter your Password" name="password"  value={loginForm.password} onChange={handleLoginChange} />
                                    </div>

                                    <div className="forgot">
                                         <Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal"
                                            data-target="#FogotModal">
                                            Forgot password
                                         </ Link >
                                    </div>

                                    <div className="Remember">
                                        <label className="CheckBox">Remember Me
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>

                                    <button className="myButton" onClick={handleLogin}>Log in</button>
                                </div>

                                <div className="tab-pane fade" id="Mentee">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/mail.png" /> </span>
                                       <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email address"
                                        name="email"
                                        value={loginForm.email}
                                        onChange={handleLoginChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>

                                        <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your Password"
                                        name="password"
                                        value={loginForm.password}
                                        onChange={handleLoginChange}
                                        />
                                    </div>

                                    <div className="forgot">
                                         <Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal"
                                            data-target="#FogotModal">
                                            Forgot password
                                         </ Link >
                                    </div>

                                    <div className="Remember">
                                        <label className="CheckBox">Remember Me
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>

                                    <button className="myButton" onClick={handleLogin}>Log in</button>
                                </div>
                            </div>
                        </div>

                        


                        <div className="LoginFoot">
                            <ul>
                            <li>
                              <img
                                src="/images/Login-1.png"
                                onClick={() => googleLoginMain()}
                                style={{ cursor: "pointer" }}
                              />
                            </li>
                          </ul>
                            <h6>not register yet?  <Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal"
                                    data-target="#RegisterModal"> Create an account </ Link ></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         
         {/* Forgot Modal */}
        <div className="modal fade" data-backdrop="static" id="FogotModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src=" /images/Plus.png" /> </span>
                            <h3>Forgot Password</h3>
                            <p>Enter your email address and we'll send <br/> you a password recovery link.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <span className="Icon"><img src=" /images/mail.png" /> </span>
                                <input type="email" className="form-control" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <button onClick={handleSendOtpforlogin}>Send
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* VerifyOTP Modal */}

        <div className="modal fade" data-backdrop="static" id="VerifyOTPModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src="/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                     <aside>
                                        {otp.map((digit, index) => (
                                                <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="form-control text-center"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                />
                                            ))}
                                        </aside>

                                    <h6 
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleSendOtpforlogin}
                                    >Didn’t get a code? Resend</h6>
                                </div>
                            </div>
                            <button data-target="#ResetPasswordModal" onClick={handleVerifyOtpforlogin}>Verify
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         
          {/* ResetPassword Modal */}
        <div className="modal fade" data-backdrop="static" id="ResetPasswordModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="LoginBox">
        <div className="LoginHead">
          <button type="button" className="Close" data-dismiss="modal">&times;</button>
          <span><img src="/images/Plus.png" /></span>
          <h3>Set New Password</h3>
          <p>
            We recommend choosing a password that must be <br />
            8-20 characters with at least 1 number, <br />
            1 letter and 1 special symbol
          </p>
        </div>

        <div className="LoginBody">
          <div className="form-group">
            <span className="Icon"><img src="/images/lock.png" /></span>
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <span className="Icon"><img src="/images/lock.png" /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={handleResetPassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
        </div>

         




         {/* Register Modal */}
        <div className="modal fade" data-backdrop="static" id="RegisterModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src=" /images/Plus.png" /> </span>
                            <h3>Create your account</h3>
                            <p>Please enter your details to get started</p>
                        </div>
                        <div className="LoginBody">
                            <h5>What do you want to do?</h5>

                            <div className="LoginTabs">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                         <Link className="nav-link active" data-toggle="tab" href="#RegisterMentor" onClick={() => setForm({ ...form, user_type: 'mentor' })}>Mentor </ Link >
                                    </li>
                                    <li className="nav-item">
                                         <Link className="nav-link" data-toggle="tab" href="#RegisterMentee" onClick={() => setForm({ ...form, user_type: 'mentee' })}>Mentee </ Link >
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-content">

                                <div className="tab-pane active" id="RegisterMentor">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/User.png"  /> </span>
                                        <input type="text" className="form-control" placeholder="Enter your full name" value={form.fullname} onChange={(e) => setForm({...form, fullname: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/mail.png"  /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your email address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>
                                        <input type="password" className="form-control" placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>
                                        <input type="password" className="form-control"
                                            placeholder="Enter your password again" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
                                    </div>
                                    <button onClick={handleCheckUser}>Register</button>
                                </div>

                                <div className="tab-pane fade" id="RegisterMentee">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/User.png"  /> </span>
                                        <input type="text" className="form-control" placeholder="Enter your full name" value={form.fullname} onChange={(e) => setForm({...form, fullname: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/mail.png"  /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your email address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>
                                        <input type="password" className="form-control" placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /images/eye.png" /> </span>
                                        <input type="password" className="form-control"
                                            placeholder="Enter your password again" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
                                    </div>

                                    <button data-dismiss="modal" data-toggle="modal"
                                        data-target="#VerifyOTPMenteeModal" onClick={handleCheckUser}>Register</button>
                                </div>
                            </div>
                        </div>
                        <div className="LoginFoot">
                            <p><span>OR</span> </p>

                            <h5>Sign Up using</h5>

                           <ul>
                            <li>
                              <img
                                src="/images/Login-1.png"
                                onClick={() => googleLogin()}
                                style={{ cursor: "pointer" }}
                              />
                            </li>
                          </ul>


                            <h6>
                                Already have an account?
                                 <Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal"
                                    data-target="#LoginModal">Log in </ Link >
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" data-backdrop="static" id="VerifyOTPMentorModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src="/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                     <aside>
                                        {otp.map((digit, index) => (
                                                <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="form-control text-center"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                />
                                            ))}
                                        </aside>

                                    <h6 
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleSendOtp}
                                    >Didn’t get a code? Resend</h6>
                                </div>
                            </div>
                            <button  onClick={handleVerifyOtp}>Verify
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" data-backdrop="static" id="VerifyOTPMenteeModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src="/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                     <aside>
                                        {otp.map((digit, index) => (
                                            <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            className="form-control text-center"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            />
                                        ))}
                                        </aside>
                                    <h6 
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleSendOtp}
                                    >Didn’t get a code? Resend</h6>
                                </div>
                            </div>
                            <button  onClick={handleVerifyOtp}>Verify
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         

            {/* Mentor Basic Info Modal */}
        <div className="modal fade" data-backdrop="static" id="MentorModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox Personal">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <h3>Basic Info</h3>
                        </div>
                        <div className="LoginBody">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group text-center">

                                        <div className="profile-pic-wrapper">
                                        <figure>
                                            <img
                                            src={preview || "/images/Placeholder.png"}
                                            alt="Profile"
                                            className="profile-pic"
                                            />
                                        </figure>

                                        {/* upload icon */}
                                        <label htmlFor="profileUpload" className="upload-icon">
                                            <i className="fa fa-camera"></i>
                                        </label>

                                        {/* hidden input */}
                                        <input
                                            type="file"
                                            id="profileUpload"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setForm({ ...form, profile_pic: file });
                                                setPreview(URL.createObjectURL(file));
                                            }
                                            }}
                                        />
                                        </div>

                                    </div>
                                    </div>

                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Enter your DOB</label>
                                        <input type="date" className="form-control"
                                        value={form.dob}
                                        onChange={(e) =>
                                            setForm({ ...form, dob: e.target.value })
                                        }
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Specialization</label>

                                    <details style={{ position: 'relative' }}>
                                    <summary
                                        className="form-control"
                                        style={{
                                        cursor: 'pointer',
                                        listStyle: 'none'
                                        }}
                                    >
                                        Select specialization
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
                                    const selectedIds = form.specialization
                                        ? form.specialization.split(',').map(Number)
                                        : [];

                                    return (
                                        <div className="form-check" key={item.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}   // controlled
                                            onChange={() => handleSpecializationChange(item.id,'specialization')}
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

                                <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Qualifications</label>
                                    <select 
                                    className="form-control"
                                    value={form.qualification}
                                    onChange={(e)=> setForm({...form,qualification: e.target.value})}
                                    >
                                    <option>Select one</option>
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

                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Your Experience</label>
                                        <select 
                                        className="form-control"
                                        value={form.experience}
                                    onChange={(e)=> setForm({...form,experience: e.target.value})}
                                        >
                                            <option value="">Select one</option>
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

                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Enter Short Bio</label>
                                        <textarea rows="5" className="form-control"
                                            placeholder="Enter Short Bio" value={form.bio} onChange={(e)=> setForm({...form,bio: e.target.value})}></textarea>
                                    </div>
                                </div>
                            </div>
                            <button className="myButton" type="button" onClick={handleRegister}>Submit</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
             
            {/* Mentee Basic Info Modal */}
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
                                <div className="col-sm-12">
                                    <div className="form-group text-center">
                                        <div className="profile-pic-wrapper">
                                        <figure>
                                            <img
                                            src={preview || "/images/Placeholder.png"}
                                            alt="Profile"
                                            className="profile-pic"
                                            />
                                        </figure>

                                        {/* upload icon */}
                                        <label htmlFor="profileUpload" className="upload-icon">
                                            <i className="fa fa-camera"></i>
                                        </label>

                                        {/* hidden input */}
                                        <input
                                            type="file"
                                            id="profileUpload"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setForm({ ...form, profile_pic: file });
                                                setPreview(URL.createObjectURL(file));
                                            }
                                            }}
                                        />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Enter your DOB</label>
                                        <input type="date" className="form-control"
                                        value={form.dob}
                                        onChange={(e) =>
                                            setForm({ ...form, dob: e.target.value })
                                        }
                                        />
                                    </div>
                                </div>
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
                                    const selectedIds = form.intrested
                                        ? form.intrested.split(',').map(Number)
                                        : [];

                                    return (
                                        <div className="form-check" key={item.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}   // controlled
                                            onChange={() => handleSpecializationChange(item.id, 'intrested')}
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
                                
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Enter Short Bio</label>
                                        <textarea rows="5" className="form-control"
                                            placeholder="Enter Short Bio" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})}></textarea>
                                    </div>
                                </div>
                            </div>
                            <button className="myButton" type="button" onClick={handleRegister}>Submit</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    
    </>
  )
}

export default AuthModals;
