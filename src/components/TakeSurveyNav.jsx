import { Box, AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const TakeSurveyNav = () => {
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
            justifyContent: "right",
          }}
        >
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TakeSurveyNav;
