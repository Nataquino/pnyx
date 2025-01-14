import {
  Stack,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [surveyLimit, setSurveyLimit] = useState(5); // Limit to 5 surveys per day
  const [answeredSurveys, setAnsweredSurveys] = useState(0); // Count of answered surveys
  const [nextAvailableDate, setNextAvailableDate] = useState(null); // Next available date to answer surveys
  const navigate = useNavigate();

  const getChipColor = (index) => {
    const colors = ["#4caf50", "#ff9800", "#2196f3", "#f44336", "#9c27b0", "#ffeb3b"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchSurveysAndLimit = async () => {
      try {
        const surveyResponse = await axios.get(
          "http://localhost/survey-app/get-recommendations.php",
          { withCredentials: true }
        );
        if (Array.isArray(surveyResponse.data)) {
          setSurveys(surveyResponse.data);
        }

        const limitResponse = await axios.get(
          "http://localhost/survey-app/get-user-limit.php",
          { withCredentials: true }
        );
        if (limitResponse.data) {
          setAnsweredSurveys(limitResponse.data.survey_count);
          setSurveyLimit(limitResponse.data.survey_limit);
          setNextAvailableDate(limitResponse.data.next_available_date);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSurveysAndLimit();
  }, []);

  const handleOpenDialog = (survey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSurvey(null);
    setPasscode("");
    setPasscodeError("");
  };

  const handleAnswerSurvey = (surveyId) => {
    navigate(`/take-survey/${surveyId}`);
    handleCloseDialog();
  };

  const handleEnterPasscode = async () => {
    try {
      const response = await axios.post(
        "http://localhost/survey-app/check-passcode.php",
        {
          survey_id: selectedSurvey.id,
          passcode,
        },
        { withCredentials: true }
      );
      if (response.data.status === "success") { // Updated from `success`
        handleAnswerSurvey(selectedSurvey.id);
      } else {
        setPasscodeError(response.data.message || "Invalid passcode. Please try again.");
      }
    } catch (error) {
      console.error("Error checking passcode:", error);
      setPasscodeError("An error occurred. Please try again.");
    }
  };

  return (
    <Stack sx={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ paddingTop: 4, paddingBottom: 5 }}>
        <Box sx={{ maxWidth: "90%", marginLeft: 10 }}>
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
            Available Surveys to Answer: {surveyLimit} (You have answered {answeredSurveys} today)
          </Typography>

          {nextAvailableDate && (
            <Typography variant="body1" color="text.primary" align="center" sx={{ marginBottom: 2 }}>
              You can answer more surveys on: {nextAvailableDate}
            </Typography>
          )}

          <Grid container spacing={4} justifyContent="flex-start">
            {surveys.map((survey) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={survey.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 16,
                    boxShadow: 12,
                    height: "320px",
                    maxWidth: 380,
                    margin: "0 auto",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", textAlign: "center", marginTop: 3 }}
                    >
                      {survey.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginTop: 2,
                        textAlign: "center",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {survey.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                      size="medium"
                      onClick={() => handleOpenDialog(survey)}
                      sx={{
                        backgroundColor: survey.is_locked || surveyLimit <= 0 ? "#ff9800" : "#4caf50",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: survey.is_locked || surveyLimit <= 0 ? "#fb8c00" : "#43a047",
                        },
                        margin: 5,
                        pointerEvents: surveyLimit <= 0 ? 'none' : 'auto',
                      }}
                    >
                      {survey.is_locked ? "Enter Passcode" : "Open Survey"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      {/* Dialog for Survey */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        {selectedSurvey && (
          <>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              {selectedSurvey.title}
            </DialogTitle>
            <Box sx={{ height: 2 }}></Box>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {selectedSurvey.description}
              </Typography>
              <Box sx={{ marginTop: 2, textAlign: "center" }}>
                {selectedSurvey.categories &&
                  selectedSurvey.categories.split(",").map((category, index) => (
                    <Chip
                      key={index}
                      label={category.trim()}
                      sx={{
                        margin: 0.5,
                        backgroundColor: getChipColor(index),
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: "16px",
                        "&:hover": {
                          backgroundColor: "#000",
                          color: "#fff",
                        },
                      }}
                    />
                  ))}
              </Box>
              {selectedSurvey.is_locked && (
                <Box sx={{ marginTop: 2 }}>
                  <TextField
                    label="Passcode"
                    fullWidth
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    error={!!passcodeError}
                    helperText={passcodeError}
                  />
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} variant="outlined" color="error">
                Close
              </Button>
              {selectedSurvey.is_locked ? (
                <Button onClick={handleEnterPasscode} variant="contained" color="primary">
                  Submit Passcode
                </Button>
              ) : (
                <Button
                  onClick={() => handleAnswerSurvey(selectedSurvey.id)}
                  variant="contained"
                  color="primary"
                  disabled={surveyLimit <= 0}
                >
                  Answer Survey
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

export default HomePage;
