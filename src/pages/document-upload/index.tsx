// React Imports
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// MUI Imports
import { Chip, MenuItem, Select, Typography } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  FolderOpen,
  Work,
} from "@mui/icons-material";
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
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DescriptionIcon from "@mui/icons-material/Description";

// Normal Imports
import { businessDocuments, videoImage } from "@/layout/user-data";
import APIs from "@/utils/api-handler";
import UserForm from "@/components/form";
import { InputAdornment, OutlinedInput } from "@material-ui/core";
import FeatureModal from "./FeatureModal";

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpeg":
    case "jpg":
    case "png":
    case "webp":
    case "jfif":
      return <ImageIcon />;
    case "pdf":
      return <PictureAsPdfIcon />;
    case "docx":
    case "txt":
    case "csv":
    case "xlsx":
    case "xls":
      return <DescriptionIcon />;
    default:
      return <InsertDriveFileIcon />;
  }
};

interface DocumentsCellProps {
  documents: string[];
}

interface Data {
  id: string;
  logoBanner: string;
  video: string;
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
let userRole;
if (typeof window !== "undefined") {
  userRole = localStorage.getItem("user");
  userRole = JSON.parse(userRole);
}
const headCells: readonly HeadCell[] = [
  // {
  //   id: '_id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Id',
  // },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Documents Title",
  },
  {
    id: "documents",
    numeric: false,
    disablePadding: false,
    label: "Documents",
  },
  {
    id: "pitchTitle",
    numeric: false,
    disablePadding: false,
    label: "Company",
  },
  {
    id: "companyOwner",
    numeric: false,
    disablePadding: false,
    label: "Owner Email",
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

const DocumentUpload = ({ searchingTxt = null }) => {
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
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const documentsInputRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  // Handle checkbox state change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Handle change for document title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle file selection for documents
  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    // Define allowed document types
    const allowedTypes = [
      "application/pdf", // PDF
      "application/msword", // DOC
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.ms-excel", // XLS
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "text/csv", // CSV
      "text/plain", // TXT
    ];

    // Define image types to block
    const imageTypes = [
      "image/jpeg", // JPEG
      "image/png", // PNG
      "image/gif", // GIF
      "image/webp", // WEBP
    ];

    // Check if any file is an image
    const isImageUploaded = files.some((file) =>
      imageTypes.includes(file.type)
    );

    if (isImageUploaded) {
      toast.error("Image files are not allowed. Please upload documents only.");
      e.target.value = ""; // Clear the input
      return;
    }

    // Check if any file is not in the allowed types
    const isInvalidFileUploaded = files.some(
      (file) => !allowedTypes.includes(file.type)
    );

    if (isInvalidFileUploaded) {
      toast.error("Invalid file type. Please upload supported document types.");
      e.target.value = ""; // Clear the input
      return;
    }

    // If all files are valid, set the documents state
    setDocuments(files);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || documents.length === 0) {
      return toast.error("Fields are required");
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const endPoint = `documents/create`;
    const method = "POST";
    const headers = { Authorization: `Bearer ${token}` };

    // Prepare FormData for the API request
    const formData = new FormData();
    formData.append("title", title);
    formData.append("companyId", companyId);

    // Append all selected documents
    documents.forEach((file) => formData.append("documents", file));

    const apiResponse = await APIs(
      endPoint,
      null,
      method,
      headers,
      formData,
      true
    );
    if (apiResponse?.status === 201) {
      toast.success(apiResponse?.data?.message);
      setTitle("");
      setDocuments([]);
      if (documentsInputRef.current) documentsInputRef.current.value = ""; // Reset input field
    }
  };
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
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
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
    localStorage.setItem("action", "document update");
    setIsModalOpen(true);
    const activeCompany = rows.filter((item) => item._id === id);
    setActiveCompany(activeCompany[0]);
  };

  const handleDelete = async () => {
    if (open) {
      const token = localStorage.getItem("token");
      const endPoint = `documents/remove`,
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
    const fetchDocuments = async () => {
      const token = localStorage.getItem("token");
      let getUser = localStorage.getItem("user");
      getUser = JSON.parse(getUser);
      // fetch documents based on USER-ROLE
      const endPoint =
          getUser?.role === "Admin"
            ? "documents/entrepreneur-documents"
            : `documents/entrepreneur-documents/${getUser?._id}`,
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
    fetchDocuments();
  }, [searchingTxt, refresh]);

  return (
    <div className="flex flex-col max-w-6xl mx-auto mb-20 px-4">
      <DialogBox />
      <Toaster />

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Document Management
        </h1>
        <p className="text-gray-600">
          Upload, manage and share your business documents securely
        </p>
      </div>

      {activeUser?.role !== "Admin" && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <CloudUploadIcon fontSize="large" className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold ml-3 text-gray-800">
              Upload Documents
            </h2>
          </div>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%", p: 3 }}
          >
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Grid container spacing={3}>
                {/* Document Title */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="document-title">
                      Document Title
                    </InputLabel>
                    <OutlinedInput
                      id="document-title"
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      label="Document Title"
                      startAdornment={
                        <InputAdornment position="start">
                          <DescriptionIcon className="text-gray-500" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                {/* Document Upload Field */}
                <Grid item xs={12}>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                    <div className="text-center">
                      <CloudUploadIcon className="text-gray-400 text-5xl mb-2" />
                      <Typography variant="h6" className="mb-2">
                        Drag and drop files here
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        Supported formats: .docx, .xlsx, .csv, .txt
                      </Typography>

                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<InsertDriveFileIcon />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Files
                        <input
                          id="upload-documents"
                          type="file"
                          hidden
                          accept=".docx, .pdf, .xlsx, .xls, .csv, .txt"
                          multiple
                          onChange={handleDocumentsChange}
                          ref={documentsInputRef}
                        />
                      </Button>
                    </div>

                    {/* File List */}
                    {documents.length > 0 && (
                      <div className="mt-4">
                        <Typography
                          variant="subtitle2"
                          className="font-medium mb-2"
                        >
                          Selected Files:
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {documents.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveFile(index)}
                              className="bg-gray-100"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>

                {/* Company Selection */}
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="company-select-label">
                      Select Company
                    </InputLabel>
                    <Select
                      labelId="company-select-label"
                      id="company-select"
                      value={companyId}
                      onChange={handleCompanyChange}
                      label="Select Company"
                      startAdornment={
                        <InputAdornment position="start">
                          <Work className="text-gray-500" />
                        </InputAdornment>
                      }
                    >
                      {companies.map((company) => (
                        <MenuItem key={company?._id} value={company?._id}>
                          {company?.pitchTitle}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Disclaimer Section */}
                <Grid item xs={12}>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M12 18a6 6 0 100-12 6 6 0 000 12z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold text-amber-600">
                        Disclaimer
                      </h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      By uploading documents, videos, images, or company
                      details, you confirm that you own the rights to the
                      content and that it does not infringe any third-party
                      copyrights or intellectual property. Pitch Connect is not
                      liable for verifying ownership, and you take full
                      responsibility for any claims. By proceeding, you agree to
                      these terms.
                    </p>
                    <div className="mt-4 flex items-center">
                      <Checkbox
                        id="agree"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        color="primary"
                        className="text-blue-600"
                      />
                      <label
                        htmlFor="agree"
                        className="ml-2 text-gray-800 cursor-pointer"
                      >
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!isChecked || !title || documents.length === 0}
                    className={`py-3 text-lg font-medium ${
                      isChecked && title && documents.length > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300"
                    }`}
                  >
                    Upload Documents
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </div>
      )}

      {/* Document Table Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Business Documents
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <Paper
          elevation={0}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows?.length}
              />
              <TableBody>
                {rows?.map((row, index) => {
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
                      className={isItemSelected ? "bg-blue-50" : ""}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {row.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {row?.documents?.map((doc, index) => {
                            const fileName = doc.split("/").pop();
                            return (
                              <Tooltip key={index} title={fileName} arrow>
                                <div className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors group">
                                  {getFileIcon(doc)}
                                  <span className="ml-2 max-w-[120px] truncate text-sm text-gray-700">
                                    {fileName}
                                  </span>
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_HOSTNAME}${doc}`}
                                    target="_blank"
                                    download
                                    className="ml-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <CloudDownloadIcon fontSize="small" />
                                  </a>
                                </div>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {row?.pitchTitle}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {row?.entrepreneurEmail}
                      </TableCell>
                      <TableCell>
                        <FeatureModal {...row} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <FolderOpen className="text-gray-400 text-5xl mb-2" />
                        <Typography variant="h6" className="text-gray-500">
                          No documents found
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                          Upload your first document to get started
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="border-t border-gray-200 bg-gray-50">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </Paper>
      </div>

      {isModalOpen && (
        <UserForm
          title={"Maintain Business Documents"}
          isOpen={isModalOpen}
          closeHandler={modalCloseHandler}
          activeUser={activeUser}
          fields={businessDocuments}
          data={activeCompany}
          updateId={id}
        />
      )}
    </div>
  );
};
export default DocumentUpload;
