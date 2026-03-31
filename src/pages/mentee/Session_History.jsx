import React, { useEffect, useState } from "react";
import Mentee_Navigation from "../../components/mentee/Mentee_Navigation";
import Mentee_Sidebar from "../../components/mentee/Mentee_Sidebar";
import api from "../../api/axiosInstance";

const Session_History = () => {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("past");

  const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedSession, setSelectedSession] = useState(null);
const [rating, setRating] = useState(0);
const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchSessions();
  }, [activeTab]);
   
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;
  //console.log("User ID:", id);
  //const user 
  const fetchSessions = async () => {

    try {

      let endpoint = "";

      if (activeTab === "past") {
        endpoint = `session/past-sessions?userId=${id}&userType=mentee`;
      }

      if (activeTab === "pending") {
        endpoint = `session/pending/${id}`;
        }

        if (activeTab === "cancelled") {
        endpoint = `session/rejected?menteeId=${id}`;
        }

     

      const response = await api.get(endpoint);
      const result = response.data;

      if (result.success) {
        setSessions(result.data || result.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };


  const [likes, setLikes] = useState([]);

  const likeOptions = [
  "Teacher was Patient",
  "Clarity in Language",
  "To-the-point Coverage of sessions"
];

const toggleLike = (option) => {
  if (likes.includes(option)) {
    setLikes(likes.filter((item) => item !== option));
  } else {
    setLikes([...likes, option]);
  }
};

  const submitReview = async () => {
  try {

    const payload = {
      sessionId: selectedSession.id,
      menteeId: id,
      mentorId: selectedSession.mentor?.id,
      rating: rating,

      experience: likes.join(", "),   // options
      comment: remark                 // textarea
    };

    const res = await api.post("/review", payload);

    if (res.data.success) {
      alert("Review submitted");
      fetchSessions();

      setShowReviewModal(false);
      setRating(0);
      setRemark("");
      setLikes([]);
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
            <h3>Session History</h3>
          </div>

          <div className="HistoryArea">
            <div className="HistoryHead">
              <ul>
                <li>
                  <button
                    className={activeTab === "past" ? "active" : ""}
                    onClick={() => setActiveTab("past")}
                  >
                    Past Sessions
                  </button>
                </li>

                <li>
                  <button
                    className={activeTab === "pending" ? "active" : ""}
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending Requests
                  </button>
                </li>

                <li>
                  <button
                    className={activeTab === "cancelled" ? "active" : ""}
                    onClick={() => setActiveTab("cancelled")}
                  >
                    Cancelled Sessions
                  </button>
                </li>
              </ul>
            </div>

            <div className="HistoryBody">
              <div className="row">
                {sessions.length > 0 ? (
                  sessions.map((item) => (
                    <div
                      key={item.id}
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                    >
                      <div className="HistoryBox">
  <article>
    <span className="Icon">
      <img src={item.mentor?.profile_pic} alt="mentor" />
    </span>

    <h4>{item.mentor?.fullname}</h4>
    <p>{item.localTimeZone}</p>
  </article>

  <aside>
    <p>
      {item.localDate} | {item.localTime}
    </p>
  </aside>

 {activeTab === "past" && (
  item.Review ? (
    <div className="ratingStars">
      {[1,2,3,4,5].map((star) => (
        <span key={star}>
          {star <= item.Review.rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  ) : item.canReview ? (
    <button
      className="ReviewBtn"
      onClick={() => {
        setSelectedSession(item);
        setShowReviewModal(true);
      }}
    >
      Write a Review
    </button>
  ) : null
)}
</div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "20px" }}>
                    No sessions found.
                  </p>
                )}
              </div>
            </div>
          </div>
          {showReviewModal && (
  <div className="reviewModal">
    <div className="reviewContent">

      <h3>How was your experience?</h3>

      <div className="stars">
        {[1,2,3,4,5].map((star)=>(
          <span
            key={star}
            onClick={()=>setRating(star)}
            style={{
              fontSize:"28px",
              cursor:"pointer",
              color: rating >= star ? "#ffc107" : "#ccc"
            }}
          >
            ★
          </span>
        ))}
      </div>
       <h4>What do you like the most about the session?</h4>
        <div className="reviewTags">
  {likeOptions.map((option, index) => (
    <span
      key={index}
      className={`tag ${likes.includes(option) ? "activeTag" : ""}`}
      onClick={() => toggleLike(option)}
    >
      {option}
    </span>
  ))}
</div>
        
      <h4>What remarks you'd like to give to your teacher? (optional)</h4>

      <textarea
        placeholder="Enter your remarks here"
        value={remark}
        onChange={(e)=>setRemark(e.target.value)}
      />

      <button
        className="SubmitReview"
        onClick={()=>submitReview()}
      >
        Submit Review
      </button>

      <button
        className="CloseModal"
        onClick={()=>setShowReviewModal(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
        </div>
      </div>
    </>
  );
};

export default Session_History;
