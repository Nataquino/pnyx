import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notification from "./Notification";
import Badge from "@mui/material/Badge";
import logo from "../images/logo.jpg";

import { useState } from "react";

const pages = [
  { title: "Home", path: "/home" },
  { title: "Surveys", path: "/ownSurvey" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [invisible, setInvisible] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);

  const open = Boolean(anchorEl);

  const [notifications, setNotifications] = useState([
    "Notification 1",
    "Notification 2",
    "Notification 3",
    "Notification 4",
    "Notification 5",
    "Notification 6",
  ]);

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

  return (
    <AppBar sx={{ height: "10vh" }}>
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
        <Box
          sx={{
            marginLeft: 6,
            width: 500,
          }}
        >
          {/* <TextField

            fullWidth
            placeholder="search"
            id="search"
            
            sx={{
              "& fieldset": { border: 'none' },
              backgroundColor: "#F5F5F5",
              borderRadius: 50,

            }}
          /> */}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "right",
          }}
        >
          <IconButton
            aria-label="show notifications"
            color="inherit"
            onClick={handleClick1}
          >
            <Badge
              badgeContent={notifications.length}
              color="error"
              invisible={invisible}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl1}
            open={Boolean(anchorEl1)}
            onClose={handleClose1}
            sx={{ height: "70vh"}}
          >
            <Container sx={{ paddingTop: 2 }}>
              <Box sx={{ paddingBottom: 2 }} >
                <Typography variant="h5" >
                  Notifications
                </Typography>
              </Box>

              <Divider variant="fullWidth" color="#1976D2" />
              <Box sx={{ py:3, overflowY:"auto" }}>
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
          </Menu>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => navigate(page.path)}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {page.title}
            </Button>
          ))}
          <Button
            aria-label="show notifications"
            color="inherit"
            onClick={handleClick}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            PROFILE
          </Button>
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
            <MenuItem onClick={() => navigate("/")}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
