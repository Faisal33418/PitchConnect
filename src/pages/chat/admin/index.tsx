// Keep all your imports as-is
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Menu, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import clsx from "clsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ContractModal from "@/components/modal-contract/ContractModal";

// Types unchanged
interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Message {
  id: string;
  message: string;
  senderType: string;
  status: string;
  isDocusign?: boolean;
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
  const [isDocuSignModalOpen, setIsDocuSignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleSendContract = async () => {
    if (!selectedChat) return;

    const sender = usersData[selectedChat.sender];
    const receiver = usersData[selectedChat.receiver];

    if (!sender?.email || !receiver?.email) {
      alert("Both participants must have valid email addresses");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send to sender
      const senderResponse = await axios.post(
        "http://localhost:8080/api/docusign/send",
        {
          receiverEmail: sender.email,
          receiverName: sender.fullName,
          templateId: "3c5d6bf3-d5a2-4630-89a8-17ee5aabe5c2",
        }
      );

      await axios.post(
        `http://localhost:8080/api/chat/send-message/${sender._id}/${receiver._id}`,
        {
          message: `🔗 ${senderResponse.data.signingUrl}`,
          sender: sender._id,
          receiver: receiver._id,
          senderType: "System",
          isDocusign: true,
        }
      );

      // Send to receiver
      const receiverResponse = await axios.post(
        "http://localhost:8080/api/docusign/send",
        {
          receiverEmail: receiver.email,
          receiverName: receiver.fullName,
          templateId: "3c5d6bf3-d5a2-4630-89a8-17ee5aabe5c2",
        }
      );

      await axios.post(
        `http://localhost:8080/api/chat/send-message/${receiver._id}/${sender._id}`,
        {
          message: `🔗 ${receiverResponse.data.signingUrl}`,
          sender: receiver._id,
          receiver: sender._id,
          senderType: "System",
          isDocusign: true,
        }
      );

      alert("✅ Contracts sent to both participants!");
      setIsDocuSignModalOpen(false);
      getChats(); // Refresh to show new messages
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to send contracts. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractUrlFromMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.match(urlRegex);
    return matches ? matches[0] : "#";
  };

  // Helper function to extract envelope ID from DocuSign URL
  const extractEnvelopeId = (message: string) => {
    const url = extractUrlFromMessage(message);
    if (!url.includes("docusign.net")) return "";

    const match = url.match(/\/envelopes\/([^\/]+)/);
    return match ? match[1] : "";
  };

  const renderMessages = () =>
    selectedChat?.chat.map((msg) => {
      const isEntrepreneur = msg.senderType === "Entrepreneur";
      const isLink =
        msg.message.includes("http") || msg.message.includes("docusign.net");
      const isDocusignLink = msg.message.includes("docusign.net");

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
              : "bg-blue-500 text-white self-end mr-2",
            isDocusignLink && "bg-yellow-50 border border-yellow-200" // Special styling for DocuSign links
          )}
        >
          <div className="font-bold text-xs mb-1">
            {msg.senderType === "Entrepreneur" ? "Entrepreneur" : "Investor"}
          </div>
          <div className="flex gap-2 items-center">
            {isLink ? (
              <a
                href={extractUrlFromMessage(msg.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "hover:underline",
                  isDocusignLink ? "text-blue-600 font-medium" : "text-blue-500"
                )}
              >
                {isDocusignLink ? "📄 Sign Contract" : "Open Link"}
              </a>
            ) : (
              <p className="mb-1 whitespace-pre-wrap break-words">
                {msg.message}
              </p>
            )}
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
      {/* DocuSign Modal */}
      {isDocuSignModalOpen && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
              Send Document for Signatures
            </h2>
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">
                  Participants:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {usersData[selectedChat.sender]?.fullName || "Sender"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {usersData[selectedChat.sender]?.email || "No email"}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Signer 1
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {usersData[selectedChat.receiver]?.fullName ||
                          "Receiver"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {usersData[selectedChat.receiver]?.email || "No email"}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Signer 2
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsDocuSignModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendContract}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send to Both"}
                </button>
              </div>
              {error && (
                <div className="text-red-500 mt-4 text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-1/4 min-w-[240px] bg-gradient-to-b from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d]text-white p-4 flex flex-col">
        <div className="flex items-center mb-6">
          {/* <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="rounded-full w-10 h-10"
          /> */}
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
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold mb-4 border-b pb-2">
                {usersData[selectedChat.sender]?.fullName || "Sender"} &rarr;{" "}
                {usersData[selectedChat.receiver]?.fullName || "Receiver"}{" "}
              </div>
              <div className="flex gap-3 items-center">
                <ContractModal
                  Entrepreneur={usersData[selectedChat.sender]?.email}
                  investor={usersData[selectedChat.receiver]?.email}
                />

                <Button
                  variant="contained"
                  className="font-bold mb-4 border-b pb-2"
                  onClick={() => setIsDocuSignModalOpen(true)}
                >
                  Send Contract
                </Button>
              </div>
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
