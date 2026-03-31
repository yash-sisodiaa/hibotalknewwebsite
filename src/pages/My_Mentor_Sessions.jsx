import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import Mentor_Navigation from "../components/mentors/Mentor_Navigation";
import Mentor_Sidebar from "../components/mentors/Mentor_Sidebar";
import api from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";

const My_Mentor_Sessions = () => {
  const navigate = useNavigate();
  const today = dayjs().startOf("day");

  //////////////for meeting///////////
  const [meetingLink, setMeetingLink] = useState("");
  const [hasCallLink, setHasCallLink] = useState(false);
  const [loadingLink, setLoadingLink] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    checkCallLink();

    return () => {
      // Cleanup modal state on unmount
      if (window.$) {
        window.$("#CallLinks").modal("hide");
        window.$(".modal-backdrop").remove();
        window.$("body").removeClass("modal-open").css("overflow", "");
      }
    };
  }, []);

  const checkCallLink = async () => {
    try {

      const res = await api.put(`/meeting/meetings?mentorId=${user.id}`);

      if (res.data.meeting && res.data.meeting.meetingLink) {
        setMeetingLink(res.data.meeting.meetingLink);
        setHasCallLink(true);
      } else {
        setHasCallLink(false);

        // popup force open
        setTimeout(() => {
          window.$("#CallLinks").modal({
            backdrop: "static",
            keyboard: false,
          });
        }, 300);
      }

    } catch (error) {
      console.error("Error fetching meeting link", error);

      setHasCallLink(false);

      setTimeout(() => {
        window.$("#CallLinks").modal({
          backdrop: "static",
          keyboard: false,
        });
      }, 300);

    } finally {
      setLoadingLink(false);
    }
  };

  const handleSubmitMeeting = async () => {

    if (!meetingLink.trim()) {
      alert("Please enter meeting link");
      return;
    }

    try {

      const res = await api.post("/meeting/meetings", {
        mentorId: user.id,
        meetingLink: meetingLink
      });

      alert(res.data.message);

      setHasCallLink(true);

      setTimeout(() => {
        window.$("#CallLinks").modal("hide");
      }, 200);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

    } catch (error) {
      console.error(error);
      alert("Failed to create meeting link");
    }

  };

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);


  const upcomingDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) =>
      today.add(i, "day")
    );
  }, [today]);

  const startOfMonth = selectedDate.startOf("month");
  const endOfMonth = selectedDate.endOf("month");

  const daysInMonth = endOfMonth.date();
  const firstDayOfWeek = startOfMonth.day();

  const daysArray = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(dayjs(startOfMonth).date(i));
  }

  const timeSlots = useMemo(() => {
    const now = dayjs();

    // Agar selected date aaj hai tab current time se start karo
    const isToday = selectedDate.isSame(now, "day");

    let startHour;

    if (isToday) {
      // Next full hour
      startHour = now.minute() > 0 ? now.hour() + 1 : now.hour();
    } else {
      // Agar future date hai to 00 se start (ya jo tum chaho)
      startHour = 0;
    }

    const slots = [];

    for (let hour = startHour; hour <= 23; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
    }

    return slots;
  }, [selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?.id;


    const res = await api.post(
      `/calender/booked/${id}`,
      {
        date: selectedDate.format("YYYY-MM-DD")
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (res.data.success) {
      setBookedSlots(res.data.booked);

      //      if (res.data.booked.length > 0) {
      //   setSelectedTime(res.data.booked[0].mentorTime);
      // }
    }
  }


  const handleTimeSelect = (time, isBooked) => {
    if (isBooked) return; // booked slot select nahi hoga

    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  useEffect(() => {
    setSelectedTimes([]);
  }, [selectedDate]);


  const handleAddSlot = async () => {

    if (!hasCallLink) {
      window.$("#CallLinks").modal("show");
      return;
    }

    const now = dayjs();

    if (selectedTimes.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    if (selectedDate.isBefore(now, "day")) {
      alert("You cannot add slots for past dates");
      return;
    }

    if (selectedDate.isSame(now, "day")) {
      const invalidTimes = selectedTimes.filter((time) => {
        const slotTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${time}`
        );
        return slotTime.isBefore(now);
      });

      if (invalidTimes.length > 0) {
        alert("You cannot add past time slots for today");
        return;
      }
    }

    // CHECK FOR DUPLICATES
    const duplicateTimes = selectedTimes.filter(time =>
      bookedSlots.some(slot => slot.mentorTime === time)
    );

    if (duplicateTimes.length > 0) {
      alert(`Slots ${duplicateTimes.join(", ")} are already added for this date.`);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await api.post(
        `/calender/add`,
        {
          date: selectedDate.format("YYYY-MM-DD"),
          times: selectedTimes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.sucess) {
        alert("Slots added successfully");
        setSelectedTimes([]);
        fetchSlots(); // refresh booked slots
        setTimeout(() => { navigate("/my-dashboard-mentor") }, 1000);
      }
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className={`WrapperArea ${(!hasCallLink && !loadingLink) ? "blurred" : ""}`}>
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Manage Calendar</h3>
          </div>

          <div className="MontorArea">
            <div className="SessionSelect">


              <ul>
                {upcomingDays.map((day) => (
                  <li key={day.format("YYYY-MM-DD")}>
                    <input
                      type="radio"
                      name="date"
                      checked={selectedDate.isSame(day, "day")}
                      onChange={() => setSelectedDate(day)}
                    />
                    <div
                      className={`Check ${selectedDate.isSame(day, "day") ? "active" : ""
                        }`}
                    >
                      <span>{day.format("ddd").toUpperCase()}</span>
                      <strong>{day.format("DD")}</strong>
                      <span>{day.format("MMM").toUpperCase()}</span>
                    </div>
                  </li>
                ))}
              </ul>


              <div className="month-header">
                <button
                  style={{ minWidth: "65px" }}
                  onClick={() =>
                    setSelectedDate(selectedDate.subtract(1, "month"))
                  }
                >
                  {"<"}
                </button>

                <h3>{selectedDate.format("MMMM YYYY")}</h3>

                <button
                  style={{ minWidth: "65px" }}
                  onClick={() =>
                    setSelectedDate(selectedDate.add(1, "month"))
                  }
                >
                  {">"}
                </button>
              </div>

              {/* Week Days */}
              <div className="week-days">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day}>{day}</div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="calendar-grid">
                {daysArray.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${day && selectedDate.isSame(day, "day") ? "active" : ""
                      } ${day && day.isBefore(today, "day") ? "disabled" : ""}`}
                    onClick={() => {
                      if (day && !day.isBefore(today, "day")) {
                        setSelectedDate(day);
                      }
                    }}
                  >
                    {day ? day.date() : ""}
                  </div>
                ))}
              </div>


              <h4>Select Time</h4>

              <ul>
                {timeSlots.map((time) => {

                  const slot = bookedSlots.find(
                    (s) => s.mentorTime === time
                  );

                  const isAdded = !!slot;              // DB me exist karta hai?
                  const isBooked = slot?.isBooked;     // mentee ne book kiya?
                  const isSelected = selectedTimes.includes(time);

                  return (
                    <li key={time}>
                      <input
                        type="checkbox"
                        disabled={isBooked}   // sirf booked slot disable hoga
                        checked={isSelected}
                        onChange={() => handleTimeSelect(time, isBooked)}
                      />

                      <div
                        className={`Check 
          ${isBooked ? "already-booked" : ""} 
          ${isSelected ? "new-selected" : ""}
        `}
                      >
                        <span>{time}</span>

                        {isBooked ? (
                          <small style={{ color: "red", display: "block" }}>
                            Booked
                          </small>
                        ) : isAdded ? (
                          <small style={{ color: "green", display: "block" }}>
                            Available
                          </small>
                        ) : (
                          <small style={{ color: "blue", display: "block" }}>
                            Add Slot
                          </small>
                        )}

                      </div>
                    </li>
                  );
                })}
              </ul>



              <button onClick={handleAddSlot}>
                Add Slot
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="CallLinks">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="LoginBox Resources">

              <div className="LoginHead">
                <h3>Create Call Link First</h3>
              </div>

              <div className="LoginBody">

                <article>
                  <img src="../images/Trick.png" alt="" />

                  <p>
                    Before managing your calendar, you need to add your call link so that mentees can connect using that link.
                    <br /><br />
                    You can add your Zoom, Google Meet, or Microsoft Teams link here for your calls.
                  </p>
                </article>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your meeting link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <button onClick={handleSubmitMeeting}>
                  Submit
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default My_Mentor_Sessions;
