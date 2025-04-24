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
import { entrepreneurSchema } from "@/layout/user-data";
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
  fullName: string;
  email: string;
  phoneNumber: number;
  profilePicture: string;
  location: string;
  industry: string;
  Bios: string;
  skills: string;
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
    id: "fullName",
    numeric: false,
    disablePadding: false,
    label: "Full Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phoneNumber",
    numeric: true,
    disablePadding: false,
    label: "Phone Number",
  },
  {
    id: "profilePicture",
    numeric: false,
    disablePadding: false,
    label: "Profile Picture",
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "industry",
    numeric: false,
    disablePadding: false,
    label: "Industry",
  },
  {
    id: "Bios",
    numeric: false,
    disablePadding: false,
    label: "Bios",
  },
  {
    id: "skills",
    numeric: false,
    disablePadding: false,
    label: "Skills",
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

const Entrepreneur = () => {
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
    console.log({ newSelected });
    setId(newSelected[0]);
    setSelected(newSelected);
    localStorage.setItem("actionId", id);
    const getCompany = rows.filter((item) => item._id === newSelected[0]);
    setActiveCompany(getCompany);
    console.log({ activeCompany });
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
    localStorage.setItem("action", "entrepreneur update");
    setIsModalOpen(true);
    const id = localStorage.getItem("actionId");
    const activeCompany = rows.filter((item) => item._id === id);
    setActiveCompany(activeCompany[0]);
  };

  const handleDelete = async () => {
    if (open) {
      const token = localStorage.getItem("token");
      const endPoint = `entrepreneur/remove`,
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
      console.log({ apiResponse });
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
      // setActiveCompany(activeCompany[0]);
    };
    getActiveUser();
  }, []);

  React.useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const token = localStorage.getItem("token");
      let getUser = localStorage.getItem("user");
      getUser = JSON.parse(getUser);

      const endPoint = "entrepreneur",
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

      if (apiResponse.status === 200) {
        let requireData = null;
        // show specific data for entrepreneur
        if (getUser?.role === "Admin") {
          requireData = apiResponse?.data?.data;
          setRows(requireData);
        } else {
        }
      } else {
        console.log("something went wrong during data fetching");
      }
    };
    fetchEntrepreneurs();
  }, [refresh]);

  return (
    <>
      <DialogBox />
      <Toaster />
      <Box sx={{ width: "80%" }} className="mx-auto py-12 px-10">
        <h2 className="text-2xl text-gray-600 text-center pb-4 underline">
          Entrepreneur Profile Data
        </h2>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              // size={dense ? "small" : "medium"}
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
                      <TableCell padding="checkbox">
                        {/* <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        /> */}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.fullName}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.email}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.phoneNumber}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_HOSTNAME}${row?.profilePicture[0]}`}
                          alt="Entrepreneur profile picture"
                          title={row.fullName}
                          style={{
                            width: "70px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.location}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.industry}
                      </TableCell>
                      <TableCell align="right" sx={{ textAlign: "start" }}>
                        {row.Bios}
                      </TableCell>
                      <TableCell align="right">{row.skills}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={
                      {
                        // height: (dense ? 33 : 53) * emptyRows,
                      }
                    }
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {/* <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        /> */}
      </Box>
      {isModalOpen && (
        <UserForm
          title={"Maintain Entrepreneur Profile"}
          isOpen={isModalOpen}
          closeHandler={modalCloseHandler}
          activeUser={activeUser}
          fields={entrepreneurSchema}
          data={activeCompany}
          updateId={id}
        />
      )}
    </>
  );
};
export default Entrepreneur;
