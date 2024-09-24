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
import { useState } from "react";


const InterestPage = () => {
  const steps = ["Create an account", "Select your interest", "Finish"];

  const [isSportsDisabled, setSportsIsDisabled] = useState(false);
  const [isFoodDisabled, setFoodIsDisabled] = useState(false);
  const [isArtDisabled, setArtIsDisabled] = useState(false);
  const [isAcadDisabled, setAcadIsDisabled] = useState(false);
  const [isPolDisabled, setPolIsDisabled] = useState(false);
  const [isBookDisabled, setBookIsDisabled] = useState(false);
  const [isNewsDisabled, setNewsIsDisabled] = useState(false);
  const [isBusinessDisabled, setBusinessIsDisabled] = useState(false);

  const [btnvalue, setBtnValue] = useState("");
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
          <Typography sx={{ marginTop: "40px", fontSize: "30px" }}>
            Choose your Interest
          </Typography>
          <Typography>{btnvalue}</Typography>
          <Container
            sx={{
              width: "60vw",
              height: "50vh",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -3,
            }}
          >
            <Button
              disabled={isSportsDisabled}
              onClick={() => {
                setSportsIsDisabled(!isSportsDisabled);

                setBtnValue("Sports");
              }}
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
              disabled={isFoodDisabled}
              onClick={() => {
                setFoodIsDisabled(!isFoodDisabled);

                setBtnValue("Food");
              }}
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
              disabled={isArtDisabled}
              onClick={() => {
                setArtIsDisabled(!isArtDisabled);

                setBtnValue("Art");
              }}
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
              disabled={isAcadDisabled}
              onClick={() => {
                setAcadIsDisabled(!isAcadDisabled);

                setBtnValue("Academic");
              }}
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
              marginTop: -10,
            }}
          >
            <Button
              disabled={isPolDisabled}
              onClick={() => {
                setPolIsDisabled(!isPolDisabled);

                setBtnValue("Politics");
              }}
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
              disabled={isBookDisabled}
              onClick={() => {
                setBookIsDisabled(!isBookDisabled);

                setBtnValue("Books");
              }}
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
              disabled={isNewsDisabled}
              onClick={() => {
                setNewsIsDisabled(!isNewsDisabled);

                setBtnValue("News");
              }}
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
              disabled={isBusinessDisabled}
              onClick={() => {
                setBusinessIsDisabled(!isBusinessDisabled);

                setBtnValue("Business");
              }}
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
            onClick={() => navigate("/finish")}
          >
            Next
          </Button>
        </Container>
      </Stack>

  );
};
export default InterestPage;
