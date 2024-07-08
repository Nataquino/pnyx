import { Stack, Box } from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useNavigate } from "react-router-dom";

const ApprovePage = () => {
  return (
    <Stack sx={{backgroundColor: "green", height:"100vh"}}>
      <Box>
        <AdminMain />
      </Box>
    </Stack>
  );
};

export default ApprovePage;