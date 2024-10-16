import {
  Box,
  Typography,
  AppBar,
  Toolbar,

  IconButton,
  Divider,
  Container,
  Tooltip,

} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import Notification from "./Notification";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PollIcon from "@mui/icons-material/Poll";
import Badge from "@mui/material/Badge";
import logo from "../image/logo.jpg";
import axios from "axios";

import { useState } from "react";

const pages = [
  { title: "Home", path: "/home" },
  { title: "Surveys", path: "/survey-list" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [invisible, setInvisible] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);

  const open = Boolean(anchorEl);

  // const [notifications, setNotifications] = useState([
  //   "Notification 1",
  //   "Notification 2",
  //   "Notification 3",
  //   "Notification 4",
  //   "Notification 5",
  //   "Notification 6",
  // ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
    handleBadgeVisibility();
    setCount(count + 1);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleBadgeVisibility = () => {
    if (count > 0) {
      setInvisible(invisible);
    } else {
      setInvisible(!invisible);
    }
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Handle logout
  const handleLogout = () => {
    // Delete specific cookies
    deleteCookie('username');   
    deleteCookie('user_id');

    // Navigate to the login or signup page
    navigate("/"); // Change to your desired route
  };

  return (
    <AppBar sx={{ height: "10vh", position: "static" }}>
      <Toolbar>
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
            borderRadius: 50,
          }}
          alt="Logo"
          src={logo}
        />
        {/* <Box
          sx={{
            marginLeft: 6,
            width: 500,
          }}
        >
          <TextField

            fullWidth
            placeholder="search"
            id="search"
            
            sx={{
              "& fieldset": { border: 'none' },
              backgroundColor: "#F5F5F5",
              borderRadius: 50,

            }}
          />
        </Box> */}
        <Container
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "right",
            marginRight: -3,
          }}
        >
          {/* <Tooltip title="Notification" arrow>
            {" "}
            <IconButton
              aria-label="show notifications"
              color="inherit"
              onClick={handleClick1}
              sx={{ paddingRight: 3 }}
            >
              <Badge
                // badgeContent={notifications.length}
                color="error"
                invisible={invisible}
              >
                <NotificationsIcon sx={{ fontSize: "35px" }} />
              </Badge>
            </IconButton>
          </Tooltip> */}
{/* 
          <Menu
            anchorEl={anchorEl1}
            open={Boolean(anchorEl1)}
            onClose={handleClose1}
            sx={{ height: "70vh" }}
          >
            <Container sx={{ paddingTop: 2 }}>
              <Box sx={{ paddingBottom: 2 }}>
                <Typography variant="h5">Notifications</Typography>
              </Box>

              <Divider variant="fullWidth" color="#1976D2" />
              <Box sx={{ py: 3, overflowY: "auto" }}>
                {notifications.map((notification, index) => (
                  <MenuItem
                    key={index}
                    onClick={handleClose1}
                    sx={{ width: "20vw" }}
                  >
                    {notification}
                  </MenuItem>
                ))}
              </Box>
            </Container>
          </Menu> */}
          <Tooltip title="Home" arrow>
            <IconButton
              color="inherit"
              onClick={() => navigate("/home")}
              sx={{ paddingRight: 3 }}
            >
              <HomeIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Surveys" arrow>
            <IconButton
              color="inherit"
              onClick={() => navigate("/survey-list")}
              sx={{ paddingRight: 3 }}
            >
              <PollIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Account" arrow>
            <IconButton color="inherit" onClick={handleClick}>
              <AccountCircleIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{
              vertical: "top",
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={() => navigate("/redeem")}>Points</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;