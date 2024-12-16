import { Stack, Box, Container, Card, CardContent, Typography, Button, CardActions } from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [passcode, setPasscode] = useState(""); // To store the entered passcode
  const [lockedSurveyId, setLockedSurveyId] = useState(null); // Store the survey ID of the locked survey
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-recommendations.php", { withCredentials: true });
        console.log(response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setSurveys(response.data);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  const handleSurveyClick = (surveyId, passcode) => {
    if (surveyId && passcode) {
      // If survey is locked, prompt for passcode
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
      // Submit passcode to verify
      const response = await axios.post("http://localhost/survey-app/check-passcode.php", {
        survey_id: lockedSurveyId,
        passcode: passcode
      });

      if (response.data.status === "success") {
        // If passcode is correct, navigate to the survey
        navigate(`/take-survey/${lockedSurveyId}`);
      } else {
        alert("Incorrect passcode.");
      }
    } catch (error) {
      console.error("Error verifying passcode:", error);
    }
  };

  return (
    <Stack sx={{ backgroundColor: "skyblue", height: "auto" }}>
      <NavBar />
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          paddingBottom: 5,
          width: "80vw",
          minHeight: "100vh",
        }}
      >
        <Container spacing={9} sx={{ marginTop: 5, marginBottom: 4, flexGrow: 1 }}>
          {surveys.length === 0 && (
            <Typography variant="h6" color="error">
              No surveys found.
            </Typography>
          )}
          <Stack spacing={4}>
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                sx={{
                  width: "100vh",
                  maxWidth: 900,
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5,
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ marginTop: 2, fontSize: "30px" }}>
                    {survey.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                    {survey.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
                  {survey.is_locked ? (
                    <Button size="small" color="primary" onClick={() => handleSurveyClick(survey.id, survey.passcode)}>
                      Enter passcode to open survey
                    </Button>
                  ) : (
                    <Button size="small" color="primary" component={Link} to={`/take-survey/${survey.id}`}>
                      Answer survey
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>
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
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6">Enter Passcode</Typography>
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            style={{ marginTop: "10px", padding: "10px", width: "100%" }}
          />
          <Button sx={{ marginTop: "10px" }} onClick={handlePasscodeSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default HomePage;
