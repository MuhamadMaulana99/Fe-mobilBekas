import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import fetchRecommendations from "../../features/fetchRekomendations";

const columns = [
  { id: "no", label: "No", minWidth: 50 },
  { id: "nama", label: "Nama", minWidth: 100 },
  { id: "harga", label: "Harga (Rp)", minWidth: 100 },
  { id: "persentaseHarga", label: "Persentase Harga (%)", minWidth: 150 },
  { id: "tahun", label: "Tahun", minWidth: 100 },
  { id: "persentaseTahun", label: "Persentase Tahun (%)", minWidth: 150 },
  { id: "jarakTempuh", label: "Jarak Tempuh (km)", minWidth: 150 },
  {
    id: "persentaseJarakTempuh",
    label: "Persentase Jarak Tempuh (%)",
    minWidth: 200,
  },
];

export const Home = () => {
  const [filters, setFilters] = useState({
    minHarga: "",
    maxHarga: "",
    tahun: "",
    jarakTempuh: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isInvalid, setIsInvalid] = useState(false);
  // console.log(isInvalid, "isInvalid");

  const handleChange = (key, value) => {
    setFilters((prevFilters) => {
      setIsInvalid(
        parseInt(prevFilters.minHarga) >= parseInt(prevFilters.maxHarga)
      );
      return { ...prevFilters, [key]: value };
    });
  };

  const handleSearch = async () => {
    try {
      const formattedFilters = {
        minHarga: filters.minHarga ? parseFloat(filters.minHarga) : undefined,
        maxHarga: filters.maxHarga ? parseFloat(filters.maxHarga) : undefined,
        tahun: filters.tahun ? parseInt(filters.tahun, 10) : undefined,
        jarakTempuh: filters.jarakTempuh
          ? parseFloat(filters.jarakTempuh)
          : undefined,
      };

      const result = await fetchRecommendations(formattedFilters);

      if (result.success) {
        setRecommendations(result.data || []);
        toast.success("Rekomendasi berhasil diambil.");
      } else {
        setRecommendations([]);
        toast.error(result.message || "Gagal mengambil rekomendasi.");
      }
    } catch (error) {
      setRecommendations([]);
      toast.error("Gagal mengambil rekomendasi. Pastikan input sesuai.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  };

  const handleSearchData = () => {
    return recommendations.filter((row) => {
      const nameMatch = row.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const distanceMatch = row.persentaseJarakTempuh
        .toString()
        .includes(searchTerm);
      return nameMatch || distanceMatch;
    });
  };

  useEffect(() => {
    const minHarga = parseFloat(filters.minHarga);
    const maxHarga = parseFloat(filters.maxHarga);
    
    // Check validity: if minHarga is greater than maxHarga, set isValid to false
    if (minHarga > maxHarga) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [filters]);

  const isDisabled = !Object.values(filters).some((value) => value !== "");
  // console.log(isDisabled, 'isDisabled')

  return (
    <div>
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Filter Rekomendasi Mobil</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
          <TextField
            label="Harga Minimum"
            type="number"
            value={filters.minHarga}
            onChange={(e) => handleChange("minHarga", e.target.value)}
            error={parseInt(filters.minHarga) > parseInt(filters.maxHarga)} // Check if minHarga > maxHarga
            helperText={
              parseInt(filters.minHarga) > parseInt(filters.maxHarga)
                ? "Harga min tidak boleh lebih besar dari max"
                : ""
            }
            sx={{ width: 310 }}
          />
          <TextField
            label="Harga Maksimum"
            type="number"
            value={filters.maxHarga}
            onChange={(e) => handleChange("maxHarga", e.target.value)}
            error={parseInt(filters.minHarga) > parseInt(filters.maxHarga)} // Check if minHarga > maxHarga
            helperText={
              parseInt(filters.minHarga) > parseInt(filters.maxHarga)
                ? "Harga max tidak boleh lebih kecil dari min"
                : ""
            }
            sx={{ width: 310 }}
          />

          <TextField
            label="Tahun"
            type="number"
            value={filters.tahun}
            onChange={(e) => handleChange("tahun", e.target.value)}
          />
          <TextField
            label="Jarak Tempuh Maksimum"
            type="number"
            value={filters.jarakTempuh}
            onChange={(e) => handleChange("jarakTempuh", e.target.value)}
          />
          <Button
            variant="contained"
            disabled={isInvalid || isDisabled}
            endIcon={<SearchIcon />}
            onClick={handleSearch}
            onKeyPress={handleKeyPress}
          >
            Cari
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // fullWidth
          />
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {handleSearchData().length > 0 ? (
                handleSearchData()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.nama}</TableCell>
                      <TableCell>{row.harga.toLocaleString("id-ID")}</TableCell>
                      <TableCell>{row.persentaseHarga}%</TableCell>
                      <TableCell>{row.tahun}</TableCell>
                      <TableCell>{row.persentaseTahun}%</TableCell>
                      <TableCell>{row.jarakTempuh.toLocaleString("id-ID")}</TableCell>
                      <TableCell>{row.persentaseJarakTempuh}%</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">Mobil Kosong</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={recommendations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
