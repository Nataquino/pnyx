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

export default SurveyNavBar;
