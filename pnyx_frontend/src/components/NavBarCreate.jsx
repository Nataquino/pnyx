import { Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBarCreate = () => {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ height: "10vh" }}>
      <Toolbar>
        <Box>
          <Button variant="contain" onClick={() => navigate("/survey-list")}>
            BACK
          </Button>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <Typography sx={{fontSize: 25}}>CREATE A SURVEY</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarCreate;
