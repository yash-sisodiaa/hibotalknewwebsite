import React from 'react'
import { Link } from 'react-router-dom';

const AuthModals = () => {
  return (
    <>
    
    <div className="ModalBox">
        {/* Login Modal */}
        <div className="modal fade" data-backdrop="static" id="LoginModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <button type="button" className="Close" data-dismiss="modal"><img src=" /src/assets/images/Close.png" /> </button>

                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Login to your account</h3>
                            <p>Welcome back, please enter your details</p>
                        </div>
                        <div className="LoginBody">
                            <h5>What do you want to do?</h5>

                            <div className="LoginTabs">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                         <Link className="nav-link active" data-toggle="tab" href="#Mentor">Mentor </ Link >
                                    </li>
                                    <li className="nav-item">
                                         <Link className="nav-link" data-toggle="tab" href="#Mentee">Mentee </ Link >
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-content">

                                <div className="tab-pane active" id="Mentor">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/mail.png" /> </span>
                                        <input type="email" className="form-control" placeholder="Enter your email address" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>

                                        <input type="email" className="form-control" placeholder="Enter your Password" />
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

                                    <button className="myButton">Log in</button>
                                </div>

                                <div className="tab-pane fade" id="Mentee">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/mail.png" /> </span>
                                        <input type="email" className="form-control" placeholder="Enter your email address" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>

                                        <input type="email" className="form-control" placeholder="Enter your Password" />
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

                                    <button className="myButton">Log in</button>
                                </div>
                            </div>
                        </div>


                        <div className="LoginFoot">
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
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Forgot Password</h3>
                            <p>Enter your email address and we'll send <br/> you a password recovery link.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <span className="Icon"><img src=" /src/assets/images/mail.png" /> </span>
                                <input type="email" className="form-control" placeholder="Enter your email address" />
                            </div>

                            <button data-dismiss="modal" data-toggle="modal" data-target="#VerifyOTPModal">Send
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
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                    <aside>
                                        <input type="number" className="form-control" maxlength={1} />
                                        <input type="number" className="form-control" maxlength={1} />
                                        <input type="number" className="form-control" maxlength={1} />
                                        <input type="number" className="form-control" maxlength={1} />
                                    </aside>
                                    <h6>Didn’t get a code?</h6>
                                </div>
                            </div>
                            <button data-dismiss="modal" data-toggle="modal" data-target="#ResetPasswordModal">Verify
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" data-backdrop="static" id="ResetPasswordModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Set New Password</h3>
                            <p>We recommend choosing a password that must be <br/> 8-20 characters with at least 1
                                number, <br/> 1 letter and 1 special symbol</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>

                                <input type="email" className="form-control" placeholder="New Password" />
                            </div>

                            <div className="form-group">
                                <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>

                                <input type="email" className="form-control" placeholder="Confirm Password" />
                            </div>

                            <button data-dismiss="modal" data-toggle="modal" data-target="#LoginModal">Change
                                Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" data-backdrop="static" id="RegisterModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="LoginBox">
                        <div className="LoginHead">
                            <button type="button" className="Close" data-dismiss="modal">&times;</button>
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Create your account</h3>
                            <p>Please enter your details to get started</p>
                        </div>
                        <div className="LoginBody">
                            <h5>What do you want to do?</h5>

                            <div className="LoginTabs">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                         <Link className="nav-link active" data-toggle="tab" href="#RegisterMentor">Mentor </ Link >
                                    </li>
                                    <li className="nav-item">
                                         <Link className="nav-link" data-toggle="tab" href="#RegisterMentee">Mentee </ Link >
                                    </li>
                                </ul>
                            </div>

                            <div className="tab-content">

                                <div className="tab-pane active" id="RegisterMentor">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/User.png"  /> </span>
                                        <input type="email" className="form-control" placeholder="Enter your full name" />
                                    </div>
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/mail.png"  /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your email address" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>
                                        <input type="email" className="form-control" placeholder="Create a strong password" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your password again"/>
                                    </div>
                                    <button data-dismiss="modal" data-toggle="modal"
                                        data-target="#VerifyOTPMentorModal">Register</button>
                                </div>

                                <div className="tab-pane fade" id="RegisterMentee">
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/User.png"  /> </span>
                                        <input type="email" className="form-control" placeholder="Enter your full name" />
                                    </div>
                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/mail.png"  /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your email address" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>
                                        <input type="email" className="form-control" placeholder="Create a strong password" />
                                    </div>

                                    <div className="form-group">
                                        <span className="Icon"><img src=" /src/assets/images/lock.png" /> </span>
                                        <span className="Icon Eye"><img src=" /src/assets/images/eye.png" /> </span>
                                        <input type="email" className="form-control"
                                            placeholder="Enter your password again"/>
                                    </div>

                                    <button data-dismiss="modal" data-toggle="modal"
                                        data-target="#VerifyOTPMenteeModal">Register</button>
                                </div>
                            </div>
                        </div>
                        <div className="LoginFoot">
                            <p><span>OR</span> </p>

                            <h5>Sign Up using</h5>

                            <ul>
                                <li> <Link href="javascript:void(0);"><img src=" /src/assets/images/Login-1.png" /> </Link ></li>
                                <li> <Link href="javascript:void(0);"><img src=" /src/assets/images/Login-3.png" /> </Link ></li>
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
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                    <aside>
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                    </aside>
                                    <h6>Didn’t get a code?</h6>
                                </div>
                            </div>
                            <button data-dismiss="modal" data-toggle="modal" data-target="#MentorModal">Verify
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
                            <span><img src=" /src/assets/images/Plus.png" /> </span>
                            <h3>Enter OTP</h3>
                            <p>Please enter the OTP that has <br/> been sent to your email.</p>
                        </div>
                        <div className="LoginBody">
                            <div className="form-group">
                                <div className="OTPBox">
                                    <aside>
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                        <input type="number" className="form-control" maxlength="1" />
                                    </aside>
                                    <h6>Didn’t get a code?</h6>
                                </div>
                            </div>
                            <button data-dismiss="modal" data-toggle="modal" data-target="#MenteeModal">Verify
                                OTP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
                                            <img src=" /src/assets/images/Placeholder.png" />
                                        </figure>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Enter your DOB</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Specialisation</label>
                                        <select className="form-control">
                                            <option>Select one</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Qualifications</label>
                                        <select className="form-control">
                                            <option>Select one</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Your Experience</label>
                                        <select className="form-control">
                                            <option>Select one</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Enter Short Bio</label>
                                        <textarea rows="5" className="form-control"
                                            placeholder="Enter Short Bio"></textarea>
                                    </div>
                                </div>
                            </div>
                            <button className="myButton">Submit</button>
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
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <figure>
                                            <img src=" /src/assets/images/Placeholder.png" />
                                        </figure>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Enter Your full Name</label>
                                        <input type="text" className="form-control" placeholder="Enter your full name" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Enter your DOB</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Looking to Improve</label>
                                        <input type="text" className="form-control"
                                            placeholder="Improve public Speaking " />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>&nbsp;</label>
                                        <select className="form-control">
                                            <option>Select one</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Enter Short Bio</label>
                                        <textarea rows="5" className="form-control"
                                            placeholder="Enter Short Bio"></textarea>
                                    </div>
                                </div>
                            </div>
                            <button className="myButton">Submit</button>
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
