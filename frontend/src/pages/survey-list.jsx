import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CardActions,
  Stack,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import SurveyNavBar from "../components/SurveyNavBar";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [lockModal, setLockModal] = useState({ open: false, surveyId: null });
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          "http://localhost/survey-app/get-owned-surveys.php",
          { withCredentials: true }
        );
        console.log(response.data);
        setSurveys(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  const getStatusLabelColor = (status) => {
    switch (status) {
      case "pending":
        return "gray";
      case "declined":
        return "red";
      case "approved":
        return "green";
      case "activated":
        return "blue";
      default:
        return "gray";
    }
  };

  const activateSurvey = async (surveyId) => {
    try {
      const response = await axios.post(
        "http://localhost/survey-app/activate-survey.php",
        { survey_id: surveyId },
        { withCredentials: true }
      );
      console.log(response.data);
      alert(response.data.message || "Survey activated successfully");
    } catch (error) {
      console.error("Error activating survey:", error);
      alert("Failed to activate the survey. Please try again.");
    }
  };

  const lockSurvey = async (surveyId, passcode) => {
    try {
      const response = await axios.post(
        "http://localhost/survey-app/lock-survey.php",
        { survey_id: surveyId, passcode: passcode },
        { withCredentials: true }
      );
      console.log(response.data);
      alert(response.data.message || "Survey locked successfully.");
    } catch (error) {
      console.error("Error locking survey:", error);
      alert("Failed to lock the survey. Please try again.");
    }
  };

  const handleLockButtonClick = (surveyId) => {
    setLockModal({ open: true, surveyId });
  };

  const handleLockSubmit = () => {
    if (passcode.trim() === "") {
      alert("Please enter a passcode to lock the survey.");
      return;
    }
    lockSurvey(lockModal.surveyId, passcode);
  };

  return (
    <Stack
      maxHeight={"100vh"}
      sx={{ backgroundColor: "skyblue", height: "100vh" }}
    >
      <SurveyNavBar />
      <Container
        maxWidth={false}
        sx={{
          marginTop: 10,
          paddingBottom: 2,
          flexGrow: 1,
          overflowY: "auto",
          padding: 5,
          
        }}
      >
        {surveys.length === 0 ? (
          <Stack alignItems="center" spacing={3}>
            <Typography variant="h5" sx={{ marginTop: 5 }}>
              No surveys found, create one :)
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/create-survey"
              sx={{
                borderRadius: "20px",
                padding: "10px 20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Create Survey
            </Button>
          </Stack>
        ) : (
          <Grid container spacing={4}>
            {surveys.map((survey) => (
              <Grid item xs={12} sm={6} md={4} key={survey.id}>
                <Card
                  sx={{
                    height: "100%", // Ensures the card takes up the full height of its container
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 5,
                    backgroundColor: "#fff",
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: "22px", fontWeight: "bold" }}
                    >
                      {survey.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 1, fontSize: "16px" }}
                    >
                      {survey.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: 1,
                        fontWeight: "bold",
                        color: getStatusLabelColor(survey.status),
                      }}
                    >
                      {`Status: ${survey.status}`}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    {/* Buttons for survey actions */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Modal for locking survey */}
      <Modal
        open={lockModal.open}
        onClose={() => setLockModal({ open: false, surveyId: null })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: "350px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Lock Survey
          </Typography>
          <TextField
            label="Passcode"
            variant="outlined"
            fullWidth
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLockSubmit}
            sx={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
};

export default SurveyList;
