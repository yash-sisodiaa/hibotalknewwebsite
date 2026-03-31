import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import Mentee_Navigation from '../../components/mentee/Mentee_Navigation'
import Mentee_Sidebar from '../../components/mentee/Mentee_Sidebar'
import api from '../../api/axiosInstance';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Reshedule_Mentor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mentorId = location.state?.mentorId;
  const sessionId = location.state?.sessionId;
  const localDate = location.state?.localDate;

  //console.log("Received mentorId:", mentorId);
  //console.log("Received sessionId:", sessionId);
  //console.log("Received localDate:", localDate);
  const today = dayjs().startOf("day");

  const now = dayjs();


  const [selectedDate, setSelectedDate] = useState(localDate ? dayjs(localDate) : today);
  const [selectedTimes, setSelectedTimes] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const filteredSlots = bookedSlots
    // remove duplicate times first
    .filter((slot, index, self) =>
      index === self.findIndex(s => s.mentorTime === slot.mentorTime)
    )
    // remove past time if selectedDate is today
    .filter(slot => {
      const slotDateTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${slot.mentorTime}`
      );

      if (selectedDate.isSame(today, "day")) {
        return slotDateTime.isAfter(now);
      }

      return true;
    });


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
    return bookedSlots.map(slot => slot.mentorTime);
  }, [bookedSlots]);

  useEffect(() => {
    setSelectedTimes([]);
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));



    const res = await api.post(
      `/calender/booked/${mentorId}`,
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

    setSelectedTimes(time);
  };


  useEffect(() => {
    setSelectedTimes([]);
  }, [selectedDate]);

  const handleResheduleSession = async () => {

    //const now = dayjs();

    if (selectedTimes.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    // if (selectedDate.isBefore(now, "day")) {
    //       alert("You cannot add slots for past dates");
    //       return;
    //     }

    //     if (selectedDate.isSame(now, "day")) {
    //       const invalidTimes = selectedTimes.filter((time) => {
    //         const slotTime = dayjs(
    //           `${selectedDate.format("YYYY-MM-DD")} ${time}`
    //         );
    //         return slotTime.isBefore(now);
    //       });

    //       if (invalidTimes.length > 0) {
    //         alert("You cannot add past time slots for today");
    //         return;
    //       }
    //     }

    //const token = localStorage.getItem("token");

    //const user = JSON.parse(localStorage.getItem("user"));
    //const id = user?.id;
    try {
      const res = await api.put(
        `/session/reschedule/${sessionId}`,
        {
          rescheduleDate: selectedDate.format("YYYY-MM-DD"),
          rescheduleTime: selectedTimes,
        },

      );

      if (res.data.message == "Reschedule request sent successfully.") {
        alert("Reschedule request sent successfully.");
        setSelectedTimes([]);
        fetchSlots();
        setTimeout(() => { navigate("/my-dashboard-mentee") }, 1000);
      }
    } catch (err) {
      if (err.response) {

        if (err.response.status === 400) {
          alert(err.response.data.message);
        } else {
          alert("Something went wrong");
        }
      } else {

        alert("Network error. Please try again.");
      }

      console.error(err);
    }
  };

  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="TitleBox">
            <h3>Reshedule Sessions</h3>
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
                    className={`calendar-day 
    ${day && selectedDate.isSame(day, "day") ? "active" : ""}
    ${day && day.isBefore(today, "day") ? "disabled" : ""}
  `}
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
                {filteredSlots.map((slot, index) => {
                  const time = slot.mentorTime;
                  const isActuallyBooked = slot.isBooked;
                  const isSelected = selectedTimes.includes(time);

                  return (
                    <li key={index}>
                      <input
                        type="radio"
                        name="timeSlot"
                        disabled={isActuallyBooked}
                        checked={isSelected}
                        onChange={() => handleTimeSelect(time, isActuallyBooked)}
                      />

                      <div
                        className={`Check 
            ${isActuallyBooked ? "already-booked" : ""} 
            ${isSelected ? "new-selected" : ""}
          `}
                      >
                        <span>{time}</span>
                        {isActuallyBooked ? (
                          <small style={{ color: "red", fontSize: "0.75em", display: "block" }}>
                            Booked
                          </small>
                        ) : (
                          <small>
                            Available
                          </small>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <button onClick={handleResheduleSession}>
                Send Reschedule request
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Reshedule_Mentor
