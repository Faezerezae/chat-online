import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage, fetchMessages, deleteMessage, updateMessage } from "./chatSlice";
import axiosInstance from "../../axiosConfig";
import { Widget, addResponseMessage, addUserMessage, deleteMessages } from "react-chat-widget";
import UAParser from "ua-parser-js";
import "react-chat-widget/lib/styles.css";
import "./ChatWidget.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const socket = io("http://localhost:10000");

const UserChat = () => {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [userState, setUserState] = useState(null);
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserState(user);
      dispatch(fetchMessages(user._id));
      setIsBlocked(user.blocked === "true");
    }
  }, [dispatch]);

  const fetchIpInfo = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      return response.data;
    } catch (error) {
      console.error("Error fetching IP info", error);
      return {};
    }
  };

  const createUser = async () => {
    const currentReferrer = document.referrer;
    try {
      const ipInfo = await fetchIpInfo();
      const parser = new UAParser();
      const result = parser.getResult();
      const userInformation = {
        ip: ipInfo.ip,
        location: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country_name}`,
        os: result.os.name,
        browser: result.browser.name,
        device: result.device.type,
        cpu: result.cpu.architecture,
        currentPath: window.location.href,
        currentTitle: document.title,
        currentReferrer: currentReferrer,
        visitHistory: [
          {
            path: window.location.href,
            title: document.title,
          },
        ],
      };

      const response = await axiosInstance.post("/auth/create-sequential-user", userInformation);
      const newUser = response.data;
      localStorage.setItem("chatUser", JSON.stringify(newUser));
      setUserState(newUser);
      dispatch(fetchMessages(newUser._id));

      socket.emit("userInfo", newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating new user", error);
    }
  };

  const handlePageVisit = async () => {
    if (userState) {
      const currentReferrer = document.referrer;
      const visitDetail = {
        path: window.location.href,
        title: document.title,
        referrer: currentReferrer,
      };
      localStorage.setItem("chatUser", JSON.stringify(userState));
      socket.emit("pageVisit", { userId: userState._id, visitDetail });
    }
  };

  useEffect(() => {
    handlePageVisit();
  }, [location, userState?._id]);

  useEffect(() => {
    socket.on("userBlocked", (userId) => {
      if (userId === userState?._id) {
        const storedUser = localStorage.getItem("chatUser");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.blocked = "true";
          localStorage.setItem("chatUser", JSON.stringify(user));
          setUserState(user);
          setIsBlocked(true);
        }
      }
    });

    return () => {
      socket.off("userBlocked");
    };
  }, [userState?._id]);

  useEffect(() => {
    if (userState) {
      socket.emit("join", { room: "general", userId: userState._id });

      socket.on("message", (message) => {
        if (message.userId === userState._id || message.receiverId === userState._id) {
          dispatch(addMessage(message));
        }
      });

      socket.on("messageUpdated", (updatedMessage) => {
        dispatch(updateMessage({
          messageId: updatedMessage._id,
          newMessage: updatedMessage.message
        }));
      });

      socket.on("messageDeleted", (messageId) => {
        dispatch(deleteMessage(messageId));
      });

      return () => {
        socket.off("message");
        socket.off("messageUpdated");
        socket.off("messageDeleted");
      };
    }
  }, [dispatch, userState]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axiosInstance.get('/beforeStartingConversation/initialize-form');
        console.log(response.data)
        if (response.data && response.data.anythingSpecial === false ) {
          setFields(response.data.completeProfileForm.fields || []);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    deleteMessages();
    const handleMessages = () => {
      if (messages.length === 0) {
        deleteMessages();
      }
      messages.forEach((msg) => {
        msg.sender === "User"
          ? addUserMessage(msg.message)
          : addResponseMessage(msg.message);
      });
    };
    handleMessages();
  }, [messages]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = JSON.parse(formData || '{}');
    updatedFormData[name] = value;
    setFormData(JSON.stringify(updatedFormData));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const parsedFormData = JSON.parse(formData || '{}');
    
    // ساخت پیام با فرمت دلخواه
    const formattedMessage = Object.entries(parsedFormData)
      .map(([key, value]) => `<p>${key}:${value}</p>`)
      .join('\n');

    if (Object.values(parsedFormData).every(val => val.trim() !== '')) {
      if (!userState) {
        const newUser = await createUser();
      if (newUser) {
        const messageData = {
          userId: newUser._id,
          username: newUser.username,
          avatar: newUser.avatar,
          room: "general",
          message: formattedMessage,
          sender: "User",
          status: "send",
        };
        try {
          const { data } = await axiosInstance.post('/messages', messageData);
          socket.emit("message", data);
          setFormData("");
          setUserState(newUser);
        } catch (error) {
          console.error("Error sending message", error);
        }
      }
      } 
    } else {
      alert('Please fill out all fields before submitting.');
    }
  };

  const sendMessage = async (message) => {
    let currentUser = userState;
    if (!currentUser) {
      currentUser = await createUser();
    }

    if (currentUser) {
      const messageData = {
        userId: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        room: "general",
        message: message,
        sender: "User",
        status: "send",
      };
      try {
        const { data } = await axiosInstance.post('/messages', messageData);
        socket.emit("message", data);
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  return (
    <div className="App">
      {!isBlocked && (
        <>
    <Widget
            handleNewUserMessage={sendMessage}
            autofocus={true}
            title="My new awesome title"
            subtitle="And my cool subtitle"
            emojis={true}
            senderPlaceHolder="پیغام خود را وارد کنید"
            showCloseButton={true}
            showTimeStamp={true}
            resizable={true}
            showBadge={true}
          />
          {!userState && fields.length>0 && (
            <form onSubmit={handleFormSubmit} className="form-container">
              {fields.map((field) => (
                !field.deleted && (
                  <div key={field.label} className="form-group">
                    <label htmlFor={field.label}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.label}
                      name={field.label}
                      value={JSON.parse(formData || '{}')[field.label] || ''}
                      onChange={handleFormChange}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      required={field.required}
                    />
                  </div>
                )
              ))}
              <button type="submit">Submit</button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default UserChat;
