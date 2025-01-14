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
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const steps = ["Create an account", "Interest", "Finish"];
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  // Added for displaying errors

  const handleChange = (event) => {
    setGender(event.target.value);
  };

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
      setLoading(true);
      setErrorMessage("");  // Reset error message on new submit

      const response = await axios.post(url, fData, { withCredentials: true });

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/verification");
      } else {
        alert(`Unexpected response: ${response.data.message || "Please try again."}`);
      }
    } catch (error) {
      setLoading(false);  // Make sure to stop loading state
      if (error.response) {
        // Show detailed error message from backend
        setErrorMessage(`Server error: ${error.response.data.message || "Failed to register."}`);
      } else if (error.request) {
        setErrorMessage("Network error: No response received from server.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

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
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, padding: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back
        </Button>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 500 }}>
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
          width: "50vw",
          maxWidth: 500,  // Changed maxWidth to 500px for a smaller box
          padding: 3,
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Typography sx={{ fontSize: { xs: "30px", sm: "45px" }, marginBottom: 4 }}>
          Signup
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                id="username"
                label="Enter username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>

            {/* Firstname and Lastname */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstName"
                label="Enter Firstname"
                fullWidth
                value={firstname}
                onChange={(e) => setFname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastName"
                label="Enter Lastname"
                fullWidth
                value={lastname}
                onChange={(e) => setLname(e.target.value)}
              />
            </Grid>

            {/* Gender and Birthdate */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="select-gender">Gender</InputLabel>
                <Select
                  labelId="select-gender"
                  id="gender"
                  value={gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="birthDate"
                label="Birthdate"
                type="date"
                fullWidth
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Email, Password, and Confirm Password */}
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Enter Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Enter Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 4,
                  backgroundColor: "#05B1BF",
                  width: "100%",
                  padding: "10px 0",
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Register"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display error message */}
        {errorMessage && (
          <Typography sx={{ color: "red", marginTop: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Container>
    </Stack>
  );
};

export default SignUpPage;
