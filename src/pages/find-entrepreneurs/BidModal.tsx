import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { Report } from "@mui/icons-material";
import toast from "react-hot-toast";
import { RevolvingDot, ThreeCircles } from "react-loader-spinner";
import { FadeLoader } from "react-spinners";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 54,
  p: 4,
};

export default function BidModel({ id }) {
  // console.log(id);
  // investor id
  const user_id = JSON.parse(localStorage.getItem("user"));
  const [amount, setAmount] = React.useState();
  const [bidAmount, setBidAmount] = React.useState("");
  const [isAmount, setIsAmount] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  // get bid amount
  const getBidAmount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/get-bid-amount/${id}`
      );
      setAmount(response.data);
    } catch (error) {
      console.error("Error fetching bid amount:", error);
    }
  };

  React.useEffect(() => {
    getBidAmount();
  }, []);

  React.useEffect(() => {
    if (bidAmount > amount) {
      setIsAmount(false);
    } else {
      setIsAmount(true);
    }
  }, [bidAmount]);

  const addBid = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/pconnect-app/entrepreneur/bid/${id}`,
        {
          investor_id: user_id,
          bid_amount: bidAmount,
        }
      );
      toast.success("Bided Successfully!");
      getBidAmount();
      handleClose2();
      setBidAmount("");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  return (
    <div>
      <Button
        onClick={handleOpen2}
        variant="contained"
        // sx={{ marginTop: "1rem" }}
      >
        Bid
      </Button>
      <Modal
        open={open2}
        onClose={handleClose2}
        sx={{ backdropFilter: "blur(5px)" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h1 className="text-2xl text-center text-gray-800 font-semibold mb-4">
              Bid this Pitch
            </h1>
            <form>
              <div className="flex font-semibold gap-2 items-center my-4">
                <Report className="text-yellow-500" />
                <Typography className="text-sm font-semibold" variant="p">
                  The Bid should be greater than{" "}
                  <span className="font-bold">${amount}</span>
                </Typography>
              </div>
              <div className="mb-4">
                <input
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  type="number"
                  className="border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
                  placeholder="Enter your bid"
                  required
                />
              </div>
              <button
                onClick={addBid}
                disabled={isAmount || loading}
                type="submit"
                className={` rounded-lg text-white w-full focus:outline-none focus:ring-2 ${
                  isAmount || loading
                    ? " font-semibold bg-gray-300 "
                    : "focus:ring-blue-500 font-semibold bg-blue-500 hover:bg-blue-600"
                } py-2`}
              >
                {loading ? (
                  <ThreeCircles
                    height={30}
                    width={30}
                    color="black"
                    wrapperClass="flex justify-center"
                  />
                ) : (
                  "Submit Bid"
                )}
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
