import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChatIcon from "@mui/icons-material/Chat";
import TextField from "@mui/material/TextField";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Badge,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import PersonIcon from "@mui/icons-material/Person";
import { deepOrange, deepPurple } from "@mui/material/colors";

export default function MessagesPopOver() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [chats, setChats] = React.useState<any[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [usersData, setUsersData] = React.useState<Record<string, any>>({});
  const [myChat, setMyChat] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/get-my-chats/${user?._id}`
      );

      if (Array.isArray(response.data)) {
        setChats(response.data);

        // Pre-fetch user data for all chat participants
        const userIds = new Set<string>();
        response.data.forEach((chat: any) => {
          if (chat.sender) userIds.add(chat.sender);
          if (chat.receiver) userIds.add(chat.receiver);
        });

        // Fetch user data for all unique user IDs
        const usersResponse = await Promise.all(
          Array.from(userIds).map(async (userId) => {
            const res = await axios.get(
              `http://localhost:8080/api/chat/get-user-data/${userId}`
            );
            return { id: userId, data: res.data };
          })
        );

        // Convert array to map
        const usersMap = usersResponse.reduce((acc, curr) => {
          acc[curr.id] = curr.data;
          return acc;
        }, {} as Record<string, any>);

        setUsersData(usersMap);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  React.useEffect(() => {
    if (user?._id) {
      fetchChats();
    }
  }, [user?._id]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedChat(null);
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };

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
      setSelectedChat((prev: any) => ({
        ...prev,
        chat: [
          ...prev.chat,
          {
            id: Date.now(),
            message: newMessage,
            sender: user._id,
            status: "pending",
          },
        ],
      }));

      setNewMessage("");
      toast.success("Message sent for verification");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error sending message");
    } finally {
      setLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Function to get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRefresh = (chat) => {
    fetchChats();
    handleSelectChat(chat);
  };

  return (
    <div>
      <Badge
        badgeContent={chats.filter((c) => c.unreadCount > 0).length}
        color="error"
        overlap="circular"
      >
        <ChatIcon
          size={25}
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          className="text-white cursor-pointer"
        />
      </Badge>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {selectedChat ? (
            // Chat View
            <Box
              sx={{
                width: "350px",
                height: "450px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  mb: 2,
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <Avatar
                  src={
                    usersData[
                      selectedChat.sender === user._id
                        ? selectedChat.receiver
                        : selectedChat.sender
                    ]?.profilePicture?.[0]
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: deepPurple[500],
                  }}
                >
                  {getInitials(
                    usersData[
                      selectedChat.sender === user._id
                        ? selectedChat.receiver
                        : selectedChat.sender
                    ]?.fullName
                  )}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {usersData[
                    selectedChat.sender === user._id
                      ? selectedChat.receiver
                      : selectedChat.sender
                  ]?.fullName || "Unknown User"}
                </Typography>
                <Button
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={() => setSelectedChat(null)}
                >
                  Back
                </Button>
                <RefreshIcon onClick={() => handleRefresh(myChat)} />
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  mb: 2,
                  p: 1,
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                }}
              >
                {selectedChat.chat
                  .filter((msg: any) => msg.status === "approved")
                  .map((msg: any) => {
                    const isSender = msg.sender === user._id;
                    const senderData = isSender ? user : usersData[msg.sender];

                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          mb: 2,
                          display: "flex",
                          flexDirection: isSender ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Avatar
                          src={senderData?.profilePicture?.[0]}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: isSender
                              ? deepPurple[500]
                              : deepOrange[500],
                          }}
                        >
                          {getInitials(senderData?.fullName)}
                        </Avatar>
                        <Box
                          sx={{
                            bgcolor: isSender ? "primary.main" : "grey.200",
                            color: isSender ? "white" : "text.primary",
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: "70%",
                            wordBreak: "break-word",
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="body2">{msg.message}</Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              textAlign: isSender ? "right" : "left",
                              color: isSender
                                ? "rgba(255,255,255,0.7)"
                                : "text.secondary",
                              mt: 0.5,
                            }}
                          >
                            {new Date(
                              msg.createdAt || Date.now()
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>

              {/* Message Input */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  label="Type a message"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  multiline
                  maxRows={3}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={loading || !newMessage.trim()}
                  sx={{ height: "40px" }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            // Chat List View
            <Box sx={{ width: "300px", maxHeight: "450px", overflowY: "auto" }}>
              <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
                Messages
              </Typography>
              <List>
                {chats.length > 0 ? (
                  chats.map((chat: any) => {
                    const otherUserId =
                      chat.sender === user._id ? chat.receiver : chat.sender;
                    const otherUser = usersData[otherUserId];
                    const lastMessage = chat.chat[chat.chat.length - 1];
                    const unreadCount = chat.unreadCount || 0;

                    return (
                      <ListItem
                        key={chat._id}
                        button
                        onClick={() => {
                          handleSelectChat(chat);
                          setMyChat(chat);
                        }}
                        sx={{
                          borderRadius: "8px",
                          mb: 0.5,
                          backgroundColor:
                            unreadCount > 0 ? "#f0f4ff" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              unreadCount > 0 ? "#e0e8ff" : "#f5f5f5",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={unreadCount > 0 ? unreadCount : null}
                            color="primary"
                            overlap="circular"
                          >
                            <Avatar
                              src={otherUser?.profilePicture?.[0]}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: deepPurple[500],
                              }}
                            >
                              {getInitials(otherUser?.fullName)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              fontWeight={unreadCount > 0 ? "bold" : "normal"}
                            >
                              {otherUser?.fullName || "Unknown User"}
                            </Typography>
                          }
                          secondary={
                            lastMessage ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontWeight:
                                    unreadCount > 0 ? "bold" : "normal",
                                }}
                              >
                                {lastMessage.sender === user._id ? "You: " : ""}
                                {lastMessage.message}
                              </Typography>
                            ) : null
                          }
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <Typography
                    sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
                  >
                    No messages yet
                  </Typography>
                )}
              </List>
            </Box>
          )}
        </Box>
      </Popover>
    </div>
  );
}
