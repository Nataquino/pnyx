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
import axios from "axios";

import logo from "../image/logo.jpg";
import loginphoto from "../image/loginphoto.png";

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
        const response = await axios.post(url, fData, {withCredentials: true});
        console.log(response.data); // Log the response data to the console
        if(username === 'admin' && password === 'admin'){
          navigate('/admin');
        }else{
          if (response.data.status === "success") {
            navigate('/home'); // Redirect to the home page
          } else {
            alert(response.data.message); // Show the error message
          }
        }
        
      } catch (error) {
        console.error('An error occurred:', error.message); // Log the error message to the console
        alert('An error occurred: ' + error.message);
      }
    }
  };

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
              height: "81.3vh",
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
              onClick={handleSubmit}
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
                onClick={() => navigate("/sign-up")}
                style={{ color: "#05B1BF" }}
              >
                Click here
              </span>
            </Typography>
          </Box>

          <Box
          maxHeight={"200vh"}
          fullWidth
            sx={{
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
