import { Stack, Box } from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useNavigate } from "react-router-dom";


const PendingPage = () => {
  return (
    <Stack sx={{backgroundColor: "skyblue", height:"100vh"}}>
      <Box>
        <AdminMain />
      </Box>
    </Stack>
  );
};

export default PendingPage;