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

<<<<<<< HEAD
export default NavBarCreate;
=======
export default NavBarCreate;
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
