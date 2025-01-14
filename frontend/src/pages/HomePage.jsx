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
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // Track dialog state
  const [selectedSurvey, setSelectedSurvey] = useState(null); // Track selected survey
  const [energy, setEnergy] = useState(100);
  const navigate = useNavigate();

  const getChipColor = (index) => {
    const colors = [
      "#4caf50", // Green
      "#ff9800", // Orange
      "#2196f3", // Blue
      "#f44336", // Red
      "#9c27b0", // Purple
      "#ffeb3b", // Yellow
    ];
    return colors[index % colors.length]; // Cycle through colors
  };

  useEffect(() => {
    const fetchSurveysAndEnergy = async () => {
      try {
        const surveyResponse = await axios.get(
          "http://localhost/survey-app/get-recommendations.php",
          { withCredentials: true }
        );
        if (Array.isArray(surveyResponse.data)) {
          setSurveys(surveyResponse.data);
        }

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

  const handleOpenDialog = (survey) => {
    setSelectedSurvey(survey); // Set the selected survey for the dialog
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSurvey(null); // Clear selected survey on close
  };

  const handleAnswerSurvey = (surveyId) => {
    navigate(`/take-survey/${surveyId}`);
    setDialogOpen(false); // Close dialog when navigating
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
            Energy: {energy}
          </Typography>

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
                      sx={{ fontWeight: "bold", textAlign: "center", marginTop: 2 }}
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
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#43a047",
                        },
                        margin: 5,
                      }}
                    >
                      Open Survey
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
              {/* Display Survey Categories with Chips */}
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
                        borderRadius: "16px", // Round shape for better design
                        "&:hover": {
                          backgroundColor: "#000",
                          color: "#fff",
                        },
                      }}
                    />
                  ))}
              </Box>
            </DialogContent>

            <DialogActions>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "22vw",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "left" }}
                >
                  Points: {selectedSurvey.survey_pts}
                </Typography>
              </Box>

              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                color="error"
              >
                Close
              </Button>
              <Button
                onClick={() => handleAnswerSurvey(selectedSurvey.id)}
                variant="contained"
                color="primary"
              >
                Answer Survey
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

export default HomePage;
