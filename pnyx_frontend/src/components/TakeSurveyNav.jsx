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

<<<<<<< HEAD
export default TakeSurveyNav;
=======
export default TakeSurveyNav;
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
