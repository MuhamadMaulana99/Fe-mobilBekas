import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TablePagination,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  addMerk,
  deleteMerk,
  fetchMerk,
  updateMerk,
} from "../../features/merkSlice";

const initialData = [
  {
    nama: "Mobil A",
    harga: 50000000,
    tahun: 2020,
    jarakTempuh: 10000,
    efisiensiBahanBakar: 15.5,
  },
  {
    nama: "Mobil B",
    harga: 60000000,
    tahun: 2021,
    jarakTempuh: 8000,
    efisiensiBahanBakar: 16.0,
  },
  {
    nama: "Mobil C",
    harga: 45000000,
    tahun: 2019,
    jarakTempuh: 12000,
    efisiensiBahanBakar: 14.8,
  },
  {
    nama: "Mobil D",
    harga: 70000000,
    tahun: 2022,
    jarakTempuh: 5000,
    efisiensiBahanBakar: 17.2,
  },
  {
    nama: "Mobil E",
    harga: 55000000,
    tahun: 2021,
    jarakTempuh: 9500,
    efisiensiBahanBakar: 15.8,
  },
  {
    nama: "Mobil F",
    harga: 62000000,
    tahun: 2020,
    jarakTempuh: 11000,
    efisiensiBahanBakar: 16.5,
  },
  {
    nama: "Mobil G",
    harga: 48000000,
    tahun: 2018,
    jarakTempuh: 13000,
    efisiensiBahanBakar: 14.2,
  },
];

const Merek = () => {
  const dispatch = useDispatch();
  const { merk, loading, error } = useSelector((state) => state);
  // console.log(merk, "merk");
  const [data, setData] = useState(initialData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    tahun: null,
    jarakTempuh: "",
    efisiensiBahanBakar: "",
  });
  const [getData, setgetData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log(formData, "formData");

  const body = {
    merk: formData?.merk,
  };

  const handleAddOpen = () => {
    setFormData({
      merk: "",
    });
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };
  const handleAddSubmit = () => {
    dispatch(addMerk(body))
      .then()
      .then(() => toast.success("Item added successfully"))
      .catch(() => toast.error("Failed to add item"));
    setData([...data, formData]);
    handleAddClose();
  };

  const handleEditOpen = (row, index) => {
    // console.log(row, "row");
    setgetData(row);
    setSelectedIndex(index);
    setFormData({
      id: merk?.items[index]?.id,
      merk: merk?.items[index]?.merk,
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSubmit = () => {
    dispatch(updateMerk(formData))
      .then()
      .then(() => toast.success("Item delete successfully"))
      .catch(() => toast.error("Failed to add item"));
    const updatedData = [...data];
    updatedData[selectedIndex] = formData;
    setData(updatedData);
    handleEditClose();
  };

  const handleDeleteOpen = (row, index) => {
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    const newData = [...data];
    dispatch(deleteMerk(getData?.id))
      .then()
      .then(() => toast.success("Item delete successfully"))
      .catch(() => toast.error("Failed to add item"));
    newData.splice(deleteIndex, 1);
    setData(newData);
    handleDeleteClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    dispatch(fetchMerk());
  }, []);

  const isFormValid = formData.merk !== '';

  return (
    <div>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        Data Mobil
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddOpen}
        sx={{ mb: 2 }}
      >
        Tambah Data
      </Button>
      <TableContainer
        component={Paper}
        sx={{ mt: 4, maxHeight: 400, overflow: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Merk</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merk?.items
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row?.merk}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditOpen(row, index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteOpen(row, page * rowsPerPage + index)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={merk?.items?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Data Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddClose}
        aria-labelledby="add-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="add-dialog-title">Tambah Data Mobil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="merk"
            label="Nama"
            type="text"
            fullWidth
            value={formData.merk}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddClose}>
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            color="primary"
            disabled={!isFormValid}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Data Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        aria-labelledby="edit-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Edit Data Mobil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="merk"
            label="Nama"
            type="text"
            fullWidth
            value={formData.merk}
            onChange={handleChange}
          />
          {/* <Autocomplete
            options={merk?.items || []}
            getOptionLabel={(option) => option.merk || ""}
            value={formData.merk || null}
            onChange={handleMerkChange}
            renderInput={(params) => <TextField {...params} label="Merk" />}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleEditClose}>
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            color="primary"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Apakah Anda yakin ingin menghapus data ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Tidak</Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Ya
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Merek;
