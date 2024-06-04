import {
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length === 0) {
      alert('Email cannot be left blank');
    } else if (password.length === 0) {
      alert('Password cannot be left blank');
    } else {
      const url = 'http://localhost/survey-app/authentication.php';
      let fData = new FormData();
      fData.append('username', username);
      fData.append('password', password);
      try {
        const response = await axios.post(url, fData);
        if (response.data.status === "success") {
          navigate('/home'); // Redirect to the home page
        } else {
          alert(response.data.message); // Show the error message
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    }
  }

  return (
    <Paper
      sx={{
        backgroundColor: "skyblue",
        height: "100vh",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ padding: "20px" }}>
        <Box
          fullWidth
          sx={{
            backgroundColor: "white",
            padding: "20px",
            width: "50vw",
            height: "90vh",
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
              margin: 5,
            }}
            alt="Logo"
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
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
              padding: 3, // Add padding to the container
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
            onClick={handleSubmit}
            sx={{
              marginTop: 2,
              backgroundColor: "#05B1BF",
              width: 150,
              marginBottom: 8,
            }}
          >
            LOGIN
          </Button>
          <Typography>
            {" "}
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/sign-up")}
              style={{ color: "#05B1BF" }}
            >
              Click here
            </span>
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: "grey", width: "50vw", height: "80vh" }}>
          <Typography>Put something here </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default LoginPage;
