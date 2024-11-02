import { Button, IconButton, InputAdornment, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Apple } from '@mui/icons-material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { useRouter } from 'next/router';
import SignIn from '../sign-in';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import APIs from '../../../utils/api-handler';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import LandingPage from '@/pages/home/landing';

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

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    // const { fullName, email, password } = e.target.elements;

    // Constructing the data object
    const data = {
      fullName: fullName,
      email: email,
      password: password,
      role: role, // The role selected from the dropdown
    };
    const headers = {
      'Content-Type': 'Application/json'
    };

    // Call API
    const apiResponse = await APIs('user/create', null, 'POST', headers, data, false);
    console.log('res', apiResponse);
    if (apiResponse?.status === 201) {
      const getToken = apiResponse?.data?.data?.token;
      console.log('gettoken', getToken, apiResponse.data.token);
      // localStorage.setItem('token', getToken);
      toast.success(apiResponse?.data?.message);
      // setToken(getToken);
      setTimeout(() => {
        setRenderLoginPage(true);
      }, 2000);
      // router.push('/auth/login');
    }
    else {
      toast.error('Something went wrong ! Try Again.');
    }

    // Optionally, redirect after signup
    // router.push("/auth/login");
  };

  const handleBack = (e: any) => {
    e.preventDefault();
    setLandPage(true);
    router.push('/home');
  };

  const handleLogin = () => {
    setRenderLoginPage(true);
  };

  if (renderLoginPage) {
    return <SignIn />;
  }
  if (landPage) {
    return <LandingPage />
  }

  return (
    <>
      <Toaster />
      <div className="flex flex-wrap">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="w-[370px] mx-auto my-auto flex flex-col justify-center md:justify-start md:px-6 md:pt-0">
            <Link
              href={'/home'}
              className='flex mb-3 hover:cursor-pointer hover:text-[#4094F7]'
              onClick={handleBack}
            >
              <ChevronLeftIcon /> Back to home
            </Link>
            <p className="text-black text-[40px] font-bold tracking-[1px]">Sign Up</p>

            {/* Form */}
            <form className="flex flex-col" onSubmit={handleSignUp}>
              <div className="flex flex-col">
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="fullName"
                  autoFocus
                  type='text'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  sx={inputStyles}
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  type='email'
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputStyles}
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
                <FormControl variant="filled" fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)} // Handle the role selection
                    sx={inputStyles}
                  >
                    <MenuItem value="Investor">Investor</MenuItem>
                    <MenuItem value="Entrepreneur">Entrepreneur</MenuItem>
                  </Select>
                </FormControl>
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
                Sign Up
              </Button>
            </form>

            <div className="mt-[18px] flex flex-col justify-center items-center gap-[14px]">
              <div>
                <span className='text-lg'>
                  Register With?
                  <span onClick={handleLogin}>
                    <span className='text-lg text-[#4094F7] hover:cursor-pointer hover:text-[#3778c2]'> Login</span>
                  </span>
                </span>
              </div>

              {/* Third-parties buttons */}
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
    </>
  );
};

export default SignUp;
