import { Stack, Box } from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useNavigate } from "react-router-dom";

const DeclinePage = () => {
  return (
    <Stack sx={{backgroundColor: "red", height:"100vh"}}>
      <Box>
        <AdminMain />
      </Box>
    </Stack>
  );
};

export default DeclinePage;