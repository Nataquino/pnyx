import {
  Stack,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Container,
  Button,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const FinishingPage = () => {
  const navigate = useNavigate();
  const steps = ["Create an account", "Interest","Finish"];

  // Utility function to delete a cookie by name
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Handle the finish button click
  const handleFinish = () => {
    // Delete specific cookies
    deleteCookie('username');          // Replace with actual cookie name if different
    deleteCookie('user_id');            // Replace with actual cookie name if different

    // Navigate to the home page
    navigate("/");
  };

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      {/* <Navbar /> */}
      <Box>
        <Button
          sx={{ marginTop: "30px", marginLeft: "30px" }}
          variant="contained"
          onClick={() => navigate("/sign-up")}
        >
          Back
        </Button>
        <Stepper
          activeStep={1} // Changed to 1 since there are 2 steps (0-indexed)
          alternativeLabel
          sx={{ maxWidth: '1000px', margin: 'auto', textAlign: 'center' }}
        >
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
          width: "40vw",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          marginTop: "70px",
        }}
      >
        <Container sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <Typography sx={{ fontSize: "60px" }}>Ready to go</Typography>
        </Container>
        <Container sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              marginTop: 10,
              backgroundColor: "#05B1BF",
              width: 150,
              height: 50,
            }}
            onClick={handleFinish} // Use the handleFinish function
          >
            Finish
          </Button>
        </Container>
      </Container>
    </Stack>
  );
};

export default FinishingPage;
