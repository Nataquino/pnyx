import {
  Stack,
  Box,
  Stepper,
  Step,
  StepLabel,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const steps = [
    "Create an account",
    "Select your interest",
    "Finish",
  ];

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Stack
      sx={{
        backgroundColor: "skyblue",
        height: "110vh",
      }}
    >
      <Box>
        <Typography>
          <span onClick={() => navigate("/")}>TTTTT</span>
        </Typography>
        <Stepper activeStep={0} alternativeLabel sx={{ marginTop: "70px" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Container
        sx={{
          backgroundColor: "#F5F5F5",
          width: "45vw",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "35px",
        }}
      >
        <Typography sx={{ fontSize: "45px", marginBottom: 5, marginTop: 8 }}>
          Signup
        </Typography>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-start", // Align items to the left
            width: "80%", // Take the full width of the parent container
            maxWidth: 500, // Set a maximum width for the container
            padding: 1, // Add padding to the container
          }}
        >
          <TextField
            label="Enter username"
            sx={{
              width: "100%",
            }}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-start", // Align items to the left
            width: "80%", // Take the full width of the parent container
            maxWidth: 500, // Set a maximum width for the container
            padding: 1, // Add padding to the container
          }}
        >
          <TextField
            label="Enter Firstname"
            value={firstname}
            onChange={(e) => {
              setFname(e.target.value);
            }}
            sx={{ width: "50%" }}
          />
          <TextField
            label="Enter Lastname"
            value={lastname}
            onChange={(e) => {
              setLname(e.target.value);
            }}
            sx={{ marginLeft: "30px", width: "50%" }}
          />
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-start", // Align items to the left
            width: "80%", // Take the full width of the parent container
            maxWidth: 500, // Set a maximum width for the container
            padding: 1, // Add padding to the container,
          }}
        >
          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="select-gender">Gender</InputLabel>
            <Select
              labelId="select-gender"
              id="select"
              value={gender}
              label="gender"
              onChange={handleChange}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Birthdate"
            value={birthdate}
            onChange={(e) => {
              setBirthdate(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            type="date"
            sx={{ marginLeft: "30px", width: "50%" }}
          />
        </Container>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Align items to the left
            width: "80%", // Take the full width of the parent container
            maxWidth: 500, // Set a maximum width for the container
            padding: 1,
          }}
        >
          <TextField
            label="Enter Email"
            sx={{
              width: "100%",
            }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label="Enter Password"
            sx={{
              width: "100%",
              marginTop: "18px",
            }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </Container>
        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            backgroundColor: "#05B1BF",
            width: 150,
            marginBottom: 8,
          }}
          onClick={() => navigate("/interest")}
        >
          Register
        </Button>
      </Container>
    </Stack>
  );
};

export default SignUpPage;
