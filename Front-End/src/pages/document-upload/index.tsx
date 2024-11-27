// React Imports
import React, { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// MUI Imports
import { MenuItem, Select, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Button, Grid, Box, Container, InputLabel, IconButton, Input, FormControl } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DescriptionIcon from '@mui/icons-material/Description';

// Normal Imports
import { businessDocuments, videoImage } from '@/layout/user-data';
import APIs from '@/utils/api-handler';
import UserForm from "@/components/form";

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'webp':
        case 'jfif':
            return <ImageIcon />;
        case 'pdf':
            return <PictureAsPdfIcon />;
        case 'docx':
        case 'txt':
        case 'csv':
        case 'xlsx':
        case 'xls':
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

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
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
if (typeof window !== 'undefined') {
    userRole = localStorage.getItem('user');
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
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'Documents Title',
    },
    {
        id: 'documents',
        numeric: false,
        disablePadding: false,
        label: 'Documents',
    },
    {
        id: 'pitchTitle',
        numeric: false,
        disablePadding: false,
        label: 'Company',
    },
    {
        id: 'companyOwner',
        numeric: false,
        disablePadding: false,
        label: 'Owner Email',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
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
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('pitchTitle');
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
    const [title, setTitle] = useState('');
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
        setDocuments(files);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title || documents.length === 0) {
            return toast.error("Fields are required");
        }

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const endPoint = `documents/create`;
        const method = 'POST';
        const headers = { 'Authorization': `Bearer ${token}` };

        // Prepare FormData for the API request
        const formData = new FormData();
        formData.append('title', title);
        formData.append('companyId', companyId);

        // Append all selected documents
        documents.forEach((file) => formData.append('documents', file));

        const apiResponse = await APIs(endPoint, null, method, headers, formData, true);
        if (apiResponse?.status === 201) {
            toast.success(apiResponse?.data?.message);
            setTitle('');
            setDocuments([]);
            if (documentsInputRef.current) documentsInputRef.current.value = ''; // Reset input field
        }
    };
    const modalCloseHandler = () => {
        setIsModalOpen(false);
    }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
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
                selected.slice(selectedIndex + 1),
            );
        }
        setId(newSelected[0]);
        localStorage.setItem('actionId', id);
        setSelected(newSelected);
        const getCompany = rows.filter((item) => item._id === newSelected[0]);
        setActiveCompany(getCompany);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    },
                ]}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                    </Typography>
                )}
                {/* </Tooltip> */}
                {numSelected > 0 ? (
                    <>
                        {/* Active for only admin */}
                        <Tooltip title='Delete'>
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
                    <RefreshIcon sx={{ color: 'gray', marginRight: '10px' }} className='hover:cursor-pointer' onClick={handleRefresh} />
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
    }

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
                <DialogTitle id="logout-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteForeverIcon color="error" />
                    <Typography variant="h6">Confirm Deletion</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description" variant="body1">
                        Are you sure you want to delete this item? This action is permanent and cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                    <Button onClick={handleClose} variant="outlined" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const handleEdit = () => {
        localStorage.setItem('action', 'document update');
        setIsModalOpen(true);
        const activeCompany = rows.filter((item) => item._id === id);
        setActiveCompany(activeCompany[0]);
    }

    const handleDelete = async () => {
        if (open) {
            const token = localStorage.getItem('token');
            const endPoint = `documents/remove`, method = 'DELETE', headers = {
                'Authorization': `Bearer ${token}`
            }, reqData = null;
            const id = localStorage.getItem('actionId');
            const apiResponse = await APIs(endPoint, id, method, headers, reqData, false);
            if (apiResponse?.status === 200) {
                toast.success(apiResponse?.data?.message);
                setTimeout(() => {
                    setOpen(false);
                }, 1000);
            }
        }
    }

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const handleCompanyChange = (event: SelectChangeEvent) => {
        setCompanyId(event.target.value as string);
    };

    React.useEffect(() => {
        let user = null;
        const getActiveUser = () => {
            user = JSON.parse(localStorage.getItem('user') || '{}');
            setActiveUser(user);
        }
        getActiveUser();
        const getCompanies = async () => {
            try {
                const endPoint = `company/get-companies/${user?._id}`;
                const method = 'GET';
                const apiResponse = await APIs(endPoint, null, method, {}, null, false);
                if (apiResponse.status === 200) {
                    setCompanies(apiResponse?.data?.data);
                } else {
                    console.error('Invalid response format:', apiResponse);
                }
            } catch (error) {
                console.error('Failed to fetch industries:', error);
            }
        };
        getCompanies();
    }, []);

    React.useEffect(() => {
        const fetchDocuments = async () => {
            const token = localStorage.getItem('token');
            let getUser = localStorage.getItem('user');
            getUser = JSON.parse(getUser);
            // fetch documents based on USER-ROLE
            const endPoint = getUser?.role === 'Admin' ? 'documents/entrepreneur-documents' : `documents/entrepreneur-documents/${getUser?._id}`, id = null, method = 'GET', headers = {
                'Authorization': `Bearer ${token}`
            }, reqData = null;

            const apiResponse = await APIs(endPoint, id, method, headers, reqData, false);
            if (apiResponse?.status === 200) {
                let requireData = null;
                if (getUser?.role === 'Entrepreneur') {
                    requireData = apiResponse?.data?.data;
                    if (searchingTxt) {
                        requireData = requireData.filter(company => company?.pitchTitle === searchingTxt);
                    }
                    setRows(requireData);
                }
                else if (getUser?.role === 'Admin') {
                    requireData = apiResponse?.data?.data;
                    if (searchingTxt) {
                        requireData = requireData.filter(company => company?.pitchTitle === searchingTxt || company?.entrepreneurEmail === searchingTxt);
                      }
                    setRows(requireData);
                }
            }
        }
        fetchDocuments();
    }, [searchingTxt, refresh]);

    return (
        <div className="flex flex-col mx-auto mb-20">
            <DialogBox />
            <Toaster />
            <Typography variant='h4' className='pb-10'></Typography>
            {activeUser?.role !== 'Admin' && <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* </span> */}
                    <h3 className="text-2xl mt-6 text-gray-700">
                        Upload Documents
                    </h3>

                    {/* LOGO and VIDEO uploading */}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/* Upload Logo */}
                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <Input
                                        id="document-title"
                                        type="text"
                                        placeholder="Document Title"
                                        value={title}
                                        onChange={handleTitleChange}
                                    />
                                </FormControl>
                                {logo && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected file: {logo.name}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Upload Video */}
                            {/* Document Upload Field */}
                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <span>Upload Documents</span>
                                    <Input
                                        id="upload-documents"
                                        type="file"
                                        inputProps={{
                                            accept: '.jpeg, .jfif, .png, .webp, .docx, .pdf, .xlsx, .xls, .csv, .txt',
                                            multiple: true,
                                        }}
                                        onChange={handleDocumentsChange}
                                        inputRef={documentsInputRef}
                                        endAdornment={
                                            <IconButton color="primary" component="span">
                                                <CloudUploadIcon />
                                            </IconButton>
                                        }
                                    />
                                </FormControl>
                                {documents.length > 0 && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected Files: {documents.map((file) => file.name).join(', ')}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={10}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="demo-simple-select-standard-label">Select Company</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={companyId}
                                        onChange={handleCompanyChange}
                                        label="Select Company"
                                    >
                                        {companies.map((company) => {
                                            return <MenuItem key={company?._id} value={company?._id}>{company?.pitchTitle}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <div className="flex justify-center items-center ml-5 mt-6">
                                <div className="bg-gray-100 p-6 rounded-md shadow-md max-w-md">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-600"
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
                                        <h1 className="text-xl font-bold text-red-600">Disclaimer</h1>
                                    </div>
                                    <p className="mt-4 text-gray-700">
                                        By uploading documents, videos, images, or company details, you
                                        confirm that you own the rights to the content and that it does not
                                        infringe any third-party copyrights or intellectual property. Pitch
                                        Connect is not liable for verifying ownership, and you take full
                                        responsibility for any claims. By proceeding, you agree to these
                                        terms.
                                    </p>
                                    <div className="mt-6 flex items-center">
                                        <input
                                            id="agree"
                                            type="checkbox"
                                            className="w-6 h-6 border-gray-300 rounded-md text-blue-600 focus:ring-blue-500 focus:ring-2"
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label
                                            htmlFor="agree"
                                            className="ml-2 text-gray-900 text-lg cursor-pointer"
                                        >
                                            I Agree
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Grid item xs={10} className="mt-4">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={!isChecked} // Button enabled/disabled based on checkbox state
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>}
            {/* Rendering Video and Image Table */}
            <Box sx={{ width: '1000px' }}>
                <h2 className='text-2xl text-gray-600 text-center pt-10 pb-6 underline'>Business Documents Details</h2>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
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
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ textAlign: 'start' }}>{row.title}</TableCell>
                                            <TableCell align="left">
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                    {row?.documents?.map((doc, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                position: 'relative',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                padding: 1,
                                                                border: '1px solid #ddd',
                                                                borderRadius: 2,
                                                                '&:hover .download-btn': { opacity: 6 },
                                                            }}
                                                        >
                                                            <Tooltip title={doc.split('/').pop()} arrow>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    {getFileIcon(doc)}
                                                                    <Typography variant="body2" noWrap sx={{ ml: 1, maxWidth: 150 }}>
                                                                        {doc.split('/').pop()}
                                                                    </Typography>
                                                                </Box>
                                                            </Tooltip>
                                                            <IconButton
                                                                component="a"
                                                                href={`${doc}`}
                                                                // download
                                                                className="download-btn"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    right: 4,
                                                                    opacity: 0,
                                                                    transition: 'opacity 0.3s',
                                                                }}
                                                            >
                                                                <a href={`${process.env.NEXT_PUBLIC_HOSTNAME}${doc}`} target="_blank" download>
                                                                    <CloudDownloadIcon />
                                                                </a>
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right" sx={{ textAlign: 'start' }}>{row?.pitchTitle}</TableCell>
                                            {/* <TableCell align="right" sx={{ textAlign: 'start' }}>{row?.entrepreneurEmail}</TableCell> */}
                                            <TableCell align="right" sx={{ textAlign: 'start' }}>{row?.entrepreneurEmail}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Box>
            {isModalOpen && <UserForm title={"Maintain Business Documents"} isOpen={isModalOpen} closeHandler={modalCloseHandler} activeUser={activeUser} fields={businessDocuments} data={activeCompany} updateId={id} />}
        </div>
    )
};
export default DocumentUpload
