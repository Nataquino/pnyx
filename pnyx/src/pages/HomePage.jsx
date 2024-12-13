import { Stack, Box, Container, Card, CardContent, Typography, Button, CardActions } from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";


const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-recommendations.php", { withCredentials: true });
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
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "auto" }}>
      <NavBar />
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column", // Column layout for stacking
           // Center cards horizontally
          marginTop: "20px",
          paddingBottom: 5,
          width: "80vw",
          minHeight: "100vh",
        }}
      >
          <Container spacing={9} sx={{ marginTop: 5, marginBottom: 4, flexGrow: 1}}>
            {surveys.length === 0 && (
              <Typography variant="h6" color="error">
                No surveys found.
              </Typography>
            )}
            <Stack spacing={4}> {/* Stack cards vertically with spacing */}
              {surveys.map((survey) => (
                <Card
                  key={survey.id}
                  sx={{
                    width: "100vh",
                    maxWidth: 900, // Make card responsive with max width
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

      </Box>
    </Stack>
  );
};

export default HomePage;
