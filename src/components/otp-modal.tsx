import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useRouter } from 'next/router';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '408px',
    height: "374px",
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

const digitsStyles = { width: "88px", height: "80px", padding: "8px" };

// Update OtpModal to accept 'open' and 'handleClose' props
interface FourDigitModalProps {
    open: boolean;
    handleClose: () => void;
}

export default function OtpModal({ open, handleClose }: FourDigitModalProps) {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    interface OtpInterface {
        otp1: string;
        otp2: string;
        otp3: string;
        otp4: string;
    };
    const [otp, setOtp] = useState<OtpInterface>({ otp1: '', otp2: '', otp3: '', otp4: '' })

    const router = useRouter();

    const handleVerifying = () => {
        localStorage.setItem("login", "true");
        setIsVerified(true);
    }

    const handleOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOtp((prevOtp) => ({
            ...prevOtp, [name]: value
        }));
    }

    const handleFocusNext = (e: React.ChangeEvent<HTMLInputElement>, nextField: string) => {
        const { value } = e.target;
        if (value.length === 1) {
            const nextInput = document.querySelector(`input[name="${nextField}"]`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    // if (isVerified) {
    //     setTimeout(() => {
            
    //     }, 10000);
    //     return router.replace()
    // }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='flex flex-col justify-center gap-2 m-auto items-center'>
                    <span style={{ border: "11px solid #EEF3F1", backgroundColor: "#EEF3F1", borderRadius: '100px', marginTop: "-12px" }}>
                        <MailOutlineIcon fontSize='large' style={{ backgroundColor: "#EEF3F1", padding: "6px", borderRadius: "100px", color: '#0F5233' }} />
                    </span>
                    <div className='flex flex-col items-center gap-2 mb-2'>
                        <span className='text-[#101828] text-[18px] mt-2 font-medium'>
                            Please check your email
                        </span>
                        <span style={{ color: "#667085", fontSize: '14px' }}>
                            We've sent a code to <span className='font-semibold text-[#667085]'>olivia@untitledui.com</span>
                        </span>
                    </div>
                </div>
                <form onSubmit={handleVerifying}>
                    <div className='mt-1'>
                        <div className='flex flex-row relative left-[-17px]'>
                            <TextField
                                sx={digitsStyles}
                                name="otp1"
                                value={otp?.otp1}
                                onChange={(e) => {
                                    handleOtp(e as React.ChangeEvent<HTMLInputElement>);
                                    handleFocusNext(e as React.ChangeEvent<HTMLInputElement>, 'otp2');
                                }}
                                inputProps={{ maxLength: 1, pattern: "[0-9]*" }} // Restrict to 1 digit
                            />
                            <TextField
                                sx={digitsStyles}
                                name="otp2"
                                value={otp?.otp2}
                                onChange={(e) => {
                                    handleOtp(e as React.ChangeEvent<HTMLInputElement>);
                                    handleFocusNext(e as React.ChangeEvent<HTMLInputElement>, 'otp3');
                                }}
                                inputProps={{ maxLength: 1, pattern: "[0-9]*" }}
                            />
                            <TextField
                                sx={digitsStyles}
                                name="otp3"
                                value={otp?.otp3}
                                onChange={(e) => {
                                    handleOtp(e as React.ChangeEvent<HTMLInputElement>);
                                    handleFocusNext(e as React.ChangeEvent<HTMLInputElement>, 'otp4');
                                }}
                                inputProps={{ maxLength: 1, pattern: "[0-9]*" }}
                            />
                            <TextField
                                sx={digitsStyles}
                                name="otp4"
                                value={otp?.otp4}
                                onChange={(e) => {
                                    handleOtp(e as React.ChangeEvent<HTMLInputElement>);
                                }}
                                inputProps={{ maxLength: 1, pattern: "[0-9]*" }}
                            />
                        </div>

                        <span style={{ color: "#667085", fontSize: '14px' }} className='m-auto flex justify-center mt-4'>
                            Didn’t get a code? <span className='hover:cursor-pointer hover:font-semibold' style={{ color: "#0F5233", textDecoration: "underline", marginLeft: "4px" }}>Click to resend.</span>
                        </span>
                    </div>
                    <div className='flex justify-center' style={{ gap: "12px", marginTop: '28px' }}>
                        <Button sx={{
                            backgroundColor: '#E5E5E5',
                            color: '#344054',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            px: '20px',
                            fontSize: '16px',
                        }} style={{ width: "174px", height: "44px" }} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button sx={{
                            backgroundColor: '#0F5233',
                            color: 'white',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            px: '20px',
                            fontSize: '16px',
                        }} style={{ width: "174px", height: "44px" }} type='submit'>
                            Verify
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}
