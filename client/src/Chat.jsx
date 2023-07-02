import React, { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  };
  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };
  const selectContact = (userId) => {
    setSelectedUserId(userId);
  };

  const onlinePeopleExcludingOurUser = { ...onlinePeople };
  delete onlinePeopleExcludingOurUser[id];

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExcludingOurUser).map((userId) => (
          <div
            onClick={() => selectContact(userId)}
            className={`flex gap-2 items-center border-b border-gray-100 cursor-pointer ${
              selectedUserId === userId ? "bg-blue-50" : ""
            }`}
            key={userId}
          >
            {userId === selectedUserId && (
              <div className="rounded-r-md w-1 bg-blue-500 h-12"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar userId={userId} username={onlinePeople[userId]} />
              <span className="text-gray-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-200 w-2/3 p-2">
        <div className="flex-grow">messages</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white flex-grow rounded-sm border p-2"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
