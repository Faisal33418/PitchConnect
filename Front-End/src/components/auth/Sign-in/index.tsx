import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Apple } from '@mui/icons-material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VerificationModal from '@/components/verification-modal';
import SignUp from '../sign-up';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DoctorVerificationModal from '@/components/doctor-verification-modal';
import toast, { Toaster } from 'react-hot-toast';
import APIs from '@/utils/api-handler';

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
    '& .MuiInputBase-root': {
      height: '50px',
      padding: '0 14px',
      borderRadius: '8px',
    },
    '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after': {
      display: 'none',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    }
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
    const getToken = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken}`
    };

    // Call API
    const apiResponse = await APIs('user/sign-in', null, 'POST', headers, data, false);
    console.log('login response', apiResponse);
    if (apiResponse?.status === 200) {
      const getToken = apiResponse?.data?.token;
      const profileExist = apiResponse?.data?.data?.profileExist;
      localStorage.setItem('token', getToken);
      localStorage.setItem('profileExist', profileExist);
      toast.success(apiResponse?.data?.message);
      // setToken(getToken);
      setTimeout(() => {
        // setRenderLoginPage(true);
        localStorage.setItem('user', JSON.stringify(apiResponse?.data?.data));
        // router.push('/dashboard');
        window.location.href = '/';
      }, 1000);
    }
    else {
      toast.error('Something went wrong ! Try Again.');
    }
  };

  const handleRegister = () => {
    // localStorage.setItem('token', 'true');
    setIsRegisterActive(true);
  }
  if (isRegisterActive) {
    return <SignUp />
  }

  // useEffect(() => {
  //   localStorage.removeItem('signup');
  // }, []);

  return (
    <div className="flex flex-wrap">
      <Toaster />
      <div className="flex w-full flex-col md:w-1/2">
        <div className="w-[370px] mx-auto my-auto flex flex-col justify-center md:justify-start md:px-6 md:pt-0">
          <span
            className='flex mb-5 hover:cursor-pointer hover:text-[#4094F7]'
            onClick={handleRegister}>
            <ChevronLeftIcon /> Back
          </span>
          <p className="text-black text-[40px] font-bold tracking-[1px]">Log In</p>

          {/* Form */}
          <form className="flex flex-col" onSubmit={handleLogin}>
            <div className="flex flex-col">

              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-mail"
                type='email'
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={inputStyles}
              />

              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Enter Password"
                name="password"
                type={pwdVisible ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={inputStyles}
                InputProps={{ // deprecated in v7
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
            </div>
            {/* <div className='flex justify-between items-center mt-1'>
              <span className='flex flex-row gap-2'>
                <input type='checkbox' color='primary' id='check' className='w-4 mb-[1px]' />
                <label className='text-sm hover:cursor-pointer' htmlFor="check"> Remember me</label>
              </span>
              <span className='text-sm hover:cursor-pointer hover:text-[#4094F7]'>
                Forgot Password?
              </span>
            </div> */}

            <Button variant="contained" size="small" sx={{ marginTop: "20px", fontSize: "20px", textTransform: "capitalize" }} type='submit'>
              Log In
            </Button>
          </form>

          {/* Normal Verification Modal */}
          {/* {openVerifyModal && <VerificationModal />} */}

          {/* Doction Verfication Modal */}
          {/* {openVerifyModal && <DoctorVerificationModal />} */}

          <div className="mt-[22px] flex flex-col justify-center items-center gap-[14px]">
            <div className='mt-2'>
              <span className='text-lg'>
                Don’t have an account?
                <span onClick={handleRegister}>
                  <span className='text-lg text-[#4094F7] hover:cursor-pointer hover:text-[#3778c2]'> Register</span>
                </span>
              </span>
            </div>

            {/* Third-parties button */}
            {/* <div className='mt-2 flex gap-[16px]'>
              <a href="https://www.facebook.com/" target='_blank'>
                <FacebookOutlinedIcon fontSize='large' sx={{ color: "#1976D2", borderRadius: '100px' }} />
              </a>
              <a href="https://www.google.com/" target='_blank'>
                <Image src="/GoogleIcon.svg" width={40} height={40} alt="google icon" />
              </a>
              <a href="https://www.apple.com/" target='_blank'>
                <Apple fontSize='large' />
              </a>
            </div> */}
          </div>

        </div>
      </div>

      <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
        <Image className="-z-1 absolute top-0 h-full w-full object-cover opacity-90" src={"/auth-image.svg"} alt="Background" width={720} height={900} />
      </div>
    </div>

  );
};

export default SignIn;