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
} from "@mui/material";
import { Link } from "react-router-dom";
import SurveyNavBar from "../components/SurveyNavBar";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [showComment, setShowComment] = useState({});

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost/survey-app/get-owned-surveys.php', { withCredentials: true });
        console.log(response.data); // Log the fetched data
        
        // Ensure surveys is always an array
        setSurveys(Array.isArray(response.data) ? response.data : []); 
      } catch (error) {
        console.error("Error fetching surveys:", error); // Handle errors
      }
    };

    fetchSurveys(); // Call the fetch function
  }, []); 

  // Function to return the status label color
  const getStatusLabelColor = (status) => {
    switch (status) {
      case "pending":
        return "gray";
      case "declined":
        return "red";
      case "approved":
        return "green";
      case "activated":
        return "blue"; // Added color for "activated"
      default:
        return "gray";
    }
  };

  // Function to toggle comment visibility for declined surveys
  const toggleComment = (id) => {
    setShowComment((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Function to activate the survey
  const activateSurvey = async (surveyId) => {
    try {
      const response = await axios.post(
        'http://localhost/survey-app/activate-survey.php',
        { survey_id: surveyId },
        { withCredentials: true }
      );
      console.log(response.data);
      alert(response.data.message || "Survey activated successfully");
      // Optionally, refetch surveys after activation
      // fetchSurveys();
    } catch (error) {
      console.error("Error activating survey:", error);
      alert("Failed to activate the survey. Please try again.");
    }
  };

  return (
    <Stack maxHeight={"100vh"} sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <SurveyNavBar />
      <Container maxWidth={false} sx={{ marginTop: 10, paddingBottom: 2, flexGrow: 1, overflowY: "auto", padding: 5, height: "50vh" }}>
        {/* Check if surveys array is empty and display message */}
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
                    minWidth: 275,
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 5,
                    backgroundColor: "#f5f5f5",
                    paddingBottom: 2,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    {/* Survey Title */}
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ marginTop: 2, fontSize: "30px" }}
                    >
                      {survey.title}
                    </Typography>

                    {/* Survey Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 2 }}
                    >
                      {survey.description}
                    </Typography>

                    {/* Status Indicator */}
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: 1,
                        fontWeight: "bold",
                        color: getStatusLabelColor(survey.status),
                      }}
                    >
                      {survey.status === "pending"
                        ? "Status: Pending"
                        : survey.status === "declined"
                        ? "Status: Declined"
                        : survey.status === "approved"
                        ? "Status: Approved"
                        : survey.status === "activated"
                        ? "Status: Activated"
                        : "Status: Unknown"}
                    </Typography>

                    {/* Show comment button for declined surveys */}
                    {survey.status === "declined" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => toggleComment(survey.id)}
                          sx={{ marginTop: 1 }}
                        >
                          {showComment[survey.id] ? "Hide Comment" : "View Comment"}
                        </Button>

                        {/* Conditionally display comment */}
                        {showComment[survey.id] && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ marginTop: 1 }}
                          >
                            Comment: {survey.comment}
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>

                  <CardActions
                    sx={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* See Results Button */}
                    {survey.status !== "declined" && survey.status !== "pending" && (
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/result/${survey.id}`}
                      >
                        See Results
                      </Button>
                    )}

                    {/* Activate Survey Button - Disable if already activated */}
                    {survey.status === "approved" && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => activateSurvey(survey.id)}
                        disabled={survey.status === "activated"} // Disable if already activated
                      >
                        {survey.status === "activated" ? "Activated" : "Activate Survey"}
                      </Button>
                    )}

                    {/* Edit Survey Button - Display for "approved" or "activated" surveys */}
                    {(survey.status === "approved" || survey.status === "activated") && (
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/edit-survey/${survey.id}`}
                      >
                        Edit Survey
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Stack>
  );
};

export default SurveyList;
