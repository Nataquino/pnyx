import { Stack, Box, Typography, Stepper, Step, StepLabel, Container, Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import checkmark icon

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
        paddingTop: "2rem",
      }}
    >
      <Box sx={{ width: "100%", position: "absolute", top: "20px" }}>
        <Stepper activeStep={1} alternativeLabel sx={{ marginBottom: "2rem" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ fontWeight: "600", fontSize: "1rem" }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Container
        sx={{
          backgroundColor: "#FFF",
          width: "80vw", // Responsive width
          maxWidth: "900px", // Larger width for desktop
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          marginTop: "60px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600, color: "#1976d2" }}>
          Choose Your Interests
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 3,
            color: "text.secondary",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {selectedInterests.length > 0 ? selectedInterests.join(", ") : "No interests selected"}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", // Responsive grid
            gap: "2rem", // Larger gap for a more spacious look
            width: "100%",
            marginTop: 4,
          }}
        >
          {["Sports", "Food", "Art", "Academic", "Politics", "Books", "News", "Business"].map(
            (interest) => (
              <Button
                key={interest}
                variant="outlined"
                onClick={() => toggleInterest(interest)}
                sx={{
                  height: "120px", // Larger button size
                  width: "120px",
                  borderRadius: "50%",
                  border: selectedInterests.includes(interest) ? "none" : "2px solid black", // Border on unselected state
                  backgroundColor: selectedInterests.includes(interest) ? "#9ACD32" : "#87CEEB", // Yellow-green on select, skyblue on unselect
                  color: selectedInterests.includes(interest) ? "#FFF" : "#000", // Text color on selection
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative", // Necessary for background positioning
                  transition: "transform 0.3s, background-color 0.3s, opacity 0.3s", // Added opacity transition
                  opacity: selectedInterests.includes(interest) ? 0.50 : 1, // Reduced opacity for the button when selected
                  "&:hover": {
                    transform: "scale(1.1)", // Smooth scaling on hover
                    backgroundColor: selectedInterests.includes(interest)
                      ? "#7FAF2F" // Darker green on hover
                      : "#87CEEB", // Skyblue on hover
                  },
                  // Checkmark in background when selected
                  "&:after": {
                    content: selectedInterests.includes(interest) ? '"✓"' : '""', // Checkmark symbol
                    position: "absolute",
                    fontSize: selectedInterests.includes(interest) ? "90px" : "40px", // Larger checkmark when selected
                    color: "green", // Checkmark color (yellow)
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Centering the checkmark
                    fontWeight: "bold", // Make checkmark bold
                    opacity: 1, // Keep checkmark opacity normal
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
