import { Stack, Box, Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import construction from "../images/construction.png";


const HomePage = () => {
  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          marginTop: "50px",
          marginLeft: "-60px",
        }}
      >
        <Box
          component="img"
          sx={{
            height: 600,
            width: 800,
            display: "flex",
            justifyContent: "center",
          }}
          alt="construction"
          src={construction}
        />
        <Box
          sx={{
            height: "12px",
            marginTop: "170px",
            marginLeft: "-40px",
          }}
        >
          <Typography
            sx={{ color: "white", fontSize: "70px", fontFamily: "serif" }}
          >
            PAGE IS UNDER{" "}
            <Typography
              variant="h1"
              sx={{ color: "black", fontFamily: "fantasy" }}
            >
              CONSTRUCTION
            </Typography>
            <Typography variant="h2" sx={{ color: "grey" }}>
              COMING SOON
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Stack>
  );
};
export default HomePage;
