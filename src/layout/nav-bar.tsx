import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Popover,
  Badge,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { navItems } from "./menu-items/menu-items";
import UserForm from "@/components/form";
import {
  adminSchema,
  entrepreneurSchema,
  investorSchema,
} from "./user-data/index";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import APIs from "@/utils/api-handler";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsIcon from "@mui/icons-material/Notifications";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Chat,
  ChatBubble,
  ChatBubbleRounded,
  NotificationsOutlined,
} from "@mui/icons-material";
import Bids from "@/components/bids/Bids";
import MyMessages from "@/components/messages/MyMessages";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string | null>(
    localStorage.getItem("color")
  );
  const [activeUser, setActiveUser] = useState(null);
  const [tableTitle, setTableTitle] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  const [open, setOpen] = React.useState(false);

  let token = null;
  token = localStorage.getItem("token");

  const router = useRouter();

  const itemsStyles = {
    fontSize: "13px",
    fontFamily: "Inter",
    letterSpacing: "0.5px",
    fontWeight: "500",
    color: "#252C32",
    borderRadius: "6px",
    display: "flex",
    gap: "2px",
  };

  const isMenuOpen = Boolean(anchorEl);

  // Handle popover open/close
  const handleOpen2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => setAnchorEl2(null);

  const open2 = Boolean(anchorEl2);
  const id = open2 ? "notification-popover" : undefined;

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // Profile modal handler
  const handleProfile = () => {
    setIsModalOpen(true);
    localStorage.setItem("action", "");
  };
  // confimation box handler
  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    handleClose();
    setIsModalOpen(false);
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    localStorage.removeItem("activeUser");
    localStorage.removeItem("token");
    localStorage.removeItem("profileExist");
    localStorage.removeItem("signup");
    localStorage.removeItem("company");
    localStorage.removeItem("actionId");
    localStorage.removeItem("action");
    localStorage.removeItem("reqApproval");
    window.location.href = "/";
    // router.push('/');
  };
  //   rendering diologbox
  const DialogBox = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WarningAmberIcon color="warning" />
          <Typography variant="h6">Confirm Logout</Typography>
        </DialogTitle>

        <DialogContent>
          <Typography id="logout-dialog-description" variant="body1">
            Are you sure you want to logout? You will be redirected to the login
            page and any unsaved data will be lost.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleButtonClick} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setOpen(true);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose(), handleProfile();
        }}
        sx={itemsStyles}
      >
        <PersonIcon fontSize="small" color="action" sx={{ padding: "2px" }} />
        My Profile
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={itemsStyles}>
        <LogoutIcon fontSize="small" color="action" sx={{ padding: "1.5px" }} />
        Log Out
      </MenuItem>
    </Menu>
  );

  // signup handler
  const handleSignUp = () => {
    localStorage.setItem("signup", "true");
    router.push("/signup");
  };

  // Dynamic color handler
  const handleDynamicColor = (e: any) => {
    // const selectedColor = e.target.value;
    // localStorage.setItem("color", selectedColor);
    // setBgColor(selectedColor); // Update state to change the color in real-time
  };

  // Reset dynamic color
  const handleResetColor = () => {
    localStorage.removeItem("color");
    setBgColor(null); // Reset the background color in state
  };

  // Modal Close Handler
  const modalCloseHandler = () => {
    setIsModalOpen(false);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  // API call for approval
  const handleApprove = async (userId: string) => {
    const token = localStorage.getItem("token");
    let getUser = localStorage.getItem("user");
    getUser = JSON.parse(getUser);

    const endPoint = "approval/update-status",
      method = "PUT",
      headers = {
        Authorization: `Bearer ${token}`,
      },
      reqData = null;

    const apiResponse = await APIs(
      endPoint,
      userId,
      method,
      headers,
      reqData,
      false
    );

    if (apiResponse?.status === 201) {
      toast.success("Status Successfully Updated.");
    } else {
      console.log("something went wrong during data fetching");
    }
  };

  // UseEffect to set the color from localStorage on initial load
  useEffect(() => {
    setBgColor(localStorage.getItem("color"));
    const getActiveUser = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);

      if (user?.role === "Admin") {
        setTableTitle("Welcome to Admin Profile");
        setFormFields(adminSchema);
      } else if (user?.role === "Investor") {
        setTableTitle("Welcome to Investor Profile");
        setFormFields(investorSchema);
      } else if (user?.role === "Entrepreneur") {
        setTableTitle("Welcome to Entrepreneur Profile");
        setFormFields(entrepreneurSchema);
      }
    };
    getActiveUser();
  }, []);

  React.useEffect(() => {
    const fetchApprovalUsers = async () => {
      const token = localStorage.getItem("token");
      let getUser = localStorage.getItem("user");
      getUser = JSON.parse(getUser);

      const endPoint = "approval",
        id = null,
        method = "GET",
        headers = {
          Authorization: `Bearer ${token}`,
        },
        reqData = null;

      const apiResponse = await APIs(
        endPoint,
        id,
        method,
        headers,
        reqData,
        false
      );

      if (apiResponse?.status === 200) {
        let requireData = null;
        // show specific data for entrepreneur
        if (getUser?.role === "Admin") {
          requireData = apiResponse?.data?.data;
          setApprovalData(requireData);
          console.log("output", { requireData });
        } else {
        }
      } else {
        console.log("something went wrong during data fetching");
      }
    };
    fetchApprovalUsers();
  }, [refresh]);

  let myUser = JSON.parse(localStorage.getItem("user"));

  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  user = user?.profilePicture;

  const navItems = [
    { title: "Home", icon: "🏠", link: "/" },
    // { title: "About", icon: "📖", link: "/about" },
    { title: "Contact", icon: "📞", link: "/contact" },
  ];

  return (
    <div
      className="flex items-center sticky top-0 z-50  
bg-[radial-gradient(ellipse_at_top,_#efe9e1_0%,_#ac9c8d_70%)]  
border-b border-[#ac9c8d]/50  
shadow-[0_0_12px_rgba(172,156,141,0.2)]  
text-[#3a3630] hover:text-[#1a1714] transition-colors"
    >
      <nav
        className={`p-5 w-full  border-b-[#E5E9EB] ${token ? "" : ""}`}
        style={{ backgroundColor: token ? bgColor || "" : "" }} // Use bgColor state here
      >
        <Toaster />
        <div className="w-full px-6">
          <div className="lg:flex lg:items-center lg:justify-between">
            {/* nav-logo */}
            <Link href="/">
              <img
                src={"/Logo.svg"}
                alt="Logo"
                width={120}
                height={50}
                className="absolute mb-2 top-[-27px]"
              />
            </Link>
            <div className="flex justify-between items-center">
              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="text-gray-500 dark:focus:text-gray-400 dark:hover:text-gray-400 dark:text-gray-200 focus:outline-none focus:text-gray-600 hover:text-gray-600"
                  aria-label="toggle menu"
                >
                  {isOpen ? <CloseIcon /> : <MenuIcon color="disabled" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              className={`${
                isOpen
                  ? "translate-x-0 opacity-100 bg-[#F6F8F9] h-[calc(100vh-65px)] mt-4"
                  : "opacity-0 -translate-x-full"
              } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
            >
              <div className="flex flex-wrap justify-evenly gap-3 items-center lg:mt-0 mb-2">
                <nav>
                  <ul className="m-0">
                    <div className="gap-4 hidden ml-auto place-items-end sm:flex">
                      {navItems.map((item, key) => {
                        return (
                          <Link
                            href={item?.link}
                            className="flex bg-clip-text text-lg  font-semibold  gap-1 hover:cursor-pointer hover:font-extrabold hover:transition-all text-gray-800"
                          >
                            {item.title}{" "}
                          </Link>
                        );
                      })}
                      {/* {token && (
                        <div className="flex items-center relative">
                          <button
                            className="flex bg-clip-text bg-gradient-to-r text-lg text-transparent font-semibold from-white/50 gap-1 hover:cursor-pointer hover:font-extrabold hover:transition-all to-white"
                            onClick={handleResetColor}
                          >
                            Default color
                          </button>

                          <input
                            type="color"
                            placeholder="dynamic layout"
                            className="opacity-0 relatice z-40"
                            onChange={handleDynamicColor}
                          />
                          <img
                            src="/color-pallet.png"
                            width={35}
                            height={35}
                            className="-z-3 absolute right-0"
                            alt=""
                          />
                        </div>
                      )} */}
                      {myUser?.role == "Admin" || !myUser ? (
                        ""
                      ) : (
                        <Link href="/chatScreen">
                          <Chat
                            size={25}
                            aria-describedby={id}
                            className="text-gray-800 cursor-pointer"
                          />
                        </Link>
                      )}

                      <Bids />
                    </div>
                  </ul>
                </nav>

                {/* profile and register section */}
                {token ? (
                  <>
                    {/* Rendering Notification */}
                    {activeUser?.role === "Admin" && (
                      <div className="flex items-center">
                        {/* Notification Icon with Badge */}
                        <IconButton aria-describedby={id} onClick={handleOpen2}>
                          <Badge
                            badgeContent={approvalData.length}
                            color="success"
                          >
                            <NotificationsIcon fontSize="medium" />
                          </Badge>
                        </IconButton>

                        {/* Popover for dropdown modal */}
                        <Popover
                          id={id}
                          open={open2}
                          anchorEl={anchorEl2}
                          onClose={handleClose2}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <div className="p-8 max-w-sm space-y-4">
                            <span className="flex justify-between items-center">
                              <Typography
                                variant="h6"
                                className="font-semibold"
                              >
                                Approval List
                              </Typography>
                              <Tooltip title="Filter list">
                                <RefreshIcon
                                  sx={{ color: "#2E7D32", marginRight: "10px" }}
                                  className="hover:cursor-pointer"
                                  onClick={handleRefresh}
                                />
                              </Tooltip>
                            </span>
                            {approvalData.map((user) => (
                              <div
                                key={user._id}
                                className="flex flex-col bg-gray-100 rounded-lg shadow-md px-8 py-4"
                              >
                                <p className="text-sm font-medium">
                                  Name: {user.fullName}
                                </p>
                                <p className="text-sm">Email: {user.email}</p>
                                <p className="text-sm">Role: {user.role}</p>
                                <p className="text-sm">Status: {user.status}</p>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className="h-8 w-24"
                                  sx={{
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                    marginTop: "8px",
                                  }}
                                  onClick={() => handleApprove(user._id)}
                                >
                                  Approve
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Popover>
                      </div>
                    )}
                    {/* end notification rendering */}
                    <IconButton
                      size="small"
                      aria-label="navbar profile user picture"
                      color="inherit"
                      sx={{ padding: "8px" }}
                      onClick={handleProfileMenuOpen}
                    >
                      <img
                        src={
                          user ? `http://localhost:8080${user}` : "/user.avif"
                        }
                        alt="Avatar"
                        width={35} // Specify width
                        height={35} // Specify height
                        className="rounded-lg hover:transition-all object"
                      />
                    </IconButton>
                  </>
                ) : (
                  <div className="flex gap-1 ml-2 mr-1">
                    <span onClick={handleSignUp} title="signup / login">
                      <HowToRegIcon
                        fontSize="large"
                        className="text-gray-700 hover:cursor-pointer hover:text-black"
                      />
                    </span>
                  </div>
                )}

                {/* dynamic color section */}
              </div>
            </div>
          </div>
        </div>
        {renderMenu}
      </nav>

      {/* Render User Profile modal */}
      {isModalOpen && (
        <UserForm
          title={tableTitle}
          isOpen={isModalOpen}
          closeHandler={modalCloseHandler}
          activeUser={activeUser}
          fields={formFields}
          data={null}
          updateId={null}
        />
      )}

      <DialogBox />
    </div>
  );
};

export default Navbar;
