import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Autocomplete,
  Box,
  Slider,
  Grid,
  Button,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchMerk } from "../../features/merkSlice";
import {
  addItemWeight,
  fetchItemWeight,
  updateItemWeight,
} from "../../features/weightSlice";
import PercentIcon from "@mui/icons-material/Percent";
import SearchIcon from "@mui/icons-material/Search";
import { additemRecommendations } from "../../features/recommendationSlice";
const columns = [
  { id: "no", label: "No", minWidth: 170 },
  { id: "name", label: "Nama", minWidth: 170 },
  { id: "harga", label: "Harga", minWidth: 100 },
  {
    id: "jajarakTempuhra",
    label: "Jarak Tempuh",
    minWidth: 170,
    align: "right",
  },
  {
    id: "tahun",
    label: "Tahun",
    minWidth: 170,
    align: "right",
  },
  {
    id: "efisiensiBahanBakar",
    label: "Efisiensi Bahan Bakar",
    minWidth: 170,
    align: "right",
  },
];

function createData(id, nama, harga, jarakTempuh, tahun, efisiensiBahanBakar) {
  return { id, nama, harga, jarakTempuh, tahun, efisiensiBahanBakar };
}

export const Home = () => {
  const dispatch = useDispatch();
  const { weight, cars, merk, loading, error } = useSelector((state) => state);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [recomendation, setRecomendation] = useState([]);
  const [getIdWeight, setGetIdWeight] = useState(null);
  const [values, setValues] = useState({
    harga: 0,
    tahun: 0,
    jarak: 0,
    efisiensi: 0,
  });
  // console.log(dataNama, "dataNam");
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    tahun: null,
    jarakTempuh: "",
    efisiensiBahanBakar: "",
  });
  // console.log(formData, "formData");
  // const body = {
  //   nama: formData?.nama?.nama,
  //   harga: formData?.harga,
  //   tahun: moment(formData?.tahun).year(),
  //   jarakTempuh: formData?.jarakTempuh,
  //   efisiensiBahanBakar: formData?.efisiensiBahanBakar,
  // };

  const bodys = {
    harga: parseFloat((values?.harga * 1).toFixed(2)),
    tahun: parseFloat((values?.tahun * 1).toFixed(2)),
    jarakTempuh: parseFloat((values?.jarak * 1).toFixed(2)),
    efisiensiBahanBakar: parseFloat((values?.efisiensi * 1).toFixed(2)),
  };

  const datas = recomendation?.map((item, index) =>
    createData(
      item?.id,
      item?.nama,
      item?.harga,
      item?.jarakTempuh,
      item?.tahun,
      item?.jarakTempuh,
    )
  );
  console.log(datas, "datas");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddSubmit = () => {
    dispatch(addItemWeight(bodys))
      .then(() => {
        toast.success("Item added successfully");
        // setData([...data, formData]);
      })
      .catch(() => {
        toast.error("Failed to add item");
      });
  };

  const handleEditSubmit = () => {
    const payload = {
      id: getIdWeight,
      payload: bodys,
    };
    dispatch(updateItemWeight(payload))
      .then(() => {
        toast.success("Item Update successfully");
      })
      .catch(() => {
        toast.error("Failed to add item");
      });
  };
  // console.log(formData, "formData");

  const handleSearch = () => {
    const payload = {
      merkId: formData?.merk?.id,
    };
    dispatch(additemRecommendations(payload))
      .then((res) => {
        // console.log(res, "tesss");
        setRecomendation(res?.payload?.recommendations);
        toast.success("Item Update successfully");
      })
      .catch((err) => {
        console.log(err, "errr");
        toast.error("Failed to add item");
      });
  };

  const handleMerkChange = (event, value) => {
    setFormData({ ...formData, merk: value });
  };

  useEffect(() => {
    dispatch(fetchItemWeight());
    dispatch(fetchMerk());
  }, []);

  useEffect(() => {
    // console.log(weight?.items, " weight?.items");
    if (weight?.items?.length > 0) {
      weight?.items.map((item) => {
        setGetIdWeight(item?.id);
        setValues({
          harga: item?.harga,
          tahun: item?.tahun,
          jarak: item?.jarakTempuh,
          efisiensi: item?.efisiensiBahanBakar,
        });
      });
    } else {
      setValues({
        harga: 0.25,
        tahun: 0.25,
        jarak: 0.25,
        efisiensi: 0.25,
      });
    }
  }, [weight?.items]);

  const handleChanges = (key, newValue) => {
    const total = 1;
    let otherKeys = Object.keys(values).filter((k) => k !== key);
    let remainingTotal = total - newValue;
    let sumOtherValues = otherKeys.reduce((sum, k) => sum + values[k], 0);

    if (sumOtherValues === 0) {
      otherKeys.forEach((k) => {
        values[k] = remainingTotal / otherKeys.length;
      });
    } else {
      otherKeys.forEach((k) => {
        values[k] = (values[k] / sumOtherValues) * remainingTotal;
      });
    }

    setValues({
      ...values,
      [key]: newValue,
    });
  };

  return (
    <div className="w-full">
      <div>
        <Box className="p-6 space-y-4">
          <Typography variant="h6">Adjust Total (Total harus = 1)</Typography>

          {Object.keys(values).map((key) => (
            <Box key={key} className="flex items-center space-x-2">
              <Typography>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Typography>

              <Slider
                value={values[key]}
                onChange={(e, newValue) => handleChanges(key, newValue)}
                step={0.01}
                min={0}
                max={1}
                valueLabelDisplay="auto"
                sx={{ width: "200px" }}
              />

              <Typography>{(values[key] * 100).toFixed(2)}%</Typography>
            </Box>
          ))}
          {weight?.items?.length > 0 ? (
            <Button
              onClick={handleEditSubmit}
              variant="contained"
              endIcon={<PercentIcon />}
            >
              change Persentase
            </Button>
          ) : (
            <Button
              onClick={handleAddSubmit}
              variant="contained"
              endIcon={<PercentIcon />}
            >
              Add Persentase
            </Button>
          )}

          {/* <Typography variant="subtitle1">
            Total:{" "}
            {Object.values(values)
              .reduce((sum, v) => sum + v, 0)
              .toFixed(2)} 
          </Typography> */}
          <div className=" w-full flex gap-5 ">
            <Autocomplete
              options={merk?.items || []}
              getOptionLabel={(option) => option.merk || ""}
              value={formData.merk || null}
              onChange={handleMerkChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Merk"
                  style={{ width: "300px" }}
                />
              )}
            />
            <Button
              onClick={handleSearch}
              disabled={weight?.items?.length < 0}
              variant="contained"
              endIcon={<SearchIcon />}
            >
              Search
            </Button>
          </div>
        </Box>
      </div>
      <div class="w-full flex flex-wrap ">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datas
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row?.nama}</TableCell>
                        <TableCell>{row?.harga}</TableCell>
                        <TableCell>{row?.jarakTempuh}</TableCell>
                        <TableCell>{row?.tahun}</TableCell>
                        <TableCell>{row?.efisiensiBahanBakar}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 25, 100]}
            component="div"
            count={datas?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};
