import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import OtpModal from './otp-modal';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '532px',
    height: "266px",
    bgcolor: 'background.paper',
    borderRadius: '24px',
    boxShadow: 24,
    p: 4,
};

export default function VerificationModal() {
    console.log('verifying')
    const [open, setOpen] = React.useState<boolean>(true); // Add type for useState
    const [openDigitModal, setOpenDigitModal] = React.useState<boolean>(false); // Add type for useState
    const handleOpenModal = () => setOpenDigitModal(true);
    const handleCloseModal = () => setOpenDigitModal(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFourDigitModal = () => {
        setOpenDigitModal(true);
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='flex justify-between items-center'>
                        <Typography id="modal-modal-title" variant="h6" component="h2" fontSize={'24px'} fontWeight={600}>
                            Send An Verification Code
                        </Typography>
                        <span onClick={handleClose} className='hover:cursor-pointer'>
                            <CloseIcon fontSize='medium' className='hover:cursor-pointer' />
                        </span>
                    </div>
                    <span className='text-[14px] text-[#252C32] font-normal'>
                        Email
                    </span>
                    <form noValidate autoComplete="off" className='mt-2'>
                        <input className="appearance-none block w-full h-[48px] *:text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white border-solid border-[1px]" id="grid-first-name" type="text" placeholder="Insert your email" />

                        <div className='flex justify-center mt-10' style={{ gap: "14px" }}>
                            <Button sx={{
                                backgroundColor: '#E5E5E5',
                                color: '#121212',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                                px: '20px',
                                py: '12px',
                                fontSize: '14px',
                            }} onClick={handleFourDigitModal}>
                                Send Code
                            </Button>
                            <Button sx={{
                                backgroundColor: '#0F5233',
                                color: '#fff',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                                px: '20px',
                                py: '12px',
                                fontSize: '14px',
                            }} onClick={handleFourDigitModal}>
                                Send Email
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            {openDigitModal && <OtpModal open={openDigitModal} handleClose={handleCloseModal} />}
        </div>
    );
}
