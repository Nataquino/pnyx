import { Stack, Box, Container, Card, CardContent, Typography, Button, CardActions } from "@mui/material";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-approved-surveys.php");
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

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column", // Column layout for stacking
          justifyContent: "start",
          alignItems: "center", // Center cards horizontally
          marginTop: "50px",
        }}
      >
        <Stack fullWidth spacing={4} sx={{ backgroundColor: "skyblue", height: "100vh" }}>
          <Container sx={{ marginTop: 13, marginBottom: 5, flexGrow: 1 }}>
            <Stack spacing={4}> {/* Stack cards vertically with spacing */}
              {surveys.map((survey) => (
                <Card
                  key={survey.id}
                  sx={{
                    minWidth: 600,
                    height: "auto", // Make card height flexible
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 5,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ marginTop: 2, fontSize: "30px" }}
                    >
                      {survey.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 2 }}
                    >
                      {survey.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/take-survey/${survey.id}`}
                    >
                      Answer survey
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Container>
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomePage;
