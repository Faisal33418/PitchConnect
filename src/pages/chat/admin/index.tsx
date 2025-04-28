// Keep all your imports as-is
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Menu, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import clsx from "clsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

// Types unchanged
interface User {
  _id: string;
  fullName: string;
}

interface Message {
  id: string;
  message: string;
  senderType: string;
  status: string;
}

interface Chat {
  _id: string;
  sender: string;
  receiver: string;
  chat: Message[];
}

export default function ChatModeration() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [usersData, setUsersData] = useState<Record<string, User>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const getChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/chat/get-all-chats"
      );
      setChats(response.data);

      const userIds = new Set<string>();
      response.data.forEach((chat: Chat) => {
        userIds.add(chat.sender);
        userIds.add(chat.receiver);
      });

      await Promise.all(
        Array.from(userIds).map(async (userId) => {
          if (!usersData[userId]) {
            const userResponse = await axios.get(
              `http://localhost:8080/api/chat/get-user-data/${userId}`
            );
            setUsersData((prev) => ({ ...prev, [userId]: userResponse.data }));
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const filteredChats = chats.filter((chat) => {
    const senderName = usersData[chat.sender]?.fullName || "Unknown Sender";
    const receiverName =
      usersData[chat.receiver]?.fullName || "Unknown Receiver";
    return (
      senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleModeration = async (
    chatId: string,
    messageId: string,
    status: string
  ) => {
    if (!selectedChat) return;
    try {
      await axios.post(
        `http://localhost:8080/api/chat/moderate-message/${chatId}`,
        {
          messageId,
          approved: status === "approved",
        }
      );

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                chat: chat.chat.map((msg) =>
                  msg.id === messageId ? { ...msg, status } : msg
                ),
              }
            : chat
        )
      );

      setSelectedChat((prev) => {
        if (prev && prev._id === chatId) {
          return {
            ...prev,
            chat: prev.chat.map((msg) =>
              msg.id === messageId ? { ...msg, status } : msg
            ),
          };
        }
        return prev;
      });
    } catch (error) {
      console.error("Error moderating message:", error);
    }
  };

  const handleRefresh = () => {
    getChats();
  };

  const renderMessages = () =>
    selectedChat?.chat.map((msg) => {
      const isEntrepreneur = msg.senderType === "Entrepreneur";
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "relative max-w-[80%] sm:max-w-[70%] rounded-xl p-3 my-3 shadow-md text-sm",
            isEntrepreneur
              ? "bg-white self-start ml-2"
              : "bg-blue-500 text-white self-end mr-2"
          )}
        >
          <div className="font-bold text-xs mb-1">
            {msg.senderType === "Entrepreneur" ? "Entrepreneur" : "Investor"}
          </div>
          <div className="flex gap-2 items-center">
            <p className="mb-1 whitespace-pre-wrap break-words">
              {msg.message}
            </p>
            <div className=" top-1 right-2 flex items-center space-x-1">
              {msg.status === "pending" ? (
                <>
                  <IconButton
                    sx={{ background: "white" }}
                    size="small"
                    onClick={() =>
                      handleModeration(selectedChat._id, msg.id, "approved")
                    }
                  >
                    <Check className="text-green-600" />
                  </IconButton>
                  <IconButton
                    sx={{ background: "white" }}
                    size="small"
                    onClick={() =>
                      handleModeration(selectedChat._id, msg.id, "rejected")
                    }
                  >
                    <X className="text-red-600" />
                  </IconButton>
                </>
              ) : (
                <span
                  className={clsx(
                    "text-xs font-semibold",
                    msg.status === "approved"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {msg.status === "approved" ? "Allowed" : "Disabled"}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      );
    });

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 min-w-[240px] bg-gradient-to-b from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d]text-white p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="rounded-full w-10 h-10"
          />
          <span className="ml-3 text-lg font-semibold">Chat</span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex-1 overflow-auto">
          <h2 className="text-black font-bold text-md mb-2 flex justify-between items-center">
            Messages
            <RefreshIcon
              className="cursor-pointer text-black"
              onClick={handleRefresh}
            />
          </h2>
          <ul className="space-y-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={clsx(
                    "p-2 rounded-lg cursor-pointer hover:bg-white hover:text-black",
                    selectedChat?._id === chat._id && "bg-white text-black"
                  )}
                >
                  {usersData[chat.sender]?.fullName || "Loading..."} ↔{" "}
                  {usersData[chat.receiver]?.fullName || "Loading..."}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">
                {searchTerm ? "No matching chats found" : "No chats available"}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 h-[80vh] overflow-y-scroll flex flex-col bg-white overflow-hidden w-full">
        {selectedChat ? (
          <>
            <div className="text-xl font-bold mb-4 border-b pb-2">
              {usersData[selectedChat.sender]?.fullName || "Sender"} &rarr;{" "}
              {usersData[selectedChat.receiver]?.fullName || "Receiver"}
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col space-y-2">
              {renderMessages()}
            </div>
            <div className="mt-4">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Type a message..."
                disabled
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            {searchTerm
              ? "No chat selected from search results"
              : "Select a chat to view messages"}
          </div>
        )}
      </div>
    </div>
  );
}
