import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PollIcon from "@mui/icons-material/Poll";

const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
};

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
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
        <Box>
          <Typography sx={{ fontSize: "20px" }}> {getCookieValue("username")} </Typography>
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
