import { Stack, Box, Container } from "@mui/material";
import NavBar from "../components/NavBar";
import construction from "../images/construction.png";

const HomePage = () => {
  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Container sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Box
          component="img"
          sx={{
            height: 700,
            width: 900,
            display: "flex",
            justifyContent: "center",

          }}
          alt="construction"
          src={construction}
        />
      </Container>
    </Stack>
  );
};
export default HomePage;
