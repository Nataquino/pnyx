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
import axios from "axios";

const SignUpPage = () => {
  const steps = [
    "Create an account",
    "Finish"
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

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(username.length === 0 ){
      alert('Username cannot be blank');
    }else if(firstname.length === 0){
      alert('First Name cannot be left blank');
    }else if(lastname.length === 0){
      alert('Last Name cannot be left blank');
    }else if(email.length === 0){
      alert('email cannot be left blank');
    }else if(password.length === 0){
      alert('Password cannot be left blank');
    }else{
      const url = 'http://localhost/survey-app/register.php';
      let fData = new FormData();
      fData.append('username',username)
      fData.append('firstname',firstname)
      fData.append('lastname',lastname)
      fData.append('gender',gender)
      fData.append('birthdate',birthdate)
      fData.append('email',email)
      fData.append('password',password)
      axios.post(url,fData).then(response=>alert(response.data)).catch(error=>alert(error))
      navigate("/finish")
    }
  }
  
  return (
    <Stack
      sx={{
        backgroundColor: "skyblue",
        height: "110vh",
      }}
    >
      <form action='/PHP/register.php' method="POST">
      <Box>
      <Button sx={{ marginTop: "30px", marginLeft:"30px" }}variant="contained" onClick={() => navigate("/")}>Back</Button>
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
            id="username"
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
            id="firstName"
            label="Enter Firstname"
            value={firstname}
            onChange={(e) => {
              setFname(e.target.value);
            }}
            sx={{ width: "50%" }}
          />
          <TextField
            id="lastName"
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
              id="gender"
              value={gender}
              label="gender"
              onChange={handleChange}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="birthDate"
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
            id="email"
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
            id="password"
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
          onClick = {handleSubmit}
        >
          Register
        </Button>
      </Container>
      </form>
    </Stack>
  );
};

export default SignUpPage;
