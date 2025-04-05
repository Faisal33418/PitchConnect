import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { BorderAllRounded, Margin } from '@mui/icons-material';

const style = {
  // position: 'absolute',  
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  width: 800,
  margin: 'auto',
  marginTop: 12,
  bgcolor: 'background.paper',
  boxShadow: 24,
  // p: 12,
};

export default function ProfileModal({ isOpen, closeHandler, title, renderingData }) {

  // console.log();
  const [open, setOpen] = React.useState(isOpen);
  const handleOpen = () => {
    isOpen();
  }
  const handleClose = () => {
    console.log('renering')
    closeHandler();
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        keepMounted
        open={isOpen}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CloseIcon className='relative -top-[18px] left-[786px] bg-[#1565C0] p-[5px] text-white hover:cursor-pointer hover:text-black' onClick={handleClose} />
          {/* <Typography id="keep-mounted-modal-title"
            variant="h5" component="h2">
            {title} Profile
          </Typography> */}
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {renderingData}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
