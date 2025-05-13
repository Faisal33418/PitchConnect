import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import SignIn from "../sign-in";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import APIs from "../../../utils/api-handler";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import LandingPage from "@/pages/home/landing";

const SignUp = () => {
  const [pwdVisible, setPwdVisible] = useState(false);
  const [renderLoginPage, setRenderLoginPage] = useState<boolean>(false);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState();
  const [landPage, setLandPage] = useState(false);
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setPwdVisible(!pwdVisible);
  };

  const inputStyles = {
    "& .MuiInputBase-root": {
      height: "50px",
      padding: "0 14px",
      borderRadius: "8px",
    },
    "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after": {
      display: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    // Full Name validation
    if (!fullName || fullName.length < 3 || /[^a-zA-Z\s]/.test(fullName)) {
      toast.error(
        "Full Name must be at least 3 characters long and should not contain numbers or special characters."
      );
      return;
    }

    // Email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (
      !password ||
      password.length < 8 ||
      !/[a-z]/.test(password) || // At least one lowercase letter
      !/[A-Z]/.test(password) || // At least one uppercase letter
      !/[0-9]/.test(password) || // At least one number
      !/[!@#$%^&*()]/.test(password) // At least one special character
    ) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    // Role validation
    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    // Constructing the data object
    const data = {
      fullName,
      email,
      password,
      role,
    };

    const headers = {
      "Content-Type": "Application/json",
    };

    // Call API
    try {
      const apiResponse = await APIs(
        "user/create",
        null,
        "POST",
        headers,
        data,
        false
      );

      console.log("res", apiResponse);
      if (apiResponse?.status === 201) {
        const getToken = apiResponse?.data?.data?.token;
        console.log("gettoken", getToken, apiResponse.data.token);
        toast.success(apiResponse?.data?.message);
        setTimeout(() => {
          setRenderLoginPage(true);
        }, 2000);
      } else {
        toast.error(
          apiResponse?.data?.message || "Something went wrong! Try Again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error! Please try again later.");
    }
  };

  const handleBack = (e: any) => {
    e.preventDefault();
    setLandPage(true);
    router.push("/home");
  };

  const handleLogin = () => {
    setRenderLoginPage(true);
  };

  if (renderLoginPage) {
    return <SignIn />;
  }
  if (landPage) {
    return <LandingPage />;
  }

  return (
    <>
      <Toaster />
      <div className="h-[88vh] bg-gradient-to-r from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d]   flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated Blobs */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`blob blob-${i + 1}`}
              style={{
                position: "absolute",
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                background: `radial-gradient(circle, ${
                  i % 2 === 0 ? "#B384BD" : "#0A21C0"
                }, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(40px)",
                opacity: 0.7,
                zIndex: 1,
                transform: `translate(${Math.random() * 100}vw, ${
                  Math.random() * 100
                }vh)`,
                animation: `float ${
                  8 + Math.random() * 10
                }s ease-in-out infinite, 
                   pulse ${
                     5 + Math.random() * 5
                   }s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Form Container */}
        <div className="w-full  max-w-md backdrop-blur-2xl bg-white  rounded-lg shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl relative z-10">
          <Link
            href="/home"
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200 mb-6"
            onClick={handleBack}
          >
            <ChevronLeftIcon className="mr-2" />
            Back to home
          </Link>

          <p className="text-3xl font-bold text-gray-800 mb-8">Sign Up</p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSignUp}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#4094F7",
                  },
                },
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#4094F7",
                  },
                },
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Enter Password"
              name="password"
              type={pwdVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "#4094F7",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {pwdVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Role Dropdown */}
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": {
                      borderColor: "#4094F7",
                    },
                  },
                }}
              >
                <MenuItem value="Investor">Investor</MenuItem>
                <MenuItem value="Entrepreneur">Entrepreneur</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "capitalize",
                backgroundColor: "#4094F7",
                "&:hover": {
                  backgroundColor: "#3778c2",
                },
              }}
              type="submit"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              Already have an account?{" "}
              <span
                onClick={handleLogin}
                className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200"
              >
                Login
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Add this CSS for blobs */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(5vw, -5vh);
          }
          50% {
            transform: translate(10vw, 0);
          }
          75% {
            transform: translate(5vw, 5vh);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .blob:hover {
          opacity: 0.9 !important;
          filter: blur(30px) brightness(1.2) !important;
          transform: scale(1.3) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default SignUp;
