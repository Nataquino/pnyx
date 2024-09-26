import { Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBarResult = () => {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ height: "10vh", position: "static" }}>
      <Toolbar>
        <Box>
          <Button variant="contain" onClick={() => navigate("/survey-list")}>
            BACK
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarResult;
