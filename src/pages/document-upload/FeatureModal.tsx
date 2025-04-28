import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { Star } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function FeatureModal({ _id, videoFilled, setVideoFilled }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = JSON.parse(localStorage?.getItem("user"));

  const featureIdea = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/feature-idea/${user?._id}`
      );

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe payment page
      } else {
        toast.error("Error processing payment.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Payment initiation failed. Try again.");
    }
  };

  return (
    <div>
      <Button
        disabled={!videoFilled}
        sx={{ background: `${!videoFilled ? "gray" : ""}` }}
        variant="contained"
        onClick={handleOpen}
      >
        Feature
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Feature Idea
          </Typography>
          <div className="flex gap-2">
            <Star className="text-yellow-500" />{" "}
            <p className="font-semibold">
              The Idea will be featured for 7 days
            </p>
          </div>
          <Button
            onClick={featureIdea}
            variant="contained"
            sx={{
              display: "block",

              marginLeft: "auto",
              marginTop: "1rem",
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
