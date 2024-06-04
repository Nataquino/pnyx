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
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const InterestPage = () => {
  const steps = ["Create an account", "Select your interest", "Finish"];

  const navigate = useNavigate();
  return (
    <Stack
      sx={{
        backgroundColor: "skyblue",
        height: "110vh",
      }}
    >
      <Box
        sx={{
          marginTop: "70px",
        }}
      >
        <Stepper activeStep={1} alternativeLabel>
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
          width: "60vw",
          height: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "70px",
        }}
      >
        <Typography sx={{ marginTop: "40px" , fontSize: "30px"}}>Choose your Interest</Typography>
        <Container
          sx={{
            width: "60vw",
            height: "50vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -3
          }}
        >
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            SPORTS
          </Button>

          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            FOOD
          </Button>
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            ART
          </Button>
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            ACADEMIC
          </Button>
        </Container>
        <Container
          sx={{
            width: "60vw",
            height: "50vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -3,
            marginTop: -10
          }}
        >
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            POLITICS
          </Button>

          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            BOOKS
          </Button>
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            NEWS
          </Button>
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            BUSINESS
          </Button>
        </Container>
      </Container>

      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            backgroundColor: "#05B1BF",
            width: 150,
            marginBottom: 8,
          }}
          onClick={() => navigate("/signup")}
        >
          Next
        </Button>
      </Container>
    </Stack>
  );
};
export default InterestPage;
