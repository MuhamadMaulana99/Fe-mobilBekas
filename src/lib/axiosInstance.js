import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200' // Pastikan menambahkan dua titik setelah http
});

export default axiosInstance;
