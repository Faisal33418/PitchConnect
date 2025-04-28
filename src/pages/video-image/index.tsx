// React Imports
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRecordWebcam } from "react-record-webcam";
import Image from "next/image";

// MUI Imports
import { MenuItem, Select, Typography } from "@mui/material";
import {
  Button,
  Grid,
  Box,
  Container,
  InputLabel,
  IconButton,
  Input,
  FormControl,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import MicOffIcon from "@mui/icons-material/MicOff";
import DownloadIcon from "@mui/icons-material/Download";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import EditIcon from "@mui/icons-material/Edit";
import { videoImage } from "@/layout/user-data";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

// Normal Imports
import UserForm from "@/components/form";
import APIs from "@/utils/api-handler";

interface Data {
  id: string;
  logoBanner: string;
  video: string;
  companyId: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  // id: keyof Data;
  label: string;
  numeric: boolean;
}
let userRole = null;
if (typeof window !== "undefined") {
  userRole = localStorage.getItem("user");
  userRole = userRole ? JSON.parse(userRole) : "Guest";
}
const headCells: readonly HeadCell[] = [
  // {
  //   id: '_id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Id',
  // },
  {
    id: "logoBanner",
    numeric: false,
    disablePadding: false,
    label: "Logo Banner Image",
  },
  {
    id: "company",
    numeric: false,
    disablePadding: false,
    label: "Company",
  },
  {
    id: "entrepreneurEmail",
    numeric: false,
    disablePadding: false,
    label: "Entrepreneur Email",
  },
  {
    id: "video",
    numeric: false,
    disablePadding: false,
    label: "Video",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
}

const VideoImage = ({ searchingTxt = null, videoFilled, setVideoFilled }) => {
  const [logo, setLogo] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("pitchTitle");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeUser, setActiveUser] = useState(false);
  const [activeCompany, setActiveCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  const logoInputRef = useRef();
  const videoInputRef = useRef();

  useEffect(() => {
    if (video) {
      setVideoFilled(true);
    } else {
      setVideoFilled(false);
    }
  }, [video]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLogo(event.target.files[0]);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideo(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!logo || !video) return toast.error("Both fields are require");

    const token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    const endPoint = `video-image/create`,
      id = null,
      method = "POST",
      headers = {
        Authorization: `Bearer ${token}`,
      },
      reqData = null;

    const formData = new FormData();
    formData.append("logoBanner", logo);
    formData.append("video", video);
    formData.append("companyId", companyId);

    const apiResponse = await APIs(
      endPoint,
      id,
      method,
      headers,
      formData,
      true
    );
    if (apiResponse?.status === 201) {
      toast.success(apiResponse?.data?.message);
      logoInputRef.current.value = "";
      videoInputRef.current.value = "";
    }
  };

  // video-recording compnents
  const VideoRecorder: React.FC = () => {
    const {
      createRecording,
      openCamera,
      closeCamera,
      startRecording,
      stopRecording,
      activeRecordings,
    } = useRecordWebcam();

    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    // Function to start recording
    const handleStartRecording = async (): Promise<void> => {
      try {
        const recording = await createRecording();
        if (recording && recording.id) {
          await openCamera(recording.id);
          await startRecording(recording.id);
        } else {
          throw new Error("Failed to create recording");
        }
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    };

    // Function to stop recording
    const handleStopRecording = async (): Promise<void> => {
      try {
        if (activeRecordings.length > 0) {
          const recordingId = activeRecordings[0].id;
          const stoppedRecording = await stopRecording(recordingId);
          await closeCamera(recordingId);

          if (stoppedRecording?.blob) {
            setRecordedBlob(stoppedRecording.blob); // Save the blob for download
          }
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    };

    // Function to download the recorded video
    const handleDownloadRecording = (): void => {
      if (recordedBlob) {
        const downloadUrl = URL.createObjectURL(recordedBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(downloadUrl); // Clean up the URL object
      } else {
        console.error("No recording available to download");
      }
    };

    return (
      <div>
        <div className="flex gap-2 mb-4">
          {/* Start Recording Button */}
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<SettingsVoiceIcon />}
            onClick={handleStartRecording}
            sx={{ textTransform: "capitalize", width: "150px", height: 40 }}
          >
            Start Record
          </Button>
          {/* Stop Recording Button */}
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<MicOffIcon />}
            onClick={handleStopRecording}
            sx={{ textTransform: "capitalize", width: "150px", height: 40 }}
          >
            Stop Record
          </Button>
          {/* Download Recording Button */}
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<DownloadIcon />}
            onClick={handleDownloadRecording}
            sx={{ textTransform: "capitalize", width: "250px", height: 40 }}
          >
            Download Recorded Video
          </Button>
        </div>
        {/* <button onClick={} disabled={!recordedBlob}>
                </button> */}
        {/* <br /import MicOffIcon from '@mui/icons-material/MicOff';> */}

        {/* Displaying Webcam */}
        {activeRecordings.map((recording) => (
          <div key={recording.id} className="flex justify-center">
            <video
              ref={recording.webcamRef}
              autoPlay
              width={600}
              height={600}
            />
          </div>
        ))}
      </div>
    );
  };

  // Modal Close Handler
  const modalCloseHandler = () => {
    setIsModalOpen(false);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setId(newSelected[0]);
    localStorage.setItem("actionId", id);
    setSelected(newSelected);
    const getCompany = rows.filter((item) => item._id === newSelected[0]);
    setActiveCompany(getCompany);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          ></Typography>
        )}
        {/* <Tooltip title="Register New Company"> */}

        {/* </Tooltip> */}
        {numSelected > 0 ? (
          <>
            {/* Active for only admin */}
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon onClick={handleOpen} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton>
                <EditIcon onClick={handleEdit} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            {/* <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}
          </>
        )}
        <Tooltip title="Filter list">
          <RefreshIcon
            sx={{ color: "gray", marginRight: "10px" }}
            className="hover:cursor-pointer"
            onClick={handleRefresh}
          />
        </Tooltip>
      </Toolbar>
    );
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // confimation box handler
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenVideo = () => {
    setVideoModal(true);
  };
  const handleCloseVideo = () => {
    setVideoModal(false);
  };

  // Dialog Box Handler
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
          <DeleteForeverIcon color="error" />
          <Typography variant="h6">Confirm Deletion</Typography>
        </DialogTitle>

        <DialogContent>
          <Typography id="delete-dialog-description" variant="body1">
            Are you sure you want to delete this item? This action is permanent
            and cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleEdit = () => {
    localStorage.setItem("action", "video-image update");
    setIsModalOpen(true);
    const activeCompany = rows.filter((item) => item._id === id);
    setActiveCompany(activeCompany[0]);
  };

  const handleDelete = async () => {
    if (open) {
      const token = localStorage.getItem("token");
      const endPoint = `video-image/remove`,
        method = "DELETE",
        headers = {
          Authorization: `Bearer ${token}`,
        },
        reqData = null;
      const id = localStorage.getItem("actionId");
      const apiResponse = await APIs(
        endPoint,
        id,
        method,
        headers,
        reqData,
        false
      );
      if (apiResponse?.status === 200) {
        toast.success(apiResponse?.data?.message);
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleCompanyChange = (event: SelectChangeEvent) => {
    setCompanyId(event.target.value as string);
  };

  React.useEffect(() => {
    let user = null;
    const getActiveUser = () => {
      user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);
    };
    getActiveUser();
    const getCompanies = async () => {
      try {
        const endPoint = `company/get-companies/${user?._id}`;
        const method = "GET";
        const apiResponse = await APIs(endPoint, null, method, {}, null, false);
        if (apiResponse.status === 200) {
          setCompanies(apiResponse?.data?.data);
        } else {
          console.error("Invalid response format:", apiResponse);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    getCompanies();
  }, []);

  React.useEffect(() => {
    const fetchVideoImages = async () => {
      const token = localStorage.getItem("token");
      let getUser = localStorage.getItem("user");
      getUser = JSON.parse(getUser);

      const endPoint =
          getUser?.role === "Admin"
            ? "video-image/entrepreneur-media"
            : `video-image/entrepreneur-media/${getUser?._id}`,
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
        if (getUser?.role === "Entrepreneur") {
          requireData = apiResponse?.data?.data;
          if (searchingTxt) {
            requireData = requireData.filter(
              (company) => company?.pitchTitle === searchingTxt
            );
          }
          setRows(requireData);
        } else if (getUser?.role === "Admin") {
          requireData = apiResponse?.data?.data;
          if (searchingTxt) {
            requireData = requireData.filter(
              (company) =>
                company?.pitchTitle === searchingTxt ||
                company?.entrepreneurEmail === searchingTxt
            );
          }
          setRows(requireData);
        }
      }
    };
    fetchVideoImages();
  }, [searchingTxt, refresh]);

  return (
    <div className="flex flex-col mx-auto mb-20">
      <DialogBox />
      <Toaster />
      <Typography variant="h4" className="pb-10"></Typography>
      {activeUser?.role !== "Admin" && (
        <Container maxWidth="sm">
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <VideoRecorder />
            {/* </span> */}
            <h3 className="text-2xl mt-6 text-gray-700">
              Upload Logo and Video
            </h3>

            {/* LOGO and VIDEO uploading */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                {/* Upload Logo */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <span>Upload Banner Image</span>
                    <Input
                      id="upload-logo"
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      onChange={handleLogoChange}
                      inputRef={logoInputRef}
                      endAdornment={
                        <IconButton color="primary" component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      }
                    />
                  </FormControl>
                  {logo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {logo.name}
                    </Typography>
                  )}
                </Grid>

                {/* Upload Video */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <span>Upload Video</span>
                    <Input
                      id="upload-video"
                      type="file"
                      inputProps={{ accept: "video/*" }}
                      onChange={handleVideoChange}
                      inputRef={videoInputRef}
                      endAdornment={
                        <IconButton color="primary" component="span">
                          <CloudUploadIcon />
                        </IconButton>
                      }
                    />
                  </FormControl>
                  {video && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {video.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="demo-simple-select-standard-label">
                      Select Company
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={companyId}
                      onChange={handleCompanyChange}
                      label="Select Company"
                    >
                      {companies.map((company) => {
                        return (
                          <MenuItem key={company?._id} value={company?._id}>
                            {company?.pitchTitle}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}

      {/* Rendering Video and Image Table */}
      <Box sx={{ width: "1000px", margin: "auto" }}>
        <h2 className="text-2xl text-gray-600 text-center pt-10 pb-6 underline">
          Video & Image Information
        </h2>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = selected.includes(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {/* <label
                            htmlFor={`upload-logo-${row._id}`}
                            className="cursor-pointer"
                          >
                            <CloudUploadIcon
                              fontSize="large"
                              className="text-blue-500"
                            />
                          </label>
                          <input
                            id={`upload-logo-${row._id}`}
                            type="file"
                            className="hidden"
                          /> */}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_HOSTNAME}${row.logoBanner}`}
                          alt="Business Banner Image"
                          style={{
                            width: "20%",
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row?.pitchTitle}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row?.entrepreneurEmail}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "center" }}>
                        <Box
                          sx={{ position: "relative", cursor: "pointer" }}
                          onClick={handleOpenVideo}
                        >
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              borderRadius: "50%",
                            }}
                          >
                            <PlayCircleOutlineIcon fontSize="large" />
                          </IconButton>
                        </Box>
                        <Dialog
                          open={videoModal}
                          onClose={handleCloseVideo}
                          maxWidth="md"
                          fullWidth
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              p: 1,
                            }}
                          >
                            <Typography variant="h6">Video Player</Typography>
                            <IconButton onClick={handleCloseVideo}>
                              <CloseIcon />
                            </IconButton>
                          </Box>
                          <DialogContent>
                            <video
                              src={`${process.env.NEXT_PUBLIC_HOSTNAME}${row.video}`}
                              controls
                              autoPlay
                              style={{ width: "100%", borderRadius: "8px" }}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {isModalOpen && (
        <UserForm
          title={"Maintain Banner & Video Data"}
          isOpen={isModalOpen}
          closeHandler={modalCloseHandler}
          activeUser={activeUser}
          fields={videoImage}
          data={activeCompany}
          updateId={id}
        />
      )}
    </div>
  );
};
export default VideoImage;
