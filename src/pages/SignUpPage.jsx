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
  const steps = ["Create an account", "Interest", "Finish"];

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
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationMessage = validateForm();
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const url = "http://localhost/survey-app/register.php";
    const fData = new FormData();
    fData.append("username", username);
    fData.append("firstname", firstname);
    fData.append("lastname", lastname);
    fData.append("gender", gender);
    fData.append("birthdate", birthdate);
    fData.append("email", email);
    fData.append("password", password);

    try {
      // Show loading spinner, disable submit button
      setLoading(true);

      const response = await axios.post(url, fData, { withCredentials: true });

      if (response.status === 200) {
        // Registration success
        alert(response.data.message);
        navigate("/verification"); // Redirect to verification page
      } else {
        // Handle unexpected responses
        alert(
          `Unexpected response: ${response.data.message || "Please try again."}`
        );
      }
    } catch (error) {
      // Better error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(
          `Server error: ${
            error.response.data.message || "Failed to register."
          }`
        );
      } else if (error.request) {
        // No response was received from the server
        alert("Network error: No response received from server.");
      } else {
        // Other errors (setup, configuration, etc.)
        alert(`Error: ${error.message}`);
      }
    } finally {
      // Reset loading state after request
      setLoading(false);
    }
  };

  // Validation function to check form inputs
  const validateForm = () => {
    if (!username.trim()) return "Username cannot be blank";
    if (!firstname.trim()) return "First Name cannot be blank";
    if (!lastname.trim()) return "Last Name cannot be blank";
    if (!email.trim()) return "Email cannot be blank";
    if (!password.trim()) return "Password cannot be blank";
    return null;
  };

  return (
    <Stack
      sx={{
        backgroundColor: "skyblue",
        height: "110vh",
      }}
    >
      <Box>
        <Button
          sx={{ marginTop: "20px", marginLeft: "30px" }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
        <Stepper activeStep={0} alternativeLabel sx={{ marginTop: "30px" }}>
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
          marginTop: "20px",
        }}
      >
        <Typography sx={{ fontSize: "45px", marginTop: 8 }}>
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
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            sx={{
              width: "100%",
              marginTop: "18px",
            }}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
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
            marginBottom: 10,
          }}
          onClick={handleSubmit}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Submitting..." : "Register"}
        </Button>
      </Container>
    </Stack>
  );
};

export default SignUpPage;
