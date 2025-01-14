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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PollIcon from "@mui/icons-material/Poll";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Helper function to get cookie value
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuClose = () => {
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

  const handleNotifClick = (notif) => {
    setSelectedNotif(notif);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Fetch notifications when the component mounts
  useEffect(() => {
    const userId = getCookieValue("user_id");

    if (userId) {
      fetch(
        `http://localhost/survey-app/get-notifications.php?user_id=${userId}`,
        {
          credentials: "include", // Ensure cookies are sent
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            console.error(
              "Error fetching notifications:",
              data.error || "Invalid data format"
            );
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
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
            <IconButton color="inherit" onClick={handleNotifMenuClick}>
              <NotificationsIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchorEl}
            open={notifOpen}
            onClose={handleNotifMenuClose}
            transformOrigin={{
              vertical: "top",
            }}
            PaperProps={{
              style: {
                maxHeight: 300, // Limit height of the dropdown
                width: 350, // Adjust width for more space
                borderRadius: 8, // Rounded corners for the dropdown
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                backgroundColor: "#fff", // White background for the dropdown
                padding: "8px 0", // Add padding inside the dropdown
              },
            }}
          >
            <List>
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <React.Fragment key={notif.notif_id}>
                    <ListItem
                      button
                      onClick={() => handleNotifClick(notif)}
                      sx={{
                        padding: "12px 16px",
                        borderRadius: 4,
                        transition: "background-color 0.3s ease",

         
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack>
                            <Typography variant="body1" sx={{ color: "black", fontSize: "18px" }}>
                              Survey: {notif.survey_title}
                            </Typography>
                            <Box sx={{height: "3vh"}}></Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {notif.notif_message}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: "gray" }}>
                            Date: {notif.notif_date}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {/* Add a divider for separation */}
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        No notifications available
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Menu>

          <Tooltip title="Account" arrow>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <AccountCircleIcon sx={{ fontSize: "35px" }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
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

      {/* Notification Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          {selectedNotif ? (
            <>
              <Typography variant="h6">
                {selectedNotif.notif_message}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {selectedNotif.notif_date}
              </Typography>
            </>
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default NavBar;
