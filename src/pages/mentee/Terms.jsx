import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AuthModals from "../../components/AuthModals";

const Terms = () => {
  return (
    <>
      <Header />

      <div className="InnerHero">
        <div className="container">
          <h2>Terms & Conditions</h2>
          <p>HiboTalk Mentoring – Guided Growth & Professional Development</p>
        </div>
      </div>

      <div className="TermsArea">
        <div className="container">
          <div className="TermsContent">
            <p>
              Welcome to <strong>HiboTalk Mentoring</strong>. By downloading and using
              this application, you agree to the following terms and conditions.
            </p>

            <h4>Use of the App</h4>
            <ul>
              <li>
                The app is intended for personal and professional development through
                mentoring.
              </li>
              <li>You must be at least 16 years old to create an account.</li>
              <li>
                You are responsible for the accuracy of the information you provide.
              </li>
            </ul>

            <h4>Accounts & Responsibilities</h4>
            <ul>
              <li>Keep your login details secure.</li>
              <li>Do not impersonate another person.</li>
              <li>
                Do not use the app for illegal, offensive, or harmful purposes.
              </li>
            </ul>

            <h4>Mentoring Sessions</h4>
            <ul>
              <li>
                Scheduling, cancellations, or rescheduling are managed within the
                app.
              </li>
              <li>
                Mentors and mentees are responsible for their interactions. HiboTalk
                is not liable for personal agreements made outside the platform.
              </li>
            </ul>

            <h4>Intellectual Property</h4>
            <p>
              All content, branding, and materials of the app are the property of
              HiboTalk. You may not copy, modify, or distribute them without prior
              permission.
            </p>

            <h4>Liability</h4>
            <p>
              The app is provided "as is". While we strive to maintain accuracy and
              uptime, we cannot guarantee uninterrupted service. HiboTalk is not
              responsible for damages resulting from the use of this application.
            </p>

            <h4>Updates</h4>
            <p>
              We may update these Terms & Conditions at any time. Continued use of the
              app means you accept the updated terms.
            </p>

            <h4>Contact</h4>
            <p>
              For any legal inquiries, please contact us at:
              <br />
              <strong>support@hibotalk.com</strong>
            </p>
          </div>
        </div>
      </div>
      <AuthModals />
      <Footer />
    </>
  );
};

export default Terms;