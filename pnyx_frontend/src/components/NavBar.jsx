import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const pages = [
  { title: "Home", path: "/home" },
  { title: "Surveys", path: "/surveys" },
  { title: "Profile", path: "/profile" },
];

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar>
      <Toolbar>
        <Box>
          <Typography>LOGO</Typography>
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
