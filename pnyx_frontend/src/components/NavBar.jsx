import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const pages = [
  { title: "Home", path: "/home" },
  { title: "Surveys", path: "/ownSurvey" },
];

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

  return (
    <AppBar sx={{ height: "10vh" }}>
      <Toolbar>
        <Box>
          <Typography>LOGO</Typography>
        </Box>
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
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            PROFILE
          </Button>
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
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
