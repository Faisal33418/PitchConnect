import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  MessageSquare,
  Search,
  Send,
  Settings,
  FileText,
  RefreshCw,
  ArrowLeft,
  Smile,
  Paperclip,
} from "lucide-react";

const ChatInterface = () => {
  // State management
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Get user from local storage
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  // Filter chats based on search term
  console.log(chats);
  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.sender === user?._id ? chat.receiver : chat.sender;
    const otherUser = usersData[otherUserId];
    const userName = otherUser?.fullName || "Unknown User";
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Fetch all chats for the current user
  const fetchChats = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/chat/get-my-chats/${user._id}`
      );

      if (Array.isArray(response.data)) {
        setChats(response.data);

        // Improved user data fetching
        const userIds = new Set();
        response.data.forEach((chat) => {
          userIds.add(chat.sender);
          userIds.add(chat.receiver);
        });

        // Fetch user data in parallel
        const usersResponse = await Promise.all(
          Array.from(userIds).map(async (userId) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/chat/get-user-data/${userId}`
              );
              return { userId, userData: res.data };
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              return { userId, userData: null };
            }
          })
        );

        // Create usersData mapping
        const usersMap = {};
        usersResponse.forEach(({ userId, userData }) => {
          if (userData) {
            usersMap[userId] = userData;
          }
        });

        setUsersData(usersMap);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  // Load chats on component mount
  useEffect(() => {
    if (user?._id) {
      fetchChats();
    }
  }, []);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.chat]);

  // Handle selecting a chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setLoading(true);
    try {
      const senderType = user?.role;
      const receiverType =
        senderType === "Investor" ? "Entrepreneur" : "Investor";
      const receiverId =
        selectedChat.sender === user._id
          ? selectedChat.receiver
          : selectedChat.sender;

      await axios.post(
        `http://localhost:8080/api/chat/send-message/${user._id}/${receiverId}`,
        {
          message: newMessage,
          sender: user._id,
          receiver: receiverId,
          senderType,
          receiverType,
        }
      );

      // Optimistic UI update
      setSelectedChat((prev) => ({
        ...prev,
        chat: [
          ...prev.chat,
          {
            id: Date.now(),
            message: newMessage,
            sender: user._id,
            status: "pending",
            createdAt: new Date(),
          },
        ],
      }));

      setNewMessage("");
      toast.success("Message sent for verification");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error sending message");
    } finally {
      setLoading(false);
    }
  };

  // Function to get user initials for avatar
  const getInitials = (name) => {
    console.log(name);
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Refresh chat data
  const handleRefresh = () => {
    fetchChats();
    if (selectedChat) {
      // Re-select the current chat to refresh its data
      const chatId = selectedChat._id;
      fetchChats().then(() => {
        const refreshedChat = chats.find((chat) => chat._id === chatId);
        if (refreshedChat) {
          setSelectedChat(refreshedChat);
        }
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <div className="w-20 bg-gradient-to-b from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d] flex flex-col items-center pt-6">
        <div className="flex flex-col items-center space-y-6 mt-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#a5998a] text-white">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="w-64 border-r">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const otherUserId =
                chat.sender === user?._id ? chat.receiver : chat.sender;
              const otherUser = usersData[otherUserId];
              const lastMessage = chat.chat[chat.chat.length - 1];
              const unreadCount = chat.unreadCount || 0;
              const userName = otherUser?.fullName || "Unknown User";

              return (
                <div
                  key={chat._id}
                  className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?._id === chat._id ? "bg-blue-50" : ""
                  } ${unreadCount > 0 ? "bg-blue-50" : ""}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="relative mr-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                      {getInitials(userName)}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium truncate">
                        {userName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {lastMessage?.createdAt
                          ? new Date(lastMessage.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No matching chats found" : "No chats available"}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-[70vh] overflow-y-scroll flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center px-4 bg-white">
              <button
                className="mr-3 md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft size={20} />
              </button>

              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden flex items-center justify-center">
                {getInitials(
                  usersData[
                    selectedChat.sender === user?._id
                      ? selectedChat.receiver
                      : selectedChat.sender
                  ]?.fullName || "UU"
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {usersData[
                    selectedChat.sender === user?._id
                      ? selectedChat.receiver
                      : selectedChat.sender
                  ]?.fullName || "Unknown User"}
                </h3>
              </div>

              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={handleRefresh}
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedChat.chat
                .filter((msg) => msg.status === "approved")
                .map((msg) => {
                  const isSender = msg.sender === user?._id;
                  const senderData = isSender ? user : usersData[msg.sender];
                  const senderName = senderData?.fullName || "Unknown";

                  return (
                    <div
                      key={msg.id}
                      className={`flex mb-4 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isSender && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {getInitials(senderName)}
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div
                          className={`text-xs mt-1 ${
                            isSender ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(
                            msg.createdAt || Date.now()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {isSender && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 ml-2 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {getInitials(user?.fullName || "Me")}
                        </div>
                      )}
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="h-16 border-t bg-white p-2 flex items-center">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
                <Paperclip size={20} className="text-gray-500" />
              </button>
              <div className="flex-1 mx-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full py-2 px-3 bg-gray-100 rounded-full focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center ml-1 hover:bg-blue-600"
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your Messages</h3>
              <p className="text-gray-500 max-w-xs">
                Select a chat to view messages or start a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
