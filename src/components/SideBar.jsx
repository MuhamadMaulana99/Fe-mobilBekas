import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Home } from "./pages/Home";
import { Divider, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";
import Master from "./pages/Master";
import Merek from "./pages/Merek";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { getUserRole } from "./global/getUserRole";

export const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotFound = location.pathname === "/404";
  const userRole = getUserRole();
  // console.log(location.pathname, "location.pathname");
  // console.log(userRole, 'userRole')

  // Access the current path
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [location, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("userToken"); // Hapus token saat logout
    navigate("/login");
    console.log("Logging out...");
    handleClose();
  };
  // useEffect(() => {
  //     // Close sidebar when route changes
  //     setIsSidebarOpen(false);
  // }, [location]);

  return (
    <div>
      {location.pathname !== "/login" ? (
        <Box sx={{ display: "flex" }}>
          <AppBar position="fixed">
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant=""
                color="inherit"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Aplikasi Mobil Bekas
              </Typography>
              <IconButton color="inherit" onClick={handleClick}>
                <Avatar sx={{ width: 40, height: 40 }}>{userRole?.name?.split(" ").map(word => word.charAt(0)).join("").toUpperCase()}</Avatar>
              </IconButton>
              <Menu
                component={Link}
                to="/login"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    width: 150,
                    "& .MuiMenuItem-root": {
                      typography: "body2",
                      py: 1,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Drawer
            anchor="left"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            variant="persistent"
            sx={{
              width: 10,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
              },
            }}
          >
            <div className="w-full flex justify-end mt-2">
              <IconButton
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>
            </div>

            <Box
              sx={{
                padding: 2,
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100px", // Adjust height as needed
              }}
            >
              <Avatar sx={{ width: 56, height: 56, marginBottom: 1 }}>{userRole?.name?.split(" ").map(word => word.charAt(0)).join("").toUpperCase()}</Avatar>
              <Typography variant="h6">{userRole?.name?.toUpperCase()}</Typography>
            </Box>
            <List>
              <ListItem button component={Link} to="/home" onClick={toggleSidebar}>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem
                button
                component={Link}
                to="/merek"
                onClick={toggleSidebar}
              >
                <ListItemText primary="Merk" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem
                button
                component={Link}
                to="/master"
                onClick={toggleSidebar}
              >
                <ListItemText primary="Master" />
              </ListItem>
              <Divider variant="middle" />
            </List>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 1,
              marginLeft: isSidebarOpen ? 30 : 0,
              transition: "margin-left 0.3s",
              pt: 8,
            }}
          >
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/merek" element={<Merek />} />
              <Route path="/master" element={<Master />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <Login />
      )}
    </div>
  );
};
