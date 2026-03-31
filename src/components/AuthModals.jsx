import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { getFcmToken } from "../utils/getFcmToken";


const AuthModals = () => {


  ///////////////token for notification //////////

  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [specializations, setSpecializations] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem("rememberRole") || 'mentor');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);



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


  ////////custom dropdown////////////
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);


  useEffect(() => {
    const handleClick = (e) => {
      // agar click dropdown ke andar nahi hai
      if (!e.target.closest(".custom-dropdown")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
    intrested: '',

    // NEW
    location: '',
    time_zone: '',
  });

  //console.log("Initial Browser Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
  //console.log("Current Form Timezone State:", form.time_zone);

  ///////timezone///////////////
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setForm(prev => ({
      ...prev,
      time_zone: timezone
    }));
  }, []);

  /////////////////location/////////////
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );

          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;

          setForm(prev => ({
            ...prev,
            location: city
          }));

        } catch (err) {
          console.log("Error fetching location", err);
        }
      },
      (error) => {
        console.log("Location permission denied");
      }
    );
  }, []);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {

    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    const savedRole = localStorage.getItem("rememberRole");

    if (savedEmail && savedPassword) {

      setLoginForm({
        email: savedEmail,
        password: savedPassword
      });

      setRememberMe(true);

      if (savedRole) {
        setSelectedRole(savedRole);
      }

    }

  }, []);

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
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await api.post('/send-otp', {
        email: form.email,
      });
      setResendTimer(60); // 30 seconds wait
    } catch (err) {
      alert('OTP send failed');
    } finally {
      setIsResending(false);
    }
  };

  const handleSendOtpforlogin = async () => {
    if (resendTimer > 0 || isResending) return;
    setLoading(true);
    setIsResending(true);
    if (!email) {
      alert('Email is required');
      setLoading(false);
      setIsResending(false);
      return;
    }
    try {
      const res = await api.post('/send-otp', {
        email: email,
      });

      if (res.data.message == 'OTP sent to email') {
        window.$('#FogotModal').modal('hide');
        window.$('#VerifyOTPModal').modal('show');
        setResendTimer(60);
      } else {
        alert(res.data.message || 'OTP not sent');
      }
    } catch (err) {
      alert('OTP send failed');
    } finally {
      setLoading(false);
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {

    try {
      const res = await api.post('/verify-otp', {
        email: form.email,
        otp: otp.join('')
      }
      )
      if (res.data.message === 'OTP verified successfully') {

        if (form.user_type === 'mentor') {
          window.$('#VerifyOTPMentorModal').modal('hide');
          window.$('#MentorModal').modal('show');
        } else {
          window.$('#VerifyOTPMenteeModal').modal('hide');
          window.$('#MenteeModal').modal('show');
        }
      } else {
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
      if (res.data.message === 'OTP verified successfully') {
        window.$('#VerifyOTPModal').modal('hide');
        window.$('#ResetPasswordModal').modal('show');

      } else {
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

    //console.log('RESET PASSWORD PAYLOAD 👉', payload);

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



  const handleSpecializationChange = (id, field) => {
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

  const formatDate = (date) => {
    if (!date) return '';

    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
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
          if (key === 'dob') {
            formData.append(key, formatDate(form.dob));
          } else {
            formData.append(key, form[key]);
          }
        }
      });

      const token = await getFcmToken();

      // 🔹 Important fields for backend
      formData.append('original_type', form.user_type);
      formData.append('platform', 'web');
      formData.append('fcmToken', token);


      // Debug: Check exactly what is being sent to the server
      //console.log("SIGNUP PAYLOAD:", Object.fromEntries(formData.entries()));

      const res = await api.post('/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));




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
            navigate('/my-dashboard-mentor', { state: { fromHome: location.pathname === "/" } });
          } else {
            navigate('/my-dashboard-mentee', { state: { fromHome: location.pathname === "/" } });
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
              navigate('/my-dashboard-mentor', { state: { fromHome: location.pathname === "/" } });
            } else {
              navigate('/my-dashboard-mentee', { state: { fromHome: location.pathname === "/" } });
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
              navigate('/my-dashboard-mentor', { state: { fromHome: location.pathname === "/" } });
            } else {
              navigate('/my-dashboard-mentee', { state: { fromHome: location.pathname === "/" } });
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

    const token = await getFcmToken();

    const payload = {
      email: loginForm.email,
      password: loginForm.password,
      original_type: selectedRole,
      fcmToken: token
    };

    console.log('LOGIN PAYLOAD 👉', payload);

    try {
      const res = await api.post('/login', payload);

      console.log('LOGIN RESPONSE 👉', res.data);



      if (res.data.success) {

        if (rememberMe) {
          localStorage.setItem("rememberEmail", loginForm.email);
          localStorage.setItem("rememberPassword", loginForm.password);
          localStorage.setItem("rememberRole", selectedRole);
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberPassword");
          localStorage.removeItem("rememberRole");
        }

      }

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
          navigate('/my-dashboard-mentor', { state: { fromHome: location.pathname === "/" } });
        } else {
          navigate('/my-dashboard-mentee', { state: { fromHome: location.pathname === "/" } });
        }
      }, 300);

    } catch (err) {
      //console.error('LOGIN ERROR', err.response?.data || err.message);

      if (err.response) {
        const status = err.response.status;

        const backendMessage = err.response.data.message;

        if (status === 401) {
          alert('Invalid email or password');
        }
        else if (status === 403) {

          if (err.response.data.status === "USER_BLOCKED") {
            alert(backendMessage || 'Your account is blocked.');
          } else {
            alert('You are not authorized to access this section');
          }
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

    

    .upload-icon {
      position: absolute;
      bottom: -5px;
      left: 52%;
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
       position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
    }
    `}</style>

      <div className="ModalBox">
        {/* Login Modal */}
        <div className="modal fade" data-backdrop="static" id="LoginModal">
          <div className="modal-dialog ">
            <div className="modal-content" >
              <div className="LoginBox compact-login">
                <div className="LoginHead">
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <button type="button" className="Close" data-dismiss="modal"><img src="/images/Close.png" /> </button>

                  <span><img src="/images/Plus.png" /> </span>
                  <h3>Login to your account</h3>
                  <p>Welcome back, please enter your details</p>
                </div>
                <div className="LoginBody">

                  <div className="LoginTabs">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <Link className={selectedRole === 'mentor' ? "nav-link active" : "nav-link"} data-toggle="tab" href="#Mentor" onClick={() => setSelectedRole('mentor')}>Mentor </ Link >
                      </li>
                      <li className="nav-item">
                        <Link className={selectedRole === 'mentee' ? "nav-link active" : "nav-link"} data-toggle="tab" href="#Mentee" onClick={() => setSelectedRole('mentee')}>Mentee </ Link >
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content">

                    <div className={selectedRole === 'mentor' ? "tab-pane fade show active" : "tab-pane fade"} id="Mentor">
                      <div className="form-group">
                        <span className="Icon"><img src="/images/mail.png" /> </span>
                        <input type="email" className="form-control" placeholder="Enter your email address" name="email" value={loginForm.email} onChange={handleLoginChange} />
                      </div>

                      <div className="form-group">
                        <span className="Icon"><img src="/images/lock.png" /> </span>
                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/lock.png" : "/images/eye.png"}
                            alt="toggle password"
                          />
                        </span>

                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter your Password" name="password" value={loginForm.password} onChange={handleLoginChange} />
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3"><div className="Remember mb-0"><label className="CheckBox mb-0">Remember Me<input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><span className="checkmark"></span></label></div><div className="forgot mb-0"><Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal" data-target="#FogotModal">Forgot password</Link></div></div>

                      <button className="myButton" onClick={handleLogin}>Log in</button>
                    </div>

                    <div className={selectedRole === 'mentee' ? "tab-pane fade show active" : "tab-pane fade"} id="Mentee">
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
                        <span className="Icon"><img src="/images/lock.png" /> </span>
                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/lock.png" : "/images/eye.png"}
                            alt="toggle password"
                          />
                        </span>

                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter your Password"
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3"><div className="Remember mb-0"><label className="CheckBox mb-0">Remember Me<input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><span className="checkmark"></span></label></div><div className="forgot mb-0"><Link href="javascript:void(0);" data-dismiss="modal" data-toggle="modal" data-target="#FogotModal">Forgot password</Link></div></div>

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
                  <h3>OTP sent to email</h3>
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <span><img src=" /images/Plus.png" /> </span>
                  <h3>Forgot Password</h3>
                  <p>Enter your email address and we'll send <br /> you a password recovery link.</p>
                </div>
                <div className="LoginBody">
                  <div className="form-group">
                    <span className="Icon"><img src=" /images/mail.png" /> </span>
                    <input type="email" className="form-control" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <button className="upload-btn" onClick={handleSendOtpforlogin} disabled={loading}>{loading ? (
                    <>
                      {/* <CommonLoader size={18} style={{ marginLeft: "8px" }}/> */}
                      <span style={{ marginLeft: "8px" }}>Send...</span>
                    </>
                  ) : (
                    "Send OTP"
                  )}</button>
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
                  <h3>OTP sent to email</h3>
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <span><img src="/images/Plus.png" /> </span>
                  <h3>Enter OTP</h3>
                  <p>Please enter the OTP that has <br /> been sent to your email.</p>
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
                        style={{
                          cursor: (resendTimer > 0 || isResending) ? 'not-allowed' : 'pointer',
                          color: (resendTimer > 0 || isResending) ? '#999' : '#00e6d2'
                        }}
                        onClick={() => {
                          if (resendTimer === 0 && !isResending) {
                            handleSendOtpforlogin();
                          }
                        }}
                      >
                        {isResending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Didn’t get a code? Resend'}
                      </h6>
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
              <div className="LoginBox compact-login">
                <div className="LoginHead">
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <span><img src=" /images/Plus.png" /> </span>
                  <h3>Create your account</h3>
                  <p>Please enter your details to get started</p>
                </div>
                <div className="LoginBody">

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
                        <span className="Icon"><img src=" /images/User.png" /> </span>
                        <input type="text" className="form-control" placeholder="Enter your full name" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <span className="Icon"><img src=" /images/mail.png" /> </span>
                        <input type="email" className="form-control"
                          placeholder="Enter your email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>

                      <div className="form-group">
                        <span className="Icon"><img src="/images/lock.png" /> </span>
                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/eye.png" : "/images/lock.png"}
                            alt="toggle password"
                          />
                        </span>
                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Create a strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                      </div>

                      <div className="form-group">
                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/eye.png" : "/images/lock.png"}
                            alt="toggle password"
                          />
                        </span>
                        <input type={showPassword ? "text" : "password"} className="form-control"
                          placeholder="Enter your password again" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                      </div>
                      <button onClick={handleCheckUser}>Register</button>
                    </div>

                    <div className="tab-pane fade" id="RegisterMentee">
                      <div className="form-group">
                        <span className="Icon"><img src=" /images/User.png" /> </span>
                        <input type="text" className="form-control" placeholder="Enter your full name" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <span className="Icon"><img src=" /images/mail.png" /> </span>
                        <input type="email" className="form-control"
                          placeholder="Enter your email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>

                      <div className="form-group">

                        <span className="Icon">
                          <img src="/images/lock.png" />
                        </span>

                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/eye-off.png" : "/images/eye.png"}
                            alt="toggle password"
                          />
                        </span>

                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Create a strong password"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />

                      </div>

                      <div className="form-group">
                        <span className="Icon"><img src=" /images/lock.png" /> </span>
                        <span
                          className="Icon Eye"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={showPassword ? "/images/eye-off.png" : "/images/eye.png"}
                            alt="toggle password"
                          />
                        </span>
                        <input type={showPassword ? "text" : "password"} className="form-control"
                          placeholder="Enter your password again" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
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
                  <h3>OTP sent to email</h3>
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <span><img src="/images/Plus.png" /> </span>
                  <h3>Enter OTP</h3>
                  <p>Please enter the OTP that has <br /> been sent to your email.</p>
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
                        style={{
                          cursor: (resendTimer > 0 || isResending) ? 'not-allowed' : 'pointer',
                          color: (resendTimer > 0 || isResending) ? '#999' : '#00e6d2'
                        }}
                        onClick={() => {
                          if (resendTimer === 0 && !isResending) {
                            handleSendOtp();
                          }
                        }}
                      >
                        {isResending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Didn’t get a code? Resend'}
                      </h6>
                    </div>
                  </div>
                  <button onClick={handleVerifyOtp}>Verify
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
                  <h3>OTP sent to email</h3>
                  <button type="button" className="Close" data-dismiss="modal">&times;</button>
                  <span><img src="/images/Plus.png" /> </span>
                  <h3>Enter OTP</h3>
                  <p>Please enter the OTP that has <br /> been sent to your email.</p>
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
                        style={{
                          cursor: (resendTimer > 0 || isResending) ? 'not-allowed' : 'pointer',
                          color: (resendTimer > 0 || isResending) ? '#999' : '#00e6d2'
                        }}
                        onClick={() => {
                          if (resendTimer === 0 && !isResending) {
                            handleSendOtp();
                          }
                        }}
                      >
                        {isResending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Didn’t get a code? Resend'}
                      </h6>
                    </div>
                  </div>
                  <button onClick={handleVerifyOtp}>Verify
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
                      <div className="form-group">


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

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Enter your DOB</label>
                        <input type="date"
                          className="form-control"
                          min="2015-01-01"
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

                        <div className="custom-dropdown" style={{ position: "relative" }}>

                          {/* Header */}
                          <div
                            className="form-control"
                            onClick={() => setOpen(!open)}
                            style={{
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {form.specialization
                              ? specializations
                                .filter(item =>
                                  form.specialization
                                    .split(',')
                                    .map(Number)
                                    .includes(item.id)
                                )
                                .map(item => item.name)
                                .join(', ')
                              : "Select specialization"}
                          </div>

                          {/* Dropdown */}
                          {open && (
                            <div
                              className="border p-2"
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                width: "100%",
                                background: "#fff",
                                zIndex: 10,
                                maxHeight: "150px",
                                overflowY: "auto"
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
                                      checked={selectedIds.includes(item.id)}
                                      onChange={() =>
                                        handleSpecializationChange(item.id, 'specialization')
                                      }
                                    />
                                    <label className="form-check-label">
                                      {item.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Qualifications</label>
                        <select
                          className="form-control"
                          value={form.qualification}
                          onChange={(e) => setForm({ ...form, qualification: e.target.value })}
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
                          onChange={(e) => setForm({ ...form, experience: e.target.value })}
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
                          placeholder="Enter Short Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}></textarea>
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
                      <div className="form-group">

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

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Enter your DOB</label>
                        <input type="date"
                          className="form-control"
                          min="2015-01-01"
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

                        <div className="custom-dropdown" style={{ position: "relative" }}>

                          {/* Header */}
                          <div
                            className="form-control"
                            onClick={() =>
                              setOpenDropdown(openDropdown === "intrested" ? null : "intrested")
                            }
                            style={{
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {form.intrested
                              ? specializations
                                .filter(item =>
                                  form.intrested
                                    .split(',')
                                    .map(Number)
                                    .includes(item.id)
                                )
                                .map(item => item.name)
                                .join(', ')
                              : "Select improvement areas"}
                          </div>

                          {/* Dropdown */}
                          {openDropdown === "intrested" && (
                            <div
                              className="border p-2"
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                width: "100%",
                                background: "#fff",
                                zIndex: 10,
                                maxHeight: "150px",
                                overflowY: "auto"
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
                                      checked={selectedIds.includes(item.id)}
                                      onChange={() =>
                                        handleSpecializationChange(item.id, 'intrested')
                                      }
                                    />
                                    <label className="form-check-label">
                                      {item.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <div className="form-group">
                        <label>Enter Short Bio</label>
                        <textarea rows="5" className="form-control"
                          placeholder="Enter Short Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}></textarea>
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

