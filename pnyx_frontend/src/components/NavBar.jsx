import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const pages = [
  { title: "Home", path: "/home" },
  { title: "Surveys", path: "/survey-list" },
  { title: "Profile", path: "/profile" },
];

const NavBar = () => {
  const navigate = useNavigate();

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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
