import Mentee_Navigation from "../../components/mentee/Mentee_Navigation";
import Mentee_Sidebar from "../../components/mentee/Mentee_Sidebar";
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useParams, useLocation } from "react-router-dom";
import socket from "../../socket";

const Chat_With_Mentor = () => {
  const { mentorId } = useParams();
  const menteeId = JSON.parse(localStorage.getItem("user"))?.id;
  const location = useLocation();
  const mentorName = location.state?.mentorName || "Unknown Mentor";

  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  //  Create Room
  const createRoom = async () => {
    try {
      const res = await api.post("/chat/room", {
        mentorId,
        menteeId,
      });

      setChatRoomId(res.data.chatRoom.id);
    } catch (err) {
      console.log(err);
    }
  };

  //  Fetch Messages
  const fetchMessages = async (roomId) => {
    try {
      const res = await api.get(
        `/chat/messages?chatRoomId=${roomId}&page=1&limit=20`
      );

      setMessages([...res.data.messages].reverse());
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 On Load
  useEffect(() => {
    createRoom();
  }, []);

  //  When Room Ready
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
      socket.emit("joinRoom", chatRoomId);

      //  Mark messages seen when open
      socket.emit("markMessagesSeen", {
        chatRoomId,
        userId: menteeId,
      });
    }
  }, [chatRoomId]);

  //  Receive New Message
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      // Mark seen instantly when message received (chat open)
      socket.emit("markMessagesSeen", {
        chatRoomId,
        userId: menteeId,
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatRoomId]);

  //  Listen Seen Event
  useEffect(() => {
    socket.on("seenByReceiver", ({ chatRoomId: roomId }) => {
      if (roomId === chatRoomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === menteeId
              ? { ...msg, seen: true }
              : msg
          )
        );
      }
    });

    return () => {
      socket.off("seenByReceiver");
    };
  }, [chatRoomId, menteeId]);

  //  Auto Scroll
  useEffect(() => {
    const chatContainer = document.getElementById("chatBody");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  //  Send Message
  const handleSend = () => {
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      chatRoomId,
      senderId: menteeId,
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

    } catch (error) {
      console.error("Delete failed", error);
    }
  }

  useEffect(() => {
  if (!chatRoomId) return;

  const handleDelete = ({ messageId }) => {
    //console.log("Delete event received:", messageId);

    setMessages((prev) =>
      prev.map((msg) =>
        
        Number(msg.id) === Number(messageId)
          
          ? {
              ...msg,
              content: "This message was deleted",
              isDeleted: true,
            }
          : msg
      )
    );
  };
  

  socket.on("messageDeleted", handleDelete);

  return () => {
    socket.off("messageDeleted", handleDelete);
  };
}, [chatRoomId]);


const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/chat/upload-message-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

     const { fileUrl, fileType } = res.data.data;

     socket.emit("sendMessage", {
      chatRoomId,
      senderId: menteeId,
      content: "",
      fileUrl,
      fileType,
      replyToMessageId: null,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
  }
}



  return (
    <>
      <Mentee_Navigation />
      <Mentee_Sidebar />

      <div className="WrapperArea">
        <div className="WrapperBox">
          <div className="ChatArea fullWidthChat">
            <div className="ChatRight">

              <div className="ChatHead">
                <h4>{mentorName}</h4>
              </div>

              <div className="ChatBody" id="chatBody">
                <ul>
                  {messages.map((msg, index) => {
                    const currentDate = new Date(msg.createdAt).toDateString();
                    const prevDate =
                      index > 0
                        ? new Date(messages[index - 1].createdAt).toDateString()
                        : null;

                    const showDate = currentDate !== prevDate;

                    const isToday =
                      currentDate === new Date().toDateString();

                    const isMe = msg.senderId == menteeId;

                    return (
                      <React.Fragment key={msg.id}>

                        {showDate && (
                          <div className="DateSeparator">
                            {isToday
                              ? "Today"
                              : new Date(msg.createdAt).toLocaleDateString()}
                          </div>
                        )}

                        <li>
                          <div
                            className={isMe ? "MyMessage" : "OtherMessage"}
                          >
                            <div className="Message">

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


                              <span className="Time">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}

                               {isMe && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      marginLeft: "6px",
                                    }}
                                  >
                                    {/* Delete Button (Hide if already deleted) */}
                                    {!msg.isDeleted && (
                                      <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        style={{
                                          background: "transparent",
                                          border: "none",
                                          cursor: "pointer",
                                          fontSize: "18px",
                                        }}
                                      >
                                        🗑
                                      </button>
                                    )}

                                    {/* Seen Tick (Optional: hide if deleted) */}
                                    {!msg.isDeleted && (
                                      <span
                                        style={{
                                          fontSize: 12,
                                          color: msg.seen ? "#4fc3f7" : "#999",
                                        }}
                                      >
                                        {msg.seen ? "✔✔" : "✔"}
                                      </span>
                                    )}
                                  </div>
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

              <div className="ChatFooter"> 
                {/* <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  id="cameraInput"
                  onChange={handleImageUpload}
                /> */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="imageUpload"
                  onChange={handleImageUpload}
                />

            {/* <button onClick={() => document.getElementById("cameraInput").click()}>
                <img src="/images/camera.png" alt="camera" />
            </button> */}

            <button onClick={() => document.getElementById("imageUpload").click()}>
                <img src="/images/add.png" alt="add" />
            </button> 

            <input
                type="text"
                placeholder="Type Messages..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
                }
            /> 

            <button onClick={handleSend}>
                <img src="/images/send.png" alt="send" />
            </button> 
            </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat_With_Mentor;
