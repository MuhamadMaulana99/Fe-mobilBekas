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
import {
  fetchItems,
  addItem,
  updateItem,
  deleteItem,
} from "../../features/carsSlice";
import { format, parseISO } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchMerk } from "../../features/merkSlice";
import dayjs from "dayjs";

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

const Master = () => {
  const dispatch = useDispatch();
  const { cars, merk, loading, error } = useSelector((state) => state);
  // console.log(cars?.items, "cars");
  const [data, setData] = useState(initialData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    merk: null,
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
  // console.log(formData, "formData");

  const body = {
    nama: formData?.nama,
    merkId: formData?.merk?.id,
    harga: formData?.harga,
    tahun: moment(formData?.tahun).year(),
    jarakTempuh: formData?.jarakTempuh,
    // efisiensiBahanBakar: formData?.efisiensiBahanBakar,
  };

  const handleAddOpen = () => {
    setFormData({
      nama: "",
      merk: null,
      harga: "",
      tahun: null,
      jarakTempuh: "",
      efisiensiBahanBakar: "",
    });
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };
  const handleAddSubmit = () => {
    dispatch(addItem(body))
      .then(() => {
        dispatch(fetchItems());
        toast.success("Item Add successfully");
      })
      .catch(() => {
        toast.error("Failed to Add item");
      });
    setData([...data, formData]);
    handleAddClose();
  };

  const handleEditOpen = (row, index) => {
    const globalIndex = page * rowsPerPage + index;
    // console.log(globalIndex, "globalIndex");
    setgetData(row);
    setSelectedIndex(index);
    setFormData({
      id: cars?.items[globalIndex]?.id,
      nama: cars?.items[globalIndex]?.nama,
      merk: cars?.items[globalIndex]?.merk,
      harga: cars?.items[globalIndex]?.harga,
      tahun: parseISO(cars?.items[globalIndex]?.tahun),
      // tahun: moment(cars?.items[globalIndex]?.tahun).toDate().toString(),
      jarakTempuh: cars?.items[globalIndex]?.jarakTempuh,
      // efisiensiBahanBakar: cars?.items[index]?.efisiensiBahanBakar,
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSubmit = () => {
    dispatch(updateItem(formData))
      .then(() => {
        dispatch(fetchItems());
        toast.success("Item Edit successfully");
      })
      .catch(() => {
        toast.error("Failed to Edit item");
      });
    const updatedData = [...data];
    updatedData[selectedIndex] = formData;
    setData(updatedData);
    handleEditClose();
  };

  const handleDeleteOpen = (row, index) => {
    setgetData(row);
    // console.log(row, "rowww");
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    const newData = [...data];
    dispatch(deleteItem(getData?.id))
      .then(() => {
        dispatch(fetchItems());
        toast.success("Item deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete item");
      });
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
  const handleMerkChange = (event, value) => {
    setFormData({ ...formData, merk: value });
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
    dispatch(fetchMerk());
  }, []);

  const isFormValid =
    formData.nama && formData.harga && formData.tahun && formData.jarakTempuh;

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
        sx={{ mt: 4, maxHeight: 500, overflow: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell align="right">Harga (IDR)</TableCell>
              <TableCell align="right">Tahun</TableCell>
              <TableCell align="right">Jarak Tempuh (KM)</TableCell>
              {/* <TableCell align="right">
                Efisiensi Bahan Bakar (L/100KM)
              </TableCell> */}
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars?.items
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.nama}
                    {/* {console.log(row?.tahun, 'tahunn')} */}
                  </TableCell>
                  <TableCell align="right">
                    {row.harga.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">
                    {moment(row?.tahun).local().add(7, "hours").year()}
                  </TableCell>
                  <TableCell align="right">
                    {row.jarakTempuh.toLocaleString("id-ID")}
                  </TableCell>
                  {/* <TableCell align="right">{row.efisiensiBahanBakar}</TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditOpen(row, index)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteOpen(row, page * rowsPerPage + index)
                      }
                    >
                      <DeleteIcon color="error" />
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
          <div className="p-5">
            <Autocomplete
              options={merk?.items || []}
              getOptionLabel={(option) => option.merk || ""}
              value={formData.merk || null}
              onChange={handleMerkChange}
              renderInput={(params) => <TextField {...params} label="Merk" />}
            />
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
            <div className="my-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pilih Tahun"
                  // openTo="year"
                  views={["year"]} // Restricts to year view
                  value={formData.tahun}
                  onChange={(newValue) => {
                    setFormData({ ...formData, tahun: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <TextField
              margin="dense"
              name="jarakTempuh"
              label="Jarak Tempuh (KM)"
              type="number"
              fullWidth
              value={formData.jarakTempuh}
              onChange={handleChange}
            />
            {/* <TextField
            margin="dense"
            name="efisiensiBahanBakar"
            label="Efisiensi Bahan Bakar (L/100KM)"
            type="number"
            fullWidth
            value={formData.efisiensiBahanBakar}
            onChange={handleChange}
            /> */}
          </div>
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
          <div className="p-5">
            <Autocomplete
              options={merk?.items || []}
              getOptionLabel={(option) => option.merk || ""}
              value={formData.merk || null}
              onChange={handleMerkChange}
              renderInput={(params) => <TextField {...params} label="Merk" />}
            />
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
            <div className="my-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pilih Tahun"
                  // openTo="year"
                  views={["year"]} // Restricts to year view
                  // value={formData.tahun ? dayjs(formData.tahun, 'YYYY') : null}
                  value={formData.tahun}
                  onChange={(newValue) => {
                    const formattedYear = newValue
                      ? dayjs(newValue).format("YYYY")
                      : "";
                    // console.log(newValue, "neeww");
                    setFormData({ ...formData, tahun: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <TextField
              margin="dense"
              name="jarakTempuh"
              label="Jarak Tempuh (KM)"
              type="number"
              fullWidth
              value={formData.jarakTempuh}
              onChange={handleChange}
            />
            {/* <TextField
            margin="dense"
            name="efisiensiBahanBakar"
            label="Efisiensi Bahan Bakar (L/100KM)"
            type="number"
            fullWidth
            value={formData.efisiensiBahanBakar}
            onChange={handleChange}
            /> */}
          </div>
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

export default Master;
