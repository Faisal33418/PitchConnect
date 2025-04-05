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
      <div className="h-[89vh] bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 flex items-center justify-center  p-4 overflow-hidden relative">
        {/* Animated Blobs */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          <div className="blob blob-1 animate-blob-1"></div>
          <div className="blob blob-2 animate-blob-2"></div>
          <div className="blob blob-3 animate-blob-3"></div>
          <div className="blob blob-4 animate-blob-4"></div>
          <div className="blob blob-5 animate-blob-5"></div>
          <div className="blob blob-6 animate-blob-6"></div>
          <div className="blob blob-7 animate-blob-7"></div>
          <div className="blob blob-8 animate-blob-8"></div>
          <div className="blob blob-9 animate-blob-9"></div>
          <div className="blob blob-10 animate-blob-10"></div>
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
      <style jsx>{`
        .blob {
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #4094f7, #9b59b6);
          border-radius: 50%;
          filter: blur(5px);
          opacity: 0.3;
          z-index: 1;
          animation: float 8s ease-in-out infinite, colorChange 10s infinite,
            morph 12s infinite;
        }

        .blob-1 {
          top: 6%;
          left: 4%;
        }
        .blob-2 {
          top: 5%;
          left: 70%;
        }
        .blob-3 {
          top: 50%;
          left: 10%;
        }
        .blob-4 {
          top: 60%;
          left: 80%;
        }
        .blob-5 {
          top: 30%;
          left: 40%;
        }
        .blob-6 {
          top: 80%;
          left: 90%;
        }
        .blob-7 {
          top: 10%;
          left: 50%;
        }
        .blob-8 {
          top: 70%;
          left: 60%;
        }
        .blob-9 {
          top: 40%;
          left: 90%;
        }
        .blob-10 {
          top: 90%;
          left: 20%;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes colorChange {
          0% {
            background: linear-gradient(45deg, #4094f7, #9b59b6);
          }
          25% {
            background: linear-gradient(45deg, #ff9a9e, #fad0c4);
          }
          50% {
            background: linear-gradient(45deg, #a18cd1, #fbc2eb);
          }
          75% {
            background: linear-gradient(45deg, #fbc2eb, #a6c1ee);
          }
          100% {
            background: linear-gradient(45deg, #4094f7, #9b59b6);
          }
        }

        @keyframes morph {
          0%,
          100% {
            border-radius: 50% 50% 60% 40% / 60% 50% 50% 40%;
          }
          25% {
            border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
          }
          50% {
            border-radius: 60% 40% 50% 50% / 40% 60% 50% 50%;
          }
          75% {
            border-radius: 50% 50% 40% 60% / 50% 50% 60% 40%;
          }
        }

        .animate-blob-1 {
          animation: float 8s ease-in-out infinite, colorChange 10s infinite,
            morph 12s infinite;
        }

        .animate-blob-2 {
          animation: float 10s ease-in-out infinite, colorChange 12s infinite,
            morph 14s infinite;
        }

        .animate-blob-3 {
          animation: float 12s ease-in-out infinite, colorChange 14s infinite,
            morph 16s infinite;
        }
        .animate-blob-4 {
          animation: float 8s ease-in-out infinite, colorChange 10s infinite,
            morph 12s infinite;
        }

        .animate-blob-5 {
          animation: float 10s ease-in-out infinite, colorChange 12s infinite,
            morph 14s infinite;
        }

        .animate-blob-6 {
          animation: float 12s ease-in-out infinite, colorChange 14s infinite,
            morph 16s infinite;
        }
        .animate-blob-7 {
          animation: float 8s ease-in-out infinite, colorChange 10s infinite,
            morph 12s infinite;
        }

        .animate-blob-8 {
          animation: float 10s ease-in-out infinite, colorChange 12s infinite,
            morph 14s infinite;
        }

        .animate-blob-9 {
          animation: float 12s ease-in-out infinite, colorChange 14s infinite,
            morph 16s infinite;
        }
      `}</style>
    </>
  );
};

export default SignUp;
