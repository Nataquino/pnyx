import { Stack, Box } from "@mui/material";
import AdminMain from "../components/AdminMain";

const Admin = () => {
  return (
    <Stack sx={{backgroundColor: "skyblue", height:"100vh"}}>
      <Box>
        <AdminMain />
      </Box>
    </Stack>
  );
};

export default Admin;