import { styled, alpha } from "@mui/material/styles";
import { Stack, Box, Typography, Container } from "@mui/material";
import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
    </Stack>
  );
};
export default HomePage;
