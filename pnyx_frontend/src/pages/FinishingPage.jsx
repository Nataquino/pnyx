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
  const steps = ["Create an account", "Select your interest", "Finish"];

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      {/* <Navbar /> */}
      <Box
        sx={{
          marginTop: "70px",
        }}
      >
        <Stepper activeStep={2} alternativeLabel>
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
            onClick={() => navigate("/")}
          >
            Finish
          </Button>
        </Container>
      </Container>
    </Stack>
  );
};

export default FinishingPage;
