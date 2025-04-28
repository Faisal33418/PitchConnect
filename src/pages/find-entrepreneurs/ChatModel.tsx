import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, Avatar, Typography } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";
import moment from "moment";

export default function ChatModel({ receiver, name, image }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [messages, setMessages] = useState({ chat: [] }); // Local state for each chat instance

  const myUser = JSON.parse(localStorage.getItem("user"));

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setLoading(true);
    const messageContent = input;
    setInput("");

    try {
      const senderType = myUser?.role;
      const receiverType =
        senderType === "Investor" ? "Entrepreneur" : "Investor";

      // Update local state immediately
      setMessages((prev) => ({
        ...prev,
        chat: [
          ...(prev?.chat || []),
          { message: messageContent, sender: myUser?._id },
        ],
      }));

      await axios.post(
        `http://localhost:8080/api/chat/send-message/${myUser?._id}/${receiver}`,
        {
          message: messageContent,
          sender: myUser?._id,
          receiver: receiver,
          senderType,
          receiverType,
        }
      );

      // Refresh messages after sending to ensure sync
      await fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      // toast.error(error.response?.data?.message || "Error sending message");
      // Revert if failed
      setInput(messageContent);
      setMessages((prev) => ({
        ...prev,
        chat: prev?.chat?.filter((msg) => msg.message !== messageContent) || [],
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/messages/${myUser?._id}/${receiver}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // toast.error("Failed to load messages");
    }
  }, [myUser?._id, receiver]);

  useEffect(() => {
    if (open && myUser?._id && receiver) {
      fetchMessages();
    }
  }, [open, myUser?._id, receiver, fetchMessages]);

  useEffect(() => {
    setDisabled(input.trim() === "" || loading);
  }, [input, loading]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      sendMessage();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={toggleDrawer(true)}
        sx={{
          textTransform: "none",
          borderRadius: "4px",
          padding: "8px 16px",
        }}
      >
        <ChatIcon sx={{ marginRight: 1 }} />
        Chat
      </Button>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "60vh",
            width: "100%",
            maxWidth: "400px",
            marginLeft: "auto",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            boxShadow: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar
              src={image ? `http://localhost:8080${image}` : "/user.avif"}
              alt={name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle1" fontWeight="medium">
              {name}
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "background.default",
            }}
          >
            {messages?.chat?.length > 0 ? (
              messages.chat.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === myUser?._id ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: "75%",
                      bgcolor:
                        msg.sender === myUser?._id
                          ? "primary.main"
                          : "grey.100",
                      color:
                        msg.sender === myUser?._id ? "white" : "text.primary",
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body1">
                      {msg.message}

                      <Typography
                        variant="caption"
                        display="block"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {new Date(msg?.id || Date.now()).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "text.secondary",
                }}
              >
                <Typography>No messages yet</Typography>
              </Box>
            )}
          </Box>

          {/* Message Input */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              gap: 1,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <IconButton
              disabled={disabled || loading}
              color="primary"
              onClick={sendMessage}
              sx={{
                width: 40,
                height: 40,
                alignSelf: "center",
              }}
            >
              {loading ? (
                <ThreeCircles height={20} width={20} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
