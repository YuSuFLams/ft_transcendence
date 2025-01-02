"use client"

import { useState, FormEvent, KeyboardEvent } from "react";

interface Message {
  user: string;
  text: string;
  time: string;
}



const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([
    { user: "siham", text: "Hello!", time: "4m Ago" },
    { user: "siham", text: "How are you?", time: "4m Ago" },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeChat, setActiveChat] = useState<string>("siham");

  // State for dialogs
  const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [joinChannelData, setJoinChannelData] = useState({ name: "", password: "" });
  const [createChannelData, setCreateChannelData] = useState({
    name: "",
    password: "",
    isPrivate: false,
  });

  const friends = [
    { name: "Alex", status: "online" },
    { name: "Jordan", status: "offline" },
    { name: "Taylor", status: "online" },
  ];

  const joinedChannels = ["General", "Gaming", "Coding", "sfsafas", "safasf", "dfsdgsdgd", "dsgsdg"];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { user: "me", text: newMessage, time: "Now" }]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleJoinChannelSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Joining channel:", joinChannelData);
    setJoinDialogOpen(false);
  };

  const handleCreateChannelSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Creating channel:", createChannelData);
    setCreateDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-gray-100 rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 p-4 overflow-scroll">
        <h1 className="text-lg font-bold mb-4">Messages</h1>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded bg-gray-700 text-gray-200 mb-4"
        />
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div>
                <p className="text-sm font-bold">{msg.user}</p>
                <p className="text-sm text-gray-400 truncate">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">{msg.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-700 flex flex-col">
        <div className="flex items-center justify-between bg-gray-800 p-4 relative">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <p className="font-bold">{activeChat}</p>
          </div>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
          >
            ≡
          </button>
          {showMenu && (
            <div className="absolute top-12 right-4 bg-gray-900 rounded shadow-lg p-4 text-sm space-y-2">
              <button className="w-full text-left p-2 bg-red-500 rounded text-white">
                Block User
              </button>
              <button className="w-full text-left p-2 bg-blue-500 rounded text-white">
                Invite User to Game
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.user === "me" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-2 rounded ${
                  msg.user === "me" ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center p-4 bg-gray-800">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 rounded bg-gray-700 text-gray-200"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-blue-500 rounded text-white"
          >
            Send
          </button>
        </div>
      </div>

      {/* Channels and Friends */}
      <div className="w-1/4 bg-gray-900 flex flex-col">
        {/* Channels Section */}
        <div className="flex-1 p-4 border-t border-gray-800 rounded-t mt-auto overflow-scroll">
          <h1 className="text-lg font-bold mb-4">Channels</h1>
          <button
            onClick={() => setJoinDialogOpen(true)}
            className="w-full mb-2 p-2 bg-blue-500 rounded"
          >
            Join Channel
          </button>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="w-full p-2 bg-green-500 rounded"
          >
            Create Channel
          </button>
          <div className="mt-4">
            <h2 className="text-md font-bold mb-2">Joined Channels</h2>
            <div className="space-y-2">
              {joinedChannels.map((channel, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-2 bg-gray-700 rounded"
                  onClick={() => setActiveChat(channel)}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Friends Section */}
        <div className="flex-1 p-4 border-t border-gray-800 rounded-t mt-auto overflow-scroll">
          <h1 className="text-lg font-bold mb-4">Friends</h1>
          <div className="space-y-4">
            {friends.map((friend, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-gray-700 rounded"
              >
                <div>
                  <p className="font-bold">{friend.name}</p>
                  <p
                    className={`text-sm ${
                      friend.status === "online" ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {friend.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-1 bg-blue-500 rounded text-sm"
                    onClick={() => setActiveChat(friend.name)}
                  >
                    Chat
                  </button>
                  <button className="p-1 bg-purple-500 rounded text-sm">Invite</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
