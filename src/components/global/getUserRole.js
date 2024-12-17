export const getUserRole = () => {
    const storedData = localStorage.getItem("userRole");
  
    // Cek apakah data ada dan valid
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Gagal mengurai data:", error);
        return null;
      }
    }
    return null;
  };