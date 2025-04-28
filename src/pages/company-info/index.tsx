"use client";

import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import EditIcon from "@mui/icons-material/Edit";
import UserForm from "@/components/form";
import { companyProfile } from "@/layout/user-data";
import { Button } from "@mui/material";
import APIs from "@/utils/api-handler";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast, { Toaster } from "react-hot-toast";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Data {
  id: string;
  pitchTitle: string;
  shortSummary: string;
  website: string;
  companyBased: string;
  industry: string;
  stage: string;
  ideaInvestorRole: string;
  investmentRange: string;
  previousRoundRaise: string;
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

const headCells: readonly HeadCell[] = [
  // {
  //   id: '_id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Id',
  // },
  {
    id: "pitchTitle",
    numeric: true,
    disablePadding: false,
    label: "Company",
  },
  {
    id: "entrepreneurName",
    numeric: false,
    disablePadding: false,
    label: "Owner Name",
  },
  {
    id: "entrepreneurEmail",
    numeric: false,
    disablePadding: false,
    label: "Owner Gmail",
  },
  {
    id: "shortSummary",
    numeric: false,
    disablePadding: false,
    label: "Short Summary",
  },
  {
    id: "website",
    numeric: false,
    disablePadding: false,
    label: "Website",
  },
  {
    id: "companyBased",
    numeric: false,
    disablePadding: false,
    label: "Company Based",
  },
  {
    id: "industry",
    numeric: false,
    disablePadding: false,
    label: "Industry",
  },
  {
    id: "stage",
    numeric: false,
    disablePadding: false,
    label: "Stage",
  },
  {
    id: "ideaInvestorRole",
    numeric: false,
    disablePadding: false,
    label: "Idea Investor Role",
  },
  {
    id: "investmentRange",
    numeric: true,
    disablePadding: false,
    label: "investment Range",
  },
  {
    id: "previousRoundRaise",
    numeric: true,
    disablePadding: false,
    label: "previous Round Raise",
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
            align={headCell.numeric ? "right" : "left"}
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

const CompanyInfo = ({ searchingTxt = null }) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("pitchTitle");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [activeUser, setActiveUser] = React.useState(false);
  const [activeCompany, setActiveCompany] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [rows2, setRows2] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

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
    setSelected(newSelected);
    localStorage.setItem("actionId", id);
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
        {activeUser?.role !== "Admin" && (
          <IconButton>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </IconButton>
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

  const handleRegister = async () => {
    localStorage.setItem("action", "company register");
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    localStorage.setItem("action", "company update");
    setIsModalOpen(true);
    const id = localStorage.getItem("actionId");
    const activeCompany = rows.filter((item) => item._id === id);
    setActiveCompany(activeCompany[0]);
    localStorage.setItem(
      "entrepreneurData",
      JSON.stringify(activeCompany[0]?.entrepreneurId)
    );
  };

  const handleDelete = async () => {
    if (open) {
      const token = localStorage.getItem("token");
      const endPoint = `company/remove`,
        method = "DELETE",
        headers = {
          Authorization: `Bearer ${token}`,
        },
        reqData = null;
      const actionId = localStorage.getItem("actionId");
      const apiResponse = await APIs(
        endPoint,
        actionId,
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

  React.useEffect(() => {
    const getActiveUser = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setActiveUser(user);
    };
    getActiveUser();
  }, []);

  // fetch companies funtion
  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");
    let userString = localStorage.getItem("user");

    // Check if user data exists in localStorage
    if (!userString) {
      console.warn("User data not found in localStorage");
      setRows([]);
      return;
    }

    // Parse user data safely
    let getUser;
    try {
      getUser = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setRows([]);
      return;
    }

    // Ensure getUser has expected structure
    if (!getUser || !getUser.role) {
      console.warn("Invalid user data structure");
      setRows([]);
      return;
    }

    const endPoint = "company",
      id = null,
      method = "GET",
      headers = {
        Authorization: `Bearer ${token}`,
      },
      reqData = null;

    try {
      const apiResponse = await APIs(
        endPoint,
        id,
        method,
        headers,
        reqData,
        false
      );

      if (apiResponse?.status === 200) {
        const allCompanies = apiResponse?.data?.data || [];
        let filteredCompanies = [];

        // Show specific data for entrepreneur
        if (getUser.role === "Entrepreneur") {
          filteredCompanies = allCompanies.filter(
            (company) => company?.entrepreneurId?._id === getUser._id
          );

          if (searchingTxt) {
            filteredCompanies = filteredCompanies.filter((company) =>
              (company?.pitchTitle?.toLowerCase() || "").startsWith(
                searchingTxt.toLowerCase()
              )
            );
          }
        } else if (getUser.role === "Admin") {
          filteredCompanies = allCompanies;

          if (searchingTxt) {
            filteredCompanies = filteredCompanies.filter(
              (company) =>
                company?.pitchTitle === searchingTxt ||
                company?.entrepreneurId?.email === searchingTxt
            );
          }
        }

        setRows(filteredCompanies);
      } else {
        console.warn("API response error:", apiResponse);
        // Keep existing data on error
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      // Keep existing data on error
    }
  };

  const fetchEntrepreneurs = async () => {
    const token = localStorage.getItem("token");
    let getUser = localStorage.getItem("user");
    getUser = JSON.parse(getUser);

    const endPoint = "entrepreneur/get-entrepreneur",
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
        requireData = apiResponse?.data?.data?.filter(
          (entrepreneur) => entrepreneur?.entrepreneurId?._id === getUser?._id
        );
        setRows2(requireData);
      } else if (getUser?.role === "Admin") {
        requireData = apiResponse?.data?.data;
        setRows2(requireData);
      }
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      await fetchCompanies();
      await fetchEntrepreneurs();
    };

    fetchData();
  }, [searchingTxt, refresh]);

  return (
    <>
      <DialogBox />
      <Toaster />
      {activeUser?.role !== "Admin" && (
        <>
          <div className="flex gap-5">
            <IconButton sx={{ marginLeft: "auto", display: "block" }}>
              <Button
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </IconButton>
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </div>
        </>
      )}
      <Box sx={{ width: "100%", p: 3 }}>
        <h2 className="border-b text-3xl text-center text-gray-700 font-semibold pb-6">
          Company Information
        </h2>
        <Paper
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < rows?.length
                      }
                      checked={
                        rows?.length > 0 && selected.length === rows?.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {[
                    "Company",
                    "Owner Name",
                    "Owner Email",
                    "Short Summary",
                    "Website",
                    "Company Based",
                    "Industry",
                    "Stage",
                    "Idea Investor Role",
                    "Investment Range",
                    "Previous Round Raise",
                  ].map((head, index) => (
                    <TableCell
                      key={index}
                      align="left"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows?.map((row, index) => {
                  const isItemSelected = selected.includes(row._id);
                  return (
                    <TableRow
                      key={row._id}
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      <TableCell align="left">{row.pitchTitle}</TableCell>
                      <TableCell align="left">
                        {row?.entrepreneurId?.fullName}
                      </TableCell>
                      <TableCell align="left">
                        {row?.entrepreneurId?.email}
                      </TableCell>
                      <TableCell align="left">{row.shortSummary}</TableCell>
                      <TableCell align="left">
                        <a
                          href={row.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {row.website}
                        </a>
                      </TableCell>
                      <TableCell align="left">{row.companyBased}</TableCell>
                      <TableCell align="left">{row.industry}</TableCell>
                      <TableCell align="left">{row.stage}</TableCell>
                      <TableCell align="left">{row.ideaInvestorRole}</TableCell>
                      <TableCell align="left">{row.investmentRange}</TableCell>
                      <TableCell align="left">
                        {row.previousRoundRaise}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      </Box>
      {isModalOpen && (
        <UserForm
          title={"Maintain Company Data"}
          isOpen={isModalOpen}
          closeHandler={modalCloseHandler}
          activeUser={activeUser}
          fields={companyProfile}
          data={activeCompany}
          updateId={id}
        />
      )}
    </>
  );
};
export default CompanyInfo;
