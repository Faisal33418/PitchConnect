import * as React from "react";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { ThreeCircles } from "react-loader-spinner";
import { useAppContext } from "@/context/AppContext";

export default function ChatModel({ receiver, name, image }) {
  const { messages, setMessages } = useAppContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const myUser = JSON.parse(localStorage.getItem("user"));

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setLoading(true);

    try {
      const senderType = myUser?.role; // e.g., 'Investor' or 'Entrepreneur'
      const receiverType =
        senderType == "Investor" ? "Entrepreneur" : "Investor"; // The role of the receiver, make sure it's a valid role like 'Investor' or 'Entrepreneur'

      const response = await axios.post(
        `http://localhost:8080/api/chat/send-message/${myUser?._id}/${receiver}`,
        {
          message: input,
          sender: myUser?._id, // Send the sender ID
          receiver: receiver, // Send the receiver ID
          senderType, // Send sender's role
          receiverType, // Send receiver's role (either 'Investor' or 'Entrepreneur')
        }
      );

      setMessages((prevMessages) => ({
        ...prevMessages,
        chat: [
          ...(prevMessages?.chat || []),
          { message: input, sender: myUser?._id },
        ],
      }));

      setInput(""); // Clear input field after sending
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending message");
    }

    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/messages/${myUser?._id}/${receiver}`
      );
      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  React.useEffect(() => {
    if (myUser?._id && receiver) {
      fetchMessages();
    }
  }, [myUser?._id, receiver]);

  React.useEffect(() => {
    setDisabled(input.trim() === "");
  }, [input]);

  return (
    <div>
      {/* Floating Chat Button */}
      <Button variant="contained" onClick={toggleDrawer(true)}>
        <ChatIcon />
      </Button>

      {/* Chat Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            height: "auto",
            width: "100%",
            maxWidth: "400px",
            marginLeft: "auto",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <div className="p-4 rounded-t-md bg-gray-200 flex items-center gap-2">
            <img
              src={image ? `http://localhost:8080${image}` : "/user.avif"}
              alt="Avatar"
              width={35}
              height={35}
              className="rounded-lg border border-blue-500 hover:transition-all object"
            />
            <h5 className="text-md capitalize">{name}</h5>
          </div>

          {/* Chat Messages */}
          <Paper
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              maxHeight: "50%",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {messages?.chat?.length > 0 ? (
              messages.chat.map((msg, index) => (
                <Box key={index} sx={{}}>
                  <Paper
                    sx={{
                      display: "inline-block",
                      p: 1,
                      backgroundColor:
                        msg.sender === myUser?._id ? "#1976D2" : "#E0E0E0",
                      color: msg.sender === myUser?._id ? "white" : "black",
                      borderRadius: 2,
                    }}
                  >
                    {msg.message}
                  </Paper>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: "center", color: "gray" }}>
                No messages yet
              </Box>
            )}
          </Paper>

          {/* Message Input */}
          <Box
            sx={{ display: "flex", p: 1, gap: "1rem", position: "relative" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              sx={{ width: "100%" }}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            {loading ? (
              <div className="flex justify-center items-center">
                <ThreeCircles
                  height={30}
                  width={30}
                  color="black"
                  wrapperClass="flex justify-center absolute right-[30px] top-1/2 -translate-y-1/2"
                />
              </div>
            ) : (
              <IconButton
                disabled={disabled}
                sx={{
                  position: "absolute",
                  right: "5px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                color={disabled ? "secondary" : "primary"}
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
