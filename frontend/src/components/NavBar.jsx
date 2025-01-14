import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PollIcon from "@mui/icons-material/Poll";
import NotificationsIcon from "@mui/icons-material/Notifications";

const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
};

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    deleteCookie("username");
    deleteCookie("user_id");
    navigate("/");
  };

  useEffect(() => {
    // Fetch notifications from backend
    fetch("http://localhost/get-notifications.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setNotifications(data.data);
        } else {
          console.error("Error fetching notifications:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <AppBar sx={{ height: "10vh", position: "static" }}>
      <Toolbar>
        <Box>
          <Typography sx={{ fontSize: "20px" }}>
            {getCookieValue("username")}
          </Typography>
        </Box>
        <Container
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "right",
            marginRight: -3,
          }}
        >
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

          <Tooltip title="Notifications" arrow>
            <IconButton color="inherit" onClick={handleNotifClick}>
              <NotificationsIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchorEl}
            open={notifOpen}
            onClose={handleNotifClose}
            transformOrigin={{
              vertical: "top",
            }}
          >
            <List>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <ListItem key={notif.notif_id}>
                    <ListItemText
                      primary={notif.notif_description}
                      secondary={`Date: ${notif.notif_date} | Status: ${notif.notif_status}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No notifications available" />
                </ListItem>
              )}
            </List>
          </Menu>

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
            <MenuItem onClick={() => navigate("/account")}>Profile</MenuItem>
            <MenuItem onClick={() => navigate("/redeem")}>Points</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;