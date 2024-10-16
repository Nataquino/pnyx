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
import axios from "axios"; // For making API requests

const InterestPage = () => {
  const steps = ["Create an account", "Interest","Finish"];
  const navigate = useNavigate();

  // State for selected interests
  const [selectedInterests, setSelectedInterests] = useState([]);

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  // Function to toggle interest selection
  const toggleInterest = (interest) => {
    setSelectedInterests((prevSelectedInterests) =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest]
    );
  };

  // Function to handle the final submission
  const handleSubmit = async () => {
    try {
      const url = "http://localhost/survey-app/save-preferences.php"; // Backend URL to save preferences
      const userId = getCookieValue("user_id"); // Replace with the actual user ID from your app
      await axios.post(url, { interests: selectedInterests, userId }, {withCredentials:true});
      alert("Preferences saved successfully!");
      navigate("/finish"); // Navigate to the final page after saving preferences
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <Stack sx={{ backgroundColor: "skyblue", height: "110vh" }}>
      <Box sx={{ marginTop: "70px" }}>
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
          Choose your Interests
        </Typography>
        <Typography>{selectedInterests.join(", ")}</Typography>

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
          {/* Sports */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Sports")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Sports")}
          >
            SPORTS
          </Button>

          {/* Food */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Food")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Food")}
          >
            FOOD
          </Button>

          {/* Art */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Art")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Art")}
          >
            ART
          </Button>

          {/* Academic */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Academic")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Academic")}
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
          {/* Politics */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Politics")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Politics")}
          >
            POLITICS
          </Button>

          {/* Books */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Books")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Books")}
          >
            BOOKS
          </Button>

          {/* News */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("News")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("News")}
          >
            NEWS
          </Button>

          {/* Business */}
          <Button
            variant="contained"
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              marginLeft: 2,
              marginRight: 2,
              backgroundColor: selectedInterests.includes("Business")
                ? "green"
                : "primary",
            }}
            onClick={() => toggleInterest("Business")}
          >
            BUSINESS
          </Button>
        </Container>
      </Container>

      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{ marginTop: 4, backgroundColor: "#05B1BF", width: 150, marginBottom: 8 }}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Container>
    </Stack>
  );
};

export default InterestPage;
