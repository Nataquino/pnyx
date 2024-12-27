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
        } else {
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "90%", sm: "80%", md: "70%" },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: { xs: "100%", sm: "50%" },
          }}
        >
          <Box
            component="img"
            sx={{
              height: 120,
              width: 120,
              borderRadius: "50%",
              marginBottom: 2,
            }}
            alt="Logo"
            src={logo}
          />
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 500,
              padding: 2,
            }}
          >
            <Typography variant="body1">Username</Typography>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ width: "100%", marginBottom: 2 }}
            />
          </Container>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 500,
              padding: 2,
            }}
          >
            <Typography variant="body1">Password</Typography>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "100%", marginBottom: 3 }}
            />
          </Container>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#05B1BF",
              width: "100%",
              padding: 1.5,
            }}
          >
            LOGIN
          </Button>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/sign-up")}
              style={{ color: "#05B1BF", cursor: "pointer" }}
            >
              Click here
            </span>
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#12A1E6",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
            width: { xs: "100%", sm: "50%" },
          }}
        >
          <Box
            component="img"
            sx={{
              maxHeight: 300,
              width: "100%",
              objectFit: "contain",
              marginBottom: 3,
            }}
            alt="loginphoto"
            src={loginphoto}
          />
          <Typography
            sx={{
              fontFamily: "fantasy",
              fontSize: { xs: 40, sm: 50, md: 70 },
              textAlign: "center",
            }}
          >
            SURVEY PLATFORM
          </Typography>
        </Box>
      </Card>
    </Paper>
  );
};

export default LoginPage;
