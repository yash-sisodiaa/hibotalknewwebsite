import React, { useState, useMemo,useEffect } from "react";
import dayjs from "dayjs";
import Mentor_Navigation from "../components/mentors/Mentor_Navigation";
import Mentor_Sidebar from "../components/mentors/Mentor_Sidebar";
import api from '../api/axiosInstance';

const My_Mentor_Sessions = () => {
  const today = dayjs().startOf("day");

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
            date:selectedDate.format("YYYY-MM-DD")
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );

    if(res.data.success){
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

const handleAddSlot = async () => {
  if (selectedTimes.length === 0) {
    alert("Please select at least one time slot");
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
    }
  } catch (err) {
    console.error(err);
  }
};



  return (
    <>
      <Mentor_Navigation />
      <Mentor_Sidebar />

      <div className="WrapperArea">
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
                      className={`Check ${
                        selectedDate.isSame(day, "day") ? "active" : ""
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
                  onClick={() =>
                    setSelectedDate(selectedDate.subtract(1, "month"))
                  }
                >
                  {"<"}
                </button>

                <h3>{selectedDate.format("MMMM YYYY")}</h3>

                <button
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
                    className={`calendar-day ${
                      day && selectedDate.isSame(day, "day") ? "active" : ""
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
    </>
  );
};

export default My_Mentor_Sessions;
