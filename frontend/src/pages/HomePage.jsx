import { Stack, Box, Container, Card, CardContent, Typography, Button, CardActions, Grid } from "@mui/material";
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
        if (Array.isArray(response.data)) {
          setSurveys(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
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
      const response = await axios.post("http://localhost/survey-app/check-passcode.php", {
        survey_id: lockedSurveyId,
        passcode: passcode
      });

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
                    height: "380px", // Adjusted height to fit points and other content
                    maxWidth: 420,  // Slightly increased width for better content fit
                    margin: "0 auto", // Center align cards
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, padding: "20px" }}>
                    <Typography variant="h5" component="div" sx={{ fontSize: "20px", fontWeight: "bold" }}>
                      {survey.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1, fontSize: "15px" }}>
                      {survey.description}
                    </Typography>
                    {/* Display the points of the survey */}
                    <Typography variant="body2" color="text.primary" sx={{ marginTop: 2, fontWeight: "bold" }}>
                      Points: {survey.survey_pts}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", padding: 2 }}>
                    {survey.is_locked === 1 ? (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleSurveyClick(survey.id, survey.is_locked)}
                        sx={{ fontWeight: "bold", borderRadius: "20px" }}
                      >
                        Enter passcode to open survey
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/take-survey/${survey.id}`}
                        sx={{ fontWeight: "bold", borderRadius: "20px" }}
                      >
                        Answer survey
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Passcode Modal */}
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
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
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
