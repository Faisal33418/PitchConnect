import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NotificationAdd } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import toast from "react-hot-toast";

export default function Bids() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [loading, setLoading] = React.useState(false);
  const [investor, setInvestor] = React.useState();
  const [bid, setBid] = React.useState("");
  const getUser = JSON.parse(localStorage.getItem("user"));
  const getBids = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/get-my-bids/${getUser?._id}`
      );

      setInvestor(response.data.investor_id);
      setBid(response.data.bid_amount);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser != null && getUser?.role == "Entrepreneur") {
      getBids();
    }
  }, []);

  const acceptBid = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/accept-bid/${getUser?._id}`,
        {
          investor_id: investor._id,
        }
      );
      toast.success("Bid Accepted!");
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      {getUser && (
        <>
          {investor && Object.keys(investor).length > 0 && (
            <IconButton aria-describedby={id} variant="" onClick={handleClick}>
              <NotificationAdd />
            </IconButton>
          )}
        </>
      )}

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
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto space-y-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src={
                investor?.profilePicture[0]
                  ? `http://localhost:8080${investor?.profilePicture[0]}`
                  : "/user.avif"
              }
              alt="Investor Profile"
              className="h-24 rounded-full w-24 object-cover"
            />
          </div>

          {/* Investor Information */}
          <h2 className="text-2xl text-center text-gray-800 font-semibold">
            {investor?.fullName}
          </h2>
          <p className="text-center text-gray-600">{investor?.role}</p>

          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Company:</strong> {investor?.companyName}
            </p>
            <p>
              <strong>Location:</strong> {investor?.location}
            </p>
            <p>
              <strong>Email:</strong> {investor?.email}
            </p>
            <p>
              <strong>Phone:</strong> {investor?.phoneNumber}
            </p>
            <p>
              <strong>Investment Range:</strong>{" "}
              {investor?.investmentAmountRange}
            </p>
            <p>
              <strong>Investment Type:</strong> {investor?.typeOfInvestment}
            </p>
            <p>
              <strong>Investment Goals:</strong> {investor?.investmentGoals}
            </p>
            <p>
              <strong>Status:</strong> {investor?.status}
            </p>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-2">
            <p>
              <strong>Skills:</strong> {investor?.skills}
            </p>
            <p>
              <strong>Industry Interest:</strong>{" "}
              {investor?.industryInterest.join(", ")}
            </p>
          </div>

          {/* Bid Information */}
          <div className="text-center mt-4">
            <p className="text-gray-800 font-semibold">Bid Amount: ${bid}</p>
          </div>
        </div>
        <div className="p-4">
          <Button
            onClick={acceptBid}
            variant="contained"
            sx={{
              margin: "1rem 0",
              width: "100%",
              background: `${loading ? "bg-gray-500" : ""}`,
            }}
          >
            {loading ? (
              <ThreeCircles
                height={30}
                width={30}
                color="black"
                wrapperClass="flex justify-center"
              />
            ) : (
              "Accept Bid"
            )}
          </Button>
        </div>
      </Popover>
    </div>
  );
}
