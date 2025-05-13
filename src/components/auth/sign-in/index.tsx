import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Apple } from "@mui/icons-material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { useRouter } from "next/router";
import Link from "next/link";
import VerificationModal from "@/components/verification-modal";
import SignUp from "../sign-up";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DoctorVerificationModal from "@/components/doctor-verification-modal";
import toast, { Toaster } from "react-hot-toast";
import APIs from "@/utils/api-handler";

const SignIn = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [openDigitModal, setOpenDigitModal] = useState<boolean>(false);
  const [isRegisterActive, setIsRegisterActive] = useState<boolean>(false);

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

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // localStorage.setItem("login", "true");
    // localStorage.setItem('token', 'true');
    // setOpenVerifyModal(true);
    // router.push("/dashboard");

    // e.preventDefault();

    // Constructing the data object
    const data = {
      email: email,
      password: password,
    };
    const getToken = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken}`,
    };

    // Call API
    const apiResponse = await APIs(
      "user/sign-in",
      null,
      "POST",
      headers,
      data,
      false
    );
    console.log("login response", apiResponse);
    if (apiResponse?.status === 200) {
      const getToken = apiResponse?.data?.token;
      const profileExist = apiResponse?.data?.data?.profileExist;
      localStorage.setItem("token", getToken);
      localStorage.setItem("profileExist", profileExist);
      toast.success(apiResponse?.data?.message);
      // setToken(getToken);
      setTimeout(() => {
        // setRenderLoginPage(true);
        localStorage.setItem("user", JSON.stringify(apiResponse?.data?.data));
        // router.push('/dashboard');
        window.location.href = "/";
      }, 1000);
    } else {
      toast.error("Something went wrong ! Try Again.");
    }
  };

  const handleRegister = () => {
    // localStorage.setItem('token', 'true');
    setIsRegisterActive(true);
  };
  if (isRegisterActive) {
    return <SignUp />;
  }

  // useEffect(() => {
  //   localStorage.removeItem('signup');
  // }, []);

  return (
    <>
      <Toaster />
      <div className="h-[88vh] bg-gradient-to-r from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d] flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated Blobs */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          <div className="blob blob-1 animate-blob-1"></div>
          <div className="blob blob-2 animate-blob-2"></div>
          <div className="blob blob-3 animate-blob-3"></div>
          <div className="blob blob-4 animate-blob-4"></div>
          <div className="blob blob-5 animate-blob-5"></div>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white max-w-md backdrop-blur-xl rounded-lg shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl relative z-10">
          <span
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200 mb-6 cursor-pointer"
            onClick={handleRegister}
          >
            <ChevronLeftIcon className="mr-2" />
            Back
          </span>

          <p className="text-3xl font-bold text-gray-800 mb-8">Log In</p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
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
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={handleRegister}
                className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200"
              >
                Register
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
          top: 15%;
          left: 20%;
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
          animation: float 14s ease-in-out infinite, colorChange 16s infinite,
            morph 18s infinite;
        }
        .animate-blob-5 {
          animation: float 16s ease-in-out infinite, colorChange 18s infinite,
            morph 20s infinite;
        }
      `}</style>
    </>
  );
};

export default SignIn;
