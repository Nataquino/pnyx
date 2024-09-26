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
        const response = await axios.get(
          "http://localhost/survey-app/get-owned-surveys.php"
        );
        console.log(response); // Log the entire response
        console.log(response.data); // Log the response data
        console.log(Array.isArray(response.data)); // Check if response.data is an array

        if (Array.isArray(response.data)) {
          setSurveys(response.data);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
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

  return (
    <Stack fullwidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <SurveyNavBar />
      <Container sx={{ marginTop: 13, marginBottom: 5, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {surveys.map((survey) => (
            <Grid item xs={15} sm={6} md={4} key={survey.id}>
              <Card
                sx={{
                  minWidth: 275,
                  height: "auto", // Adjust height to accommodate content
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5,
                  backgroundColor: "#f5f5f5", // Light gray for all cards
                  paddingBottom: 2,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for a light effect
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
                      : "Status: Approved"}
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
                    justifyContent: "flex-end",
                  }}
                >
                  {/* Only show the 'See Results' button if the survey status is not 'declined' or 'pending' */}
                  {survey.status !== "declined" && survey.status !== "pending" && (
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/result/${survey.id}`} // Include the survey ID in the URL
                    >
                      See Results
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default SurveyList;
