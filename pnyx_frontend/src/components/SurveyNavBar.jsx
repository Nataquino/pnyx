import { Box, AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const SurveyNavBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ height: "10vh" }}>
      <Toolbar>
        <Box>
          <Button variant="contain" onClick={() => navigate("/home")}>
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
            <Button variant="contain" onClick={() => navigate("/create-survey")}>
                CREATE SURVEY
            </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

<<<<<<< HEAD
export default SurveyNavBar;
=======
export default SurveyNavBar;
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
