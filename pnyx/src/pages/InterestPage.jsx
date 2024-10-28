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
import axios from "axios";

const InterestPage = () => {
  const steps = ["Create an account", "Interest", "Finish"];
  const navigate = useNavigate();

  const [selectedInterests, setSelectedInterests] = useState([]);

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prevSelectedInterests) =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest]
    );
  };

  const handleSubmit = async () => {
    try {
      const url = "http://localhost/survey-app/save-preferences.php";
      const userId = getCookieValue("user_id");

      if (!userId) {
        alert("User ID not found. Please log in or register.");
        return;
      }

      await axios.post(url, { interests: selectedInterests, userId }, { withCredentials: true });
      alert("Preferences saved successfully!");
      navigate("/finish");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <Stack
      sx={{
        backgroundColor: "skyblue",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", position: "absolute", top: "20px" }}>
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
          backgroundColor: "#FFF",
          width: "70vw", // Increased width
          maxWidth: "800px",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)", // Slightly stronger shadow
          borderRadius: "15px", // Increased border radius
          marginTop: "60px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600 }}>
          Choose Your Interests
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3, color: "text.secondary", textAlign: "center" }}>
          {selectedInterests.length > 0 ? selectedInterests.join(", ") : "No interests selected"}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", // Slightly bigger buttons
            gap: "2rem", // Increased gap for a more spacious look
            width: "100%",
            marginTop: 4,
          }}
        >
          {["Sports", "Food", "Art", "Academic", "Politics", "Books", "News", "Business"].map(
            (interest) => (
              <Button
                key={interest}
                variant="contained"
                onClick={() => toggleInterest(interest)}
                sx={{
                  height: "120px", // Larger circle size
                  width: "120px",
                  borderRadius: "50%",
                  backgroundColor: selectedInterests.includes(interest) ? "#66BB6A" : "#29B6F6", // Lighter, modern colors
                  color: "#FFF", // White text
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
                  transition: "transform 0.3s", // Smooth transition
                  "&:hover": {
                    backgroundColor: selectedInterests.includes(interest) ? "#4CAF50" : "#039BE5",
                    transform: "scale(1.1)", // Hover effect for enlargement
                  },
                }}
              >
                {interest.toUpperCase()}
              </Button>
            )
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#0288D1",
            color: "#FFF",
            padding: "12px",
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "2.5rem",
            ':hover': {
              backgroundColor: "#0277BD"
            },
          }}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Container>
    </Stack>
  );
};

export default InterestPage;
