import {
  Stack,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Grid,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [passcode, setPasscode] = useState(""); // To store the entered passcode
  const [lockedSurveyId, setLockedSurveyId] = useState(null); // Store the survey ID of the locked survey
  const [energy, setEnergy] = useState(100); // Track user energy
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveysAndEnergy = async () => {
      try {
        // Fetch surveys
        const surveyResponse = await axios.get(
          "http://localhost/survey-app/get-recommendations.php",
          { withCredentials: true }
        );
        if (Array.isArray(surveyResponse.data)) {
          setSurveys(surveyResponse.data);
          console.log(surveyResponse.data);
        }

        // Fetch user energy
        const energyResponse = await axios.get(
          "http://localhost/survey-app/get-user-energy.php",
          { withCredentials: true }
        );
        setEnergy(energyResponse.data.energy);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSurveysAndEnergy();
  }, []);

  const handleSurveyClick = (surveyId, isLocked) => {
    if (isLocked === 1) {
      setLockedSurveyId(surveyId);
    } else {
      navigate(`/take-survey/${surveyId}`);
    }
  };

  const handlePasscodeSubmit = async () => {
    if (passcode.trim() === "") {
      alert("Please enter the passcode.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/survey-app/check-passcode.php",
        {
          survey_id: lockedSurveyId,
          passcode: passcode,
        }
      );

      if (response.data.status === "success") {
        navigate(`/take-survey/${lockedSurveyId}`);
        setLockedSurveyId(null);
      } else {
        alert("Incorrect passcode.");
      }
    } catch (error) {
      console.error("Error verifying passcode:", error);
    }
  };

  const handleCancel = () => {
    setLockedSurveyId(null); // Close the passcode popup if the user cancels
  };

  return (
    <Stack sx={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ paddingTop: 4, paddingBottom: 5 }}>
        <Container sx={{ maxWidth: "lg" }}>
          {surveys.length === 0 && (
            <Typography variant="h6" color="error" align="center">
              No surveys found.
            </Typography>
          )}

          <Typography
            variant="h6"
            color="text.primary"
            align="center"
            sx={{ marginBottom: 2 }}
          >
            Energy: {energy}
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {surveys.map((survey) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={survey.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 12,
                    boxShadow: 8,
                    height: "380px",
                    maxWidth: 420,
                    margin: "0 auto",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform:
                        energy === 0 ? "none" : "scale(1.05)", // Disable hover if energy is 0
                      boxShadow:
                        energy === 0 ? "none" : "0 12px 30px rgba(0, 0, 0, 0.2)",
                    },
                    opacity: energy === 0 ? 0.5 : 1, // Dim card if energy is 0
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, padding: "20px" }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      {survey.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 1, fontSize: "15px" }}
                    >
                      {survey.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ marginTop: 2, fontWeight: "bold" }}
                    >
                      Points: {survey.survey_pts}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", padding: 2 }}>
                    <Button
                      size="small"
                      color="primary"
                      disabled={energy === 0} // Disable button if energy is 0 or survey is locked
                      onClick={() =>
                        handleSurveyClick(survey.id, survey.is_locked)
                      }
                      sx={{
                        fontWeight: "bold",
                        borderRadius: "20px",
                      }}
                    >
                      {survey.is_locked === 1
                        ? "Enter passcode to open survey"
                        : "Answer survey"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {lockedSurveyId && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            width: "300px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Enter Passcode
          </Typography>
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            style={{
              marginTop: "10px",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              sx={{ marginRight: "10px", fontWeight: "bold", borderRadius: "8px" }}
              onClick={handlePasscodeSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ fontWeight: "bold", borderRadius: "8px" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default HomePage;
