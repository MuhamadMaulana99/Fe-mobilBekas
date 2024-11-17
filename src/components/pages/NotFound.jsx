import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        flexDirection: "column",
        textAlign: "center",
        animation: "fadeIn 1s ease-in-out",
      }}
      className="relative"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-30 animate-pulse"></div>
      
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "white",
          animation: "fadeIn 2s ease-in-out",
        }}
        className="animate__animated animate__fadeIn animate__delay-1s"
      >
        Oops! Page Not Found
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "white",
          marginTop: 2,
          fontSize: "1.25rem",
          animation: "fadeIn 2s ease-in-out",
        }}
        className="animate__animated animate__fadeIn animate__delay-2s"
      >
        We can't seem to find the page you're looking for.
      </Typography>

      <Link to="/">
        <Button
          variant="contained"
          sx={{
            marginTop: 3,
            padding: "12px 24px",
            backgroundColor: "#6200ea",
            "&:hover": {
              backgroundColor: "#3700b3",
            },
          }}
          className="animate__animated animate__fadeIn animate__delay-3s"
        >
          Go Home
        </Button>
      </Link>

      {/* Error Icon */}
      <Box
        sx={{
          marginTop: 4,
          fontSize: 100,
          color: "white",
          animation: "bounceIn 1s ease-in-out",
        }}
        className="animate__animated animate__bounceIn animate__delay-1s"
      >
        <i className="fas fa-exclamation-triangle"></i>
      </Box>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
};

export default NotFound;
