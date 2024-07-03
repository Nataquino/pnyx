import {
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Card,
} from "@mui/material";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import logo from "../images/logo.jpg";
import loginphoto from "../images/loginphoto.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Paper
      sx={{
        backgroundColor: "skyblue",
        height: "100vh",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "80vw",
          display: "flex",
          justifyContent: "center",
          marginLeft: 19,
        }}
      >
        <Card
          sx={{
            width: "80vw",
            display: "flex",
            justifyContent: "center",
            borderRadius: 15,
            backgroundColor: "black",
          }}
        >
          <Box
            fullWidth
            sx={{
              backgroundColor: "white",
              padding: "20px",
              width: "30vw",
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                height: 150,
                width: 150,
                borderRadius: 50,
                margin: 1,
              }}
              alt="Logo"
              src={logo}
            />
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Align items to the left
                width: "80%", // Take the full width of the parent container
                maxWidth: 500, // Set a maximum width for the container
                padding: 3, // Add padding to the container
              }}
            >
              <Typography>Username</Typography>
              <TextField
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                sx={{ width: "100%" }} // Make the TextField take the full width of the container
              />
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Align items to the left
                width: "80%", // Take the full width of the parent container
                maxWidth: 500, // Set a maximum width for the container
              }}
            >
              <Typography>Password</Typography>
              <TextField
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                sx={{ width: "100%" }} // Make the TextField take the full width of the container
              />
            </Container>
            <Button
              variant="contained"
              onClick={() => {
                console.log(`username: ${username} password: ${password}`);
              }}
              sx={{
                marginTop: 2,
                backgroundColor: "#05B1BF",
                width: 150,
                marginBottom: 7,
              }}
            >
              LOGIN
            </Button>
            <Typography>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signUp")}
                style={{ color: "#05B1BF" }}
              >
                Click here
              </span>
            </Typography>
          </Box>

          <Box
            sx={{
              width: "50vw",
              height: "85.35vh",
              backgroundColor: "#12A1E6",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                marginTop: 9,
                height: 300,
                width: 800,
              }}
              alt="loginphoto"
              src={loginphoto}
            />
            <Box sx={{display:"flex", justifyContent: "center", marginTop: 2 }}>
              <Typography sx={{fontFamily: "fantasy", fontSize: 70}}>SURVEY PLATFORM</Typography>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Paper>
  );
};

export default LoginPage;
