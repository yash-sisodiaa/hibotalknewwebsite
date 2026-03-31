
import React, { useEffect, useState,useRef } from "react";
import api from "../../api/axiosInstance";
import socket from "../../socket";
import Mentee_Navigation from "../../components/mentee/Mentee_Navigation";
import Mentee_Sidebar from "../../components/mentee/Mentee_Sidebar";

const All_Chats_Mentee = () => {
   const mentorId = JSON.parse(localStorage.getItem("user"))?.id;

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // ==============================
  // Fetch All Rooms
  // ==============================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get(`/chat/rooms?userId=${mentorId}`);
        setRooms(res.data.rooms);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRooms();
  }, [mentorId]);

  // ==============================
  // Fetch Messages When Room Selected
  // ==============================
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/chat/messages?chatRoomId=${selectedRoom.id}&page=1&limit=20`
        );

        setMessages([...res.data.messages].reverse());

        socket.emit("joinRoom", selectedRoom.id);

        socket.emit("markMessagesSeen", {
          chatRoomId: selectedRoom.id,
          userId: mentorId,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedRoom, mentorId]);

  // ==============================
  // Receive New Message
  // ==============================
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatRoomId === selectedRoom?.id) {
        setMessages((prev) => [...prev, message]);

        socket.emit("markMessagesSeen", {
          chatRoomId: selectedRoom.id,
          userId: mentorId,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedRoom, mentorId]);

  // ==============================
  // Seen Event
  // ==============================
  useEffect(() => {
    const handleSeen = ({ chatRoomId }) => {
      if (chatRoomId === selectedRoom?.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === mentorId ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    socket.on("seenByReceiver", handleSeen);

    return () => {
      socket.off("seenByReceiver", handleSeen);
    };
  }, [selectedRoom, mentorId]);

  // ==============================
  // Delete Message Listener
  // ==============================
  useEffect(() => {
    const handleDelete = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          Number(msg.id) === Number(messageId)
            ? { ...msg, content: "This message was deleted", isDeleted: true }
            : msg
        )
      );
    };

    socket.on("messageDeleted", handleDelete);

    return () => {
      socket.off("messageDeleted", handleDelete);
    };
  }, []);

  // ==============================
  // Send Message
  // ==============================
  const handleSend = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    socket.emit("sendMessage", {
      chatRoomId: selectedRoom.id,
      senderId: mentorId,
      content: newMessage,
      fileUrl: null,
      fileType: null,
      replyToMessageId: null,
    });

    setNewMessage("");
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/chat/delete-one-message/${messageId}`);
    } catch (err) {
      console.log(err);
    }
  };

 

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !selectedRoom) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(
      "/chat/upload-message-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { fileUrl, fileType } = res.data.data;

    socket.emit("sendMessage", {
      chatRoomId: selectedRoom.id,   // 🔥 FIX
      senderId: mentorId,
      content: "",
      fileUrl,
      fileType,
      replyToMessageId: null,
    });

  } catch (error) {
    console.error("Image upload failed:", error);
  }
};

const chatBodyRef = useRef(null);

useEffect(() => {
  chatBodyRef.current?.scrollTo({
    top: chatBodyRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [messages]);


  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className={`ChatArea ${selectedRoom ? "ChatOpen" : ""}`}>

            {/* ================= LEFT SIDE ================= */}
            {rooms.length > 0 && (
              <div className="ChatLeft">
                <h3>Chat</h3>

                <ul>
                  {rooms.map((room) => {
                    const otherUser =
                      room.mentorId === mentorId
                        ? room.mentee
                        : room.mentor;

                    const lastMessage = room.messages[0];

                    return (
                      <li
                        key={room.id}
                        className={
                          selectedRoom?.id === room.id ? "active" : ""
                        }
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="UserBox">
                          <span className="Icon">
                            <img src={otherUser.profile_pic} alt="" />
                          </span>

                          {room.unreadCount > 0 && (
                            <span className="Count">
                              {room.unreadCount}
                            </span>
                          )}

                          <h6>{otherUser.fullname}</h6>

                          <span className="Time">
                            {lastMessage &&
                              new Date(
                                lastMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>

                          <p>
                            {lastMessage?.content ||
                              "No messages yet"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ================= RIGHT SIDE ================= */}
            <div 
              className="ChatRight" 
              style={{ width: rooms.length > 0 ? "" : "100%" }}
            >
              {selectedRoom ? (
                <>
                  {/* ================= HEADER ================= */}
                  <div className="ChatHead">
                    <h4>
                      {selectedRoom.mentorId === mentorId
                        ? selectedRoom.mentee.fullname
                        : selectedRoom.mentor.fullname}
                    </h4>
                  </div>

                  {/* ================= BODY ================= */}
                  <div className="ChatBody" ref={chatBodyRef}>
                    <ul>
                      {messages.map((msg, index) => {
                        const isMe = msg.senderId === mentorId;

                        const currentDate = new Date(msg.createdAt).toDateString();
                        const prevDate =
                          index > 0
                            ? new Date(messages[index - 1].createdAt).toDateString()
                            : null;

                        const showDate = currentDate !== prevDate;
                        const isToday =
                          currentDate === new Date().toDateString();

                        return (
                          <React.Fragment key={msg.id}>
                            
                            {/* ===== DATE SEPARATOR ===== */}
                            {showDate && (
                              <div className="DateSeparator">
                                {isToday
                                  ? "Today"
                                  : new Date(msg.createdAt).toLocaleDateString()}
                              </div>
                            )}

                            <li>
                              <div className={isMe ? "MyMessage" : "OtherMessage"}>
                                <div className="Message">

                                  {/* ===== MESSAGE CONTENT ===== */}
                                  {msg.isDeleted ? (
                                    <i style={{ color: "#888" }}>
                                      This message was deleted
                                    </i>
                                  ) : msg.fileUrl ? (
                                    <img
                                      src={msg.fileUrl}
                                      alt="chat"
                                      style={{
                                        maxWidth: "220px",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  ) : (
                                    msg.content && <p>{msg.content}</p>
                                  )}

                                  {/* ===== TIME + TICKS ===== */}
                                  <span className="Time">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}

                                    {isMe && !msg.isDeleted && (
                                      <span
                                        style={{
                                          marginLeft: 8,
                                          fontSize: 12,
                                          color: msg.seen ? "#4fc3f7" : "#999",
                                        }}
                                      >
                                        {msg.seen ? "✔✔" : "✔"}
                                      </span>
                                    )}

                                    {/* ===== DELETE BUTTON (3-dot menu) ===== */}
                                    {isMe && !msg.isDeleted && (
                                      <span style={{ position: "relative", marginLeft: 8 }}>
                                        <button
                                          onClick={() =>
                                            setOpenMenuId(
                                              openMenuId === msg.id ? null : msg.id
                                            )
                                          }
                                          className="DotsBtn"
                                        >
                                          ⋮
                                        </button>
                                        {openMenuId === msg.id && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              right: 0,
                                              bottom: "150%",
                                              background: "#fff",
                                              border: "1px solid #e0e0e0",
                                              borderRadius: 6,
                                              boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
                                              zIndex: 5,
                                              minWidth: 110,
                                              padding: "6px 0",
                                            }}
                                          >
                                            <button
                                              onClick={() => {
                                                handleDeleteMessage(msg.id);
                                                setOpenMenuId(null);
                                              }}
                                              style={{
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "8px 12px",
                                                background: "transparent",
                                                border: "none",
                                                fontSize: 13,
                                                cursor: "pointer",
                                              }}
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </li>

                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </div>

                  {/* ================= FOOTER ================= */}
                  <div className="ChatFooter">

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      id="imageUpload"
                      onChange={handleImageUpload}
                    />

                    {/* Image Button */}
                    <button
                      onClick={() =>
                        document.getElementById("imageUpload").click()
                      }
                    >
                      <img src="/images/add.png" alt="add" />
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) =>
                        setNewMessage(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSend()
                      }
                    />

                    {/* Send Button */}
                    <button onClick={handleSend}>
                      <img src="/images/send.png" alt="send" />
                    </button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    textAlign: "center"
                  }}
                >
                  <h4>
                    {rooms.length > 0 
                      ? "Select a chat to start messaging" 
                      : "No chats available yet. Connect with mentors to start a conversation!"}
                  </h4>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};


export default All_Chats_Mentee
