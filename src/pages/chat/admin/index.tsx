import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Menu, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import clsx from "clsx";
import RefreshIcon from "@mui/icons-material/Refresh";
interface User {
  _id: string;
  fullName: string;
  // add other user properties as needed
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

  const getChats = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/chat/get-all-chats"
    );
    setChats(response.data);

    // Pre-fetch user data for all chats
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
          setUsersData((prev) => ({
            ...prev,
            [userId]: userResponse.data,
          }));
        }
      })
    );
  };

  useEffect(() => {
    getChats();
  }, []);

  const myUser = JSON.parse(localStorage.getItem("user") || "null");

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

  const renderMessages = (senderType: string) =>
    selectedChat?.chat
      ?.filter((msg) => msg.senderType === senderType)
      .map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "relative bg-white shadow-md p-3 rounded-md border-l-4 mb-4",
            msg.status === "approved"
              ? "border-green-500"
              : msg.status === "rejected"
              ? "border-red-500"
              : "border-yellow-500"
          )}
        >
          <p className="text-gray-800">{msg.message}</p>
          <div className="absolute top-2 right-2 flex gap-1">
            {msg.status === "pending" ? (
              <>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleModeration(selectedChat._id, msg.id, "approved")
                  }
                  className="text-green-600 hover:text-green-800"
                >
                  <Check />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleModeration(selectedChat._id, msg.id, "rejected")
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <X />
                </IconButton>
              </>
            ) : (
              <span
                className={clsx(
                  "text-sm font-semibold",
                  msg.status === "approved" ? "text-green-600" : "text-red-600"
                )}
              >
                {msg.status === "approved" ? "Allowed" : "Disabled"}
              </span>
            )}
          </div>
        </motion.div>
      ));

  return (
    <div className="relative w-full flex h-screen bg-gradient-to-r from-[#141619] via-[#202E3A] to-[#050A44] overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full bottom-20 right-20 animate-pulse" />
      </div>

      {/* Sidebar */}
      <div className="relative w-1/4 bg-white shadow-lg p-4 border-r border-gray-300 z-10">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <div className="flex items-center justify-between w-full">
            Message Requests
            <RefreshIcon className="cursor-pointer" onClick={handleRefresh} />
          </div>
        </h2>
        <ul className="mt-4 space-y-2">
          {chats?.map((chat) => (
            <li
              key={chat._id}
              className={`p-2 rounded-lg cursor-pointer ${
                selectedChat?._id === chat._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <p>
                {usersData[chat.sender]?.fullName || "Loading..."} ↔{" "}
                {usersData[chat.receiver]?.fullName || "Loading..."}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="relative w-3/4 flex gap-4 p-6 z-10">
        {/* Entrepreneur Side */}
        <div className="flex-1 bg-gradient-to-br from-teal-300 to-cyan-500 border-4 border-black rounded-lg p-4 overflow-auto">
          <div className="bg-white border-2 border-black w-fit px-4 py-1 font-bold mb-4">
            Entrepreneur
          </div>
          {renderMessages("Entrepreneur")}
        </div>

        {/* Investor Side */}
        <div className="flex-1 bg-gradient-to-br from-purple-300 to-blue-500 border-4 border-black rounded-lg p-4 overflow-auto">
          <div className="bg-white border-2 border-black w-fit px-4 py-1 font-bold mb-4">
            Investor
          </div>
          {renderMessages("Investor")}
        </div>
      </div>
    </div>
  );
}
