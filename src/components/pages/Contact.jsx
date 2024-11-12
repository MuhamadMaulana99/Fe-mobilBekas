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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  fetchItems,
  addItem,
  updateItem,
  deleteItem,
} from "../../features/carsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

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

const Contact = () => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state);
  console.log(cars?.items, "cars");
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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const body = {
    nama: formData?.nama,
    harga: formData?.harga,
    tahun: moment(formData?.tahun).year(),
    jarakTempuh: formData?.jarakTempuh,
    efisiensiBahanBakar: formData?.efisiensiBahanBakar,
  };

  const handleAddOpen = () => {
    setFormData({
      nama: "",
      harga: "",
      tahun: "",
      jarakTempuh: "",
      efisiensiBahanBakar: "",
    });
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };
  const handleAddSubmit = () => {
    dispatch(addItem(body)).then()
      .then(() => toast.success("Item added successfully"))
      .catch(() => toast.error("Failed to add item"));
    setData([...data, formData]);
    handleAddClose();
  };

  const handleEditOpen = (index) => {
    setSelectedIndex(index);
    setFormData(data[index]);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSubmit = () => {
    if (Object.values(formData).some((value) => value === "")) {
      alert("Please fill in all fields.");
      return;
    }
    const updatedData = [...data];
    updatedData[selectedIndex] = formData;
    setData(updatedData);
    handleEditClose();
  };

  const handleDeleteOpen = (index) => {
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    const newData = [...data];
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
    dispatch(fetchItems());
  }, []);

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
              <TableCell>Nama</TableCell>
              <TableCell align="right">Harga (IDR)</TableCell>
              <TableCell align="right">Tahun</TableCell>
              <TableCell align="right">Jarak Tempuh (KM)</TableCell>
              <TableCell align="right">
                Efisiensi Bahan Bakar (L/100KM)
              </TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars?.items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.nama}
                  </TableCell>
                  <TableCell align="right">
                    {row.harga.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">{row.tahun}</TableCell>
                  <TableCell align="right">
                    {row.jarakTempuh.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">{row.efisiensiBahanBakar}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditOpen(index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteOpen(page * rowsPerPage + index)
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
          count={cars?.items?.length}
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
            name="nama"
            label="Nama"
            type="text"
            fullWidth
            value={formData.nama}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="harga"
            label="Harga (IDR)"
            type="number"
            fullWidth
            value={formData.harga}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              // openTo="year"
              views={["year"]} // Restricts to year view
              value={formData.tahun}
              onChange={(newValue) =>
                setFormData({ ...formData, tahun: newValue })
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            name="jarakTempuh"
            label="Jarak Tempuh (KM)"
            type="number"
            fullWidth
            value={formData.jarakTempuh}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="efisiensiBahanBakar"
            label="Efisiensi Bahan Bakar (L/100KM)"
            type="number"
            fullWidth
            value={formData.efisiensiBahanBakar}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Batal</Button>
          <Button onClick={handleAddSubmit} color="primary">
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
            name="nama"
            label="Nama"
            type="text"
            fullWidth
            value={formData.nama}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="harga"
            label="Harga (IDR)"
            type="number"
            fullWidth
            value={formData.harga}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="tahun"
            label="Tahun"
            type="number"
            fullWidth
            value={formData.tahun}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="jarakTempuh"
            label="Jarak Tempuh (KM)"
            type="number"
            fullWidth
            value={formData.jarakTempuh}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="efisiensiBahanBakar"
            label="Efisiensi Bahan Bakar (L/100KM)"
            type="number"
            fullWidth
            value={formData.efisiensiBahanBakar}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Batal</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Simpan
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

export default Contact;
