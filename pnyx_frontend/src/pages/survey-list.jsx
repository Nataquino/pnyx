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
  div,
} from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          "http://localhost/survey-app/get-surveys.php"
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

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue",}}>
      <NavBar />
      <Container  sx={{marginTop: 13, marginBottom: 5, flexGrow: 1}}>
        <Grid container spacing={4}>
          {surveys.map((survey) => (
            <Grid item xs={15} sm={6} md={4} key={survey.id} >
              <Card
                sx={{
                  minWidth: 275,
                  height: "40vh",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5
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
                  {/* <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/take-survey/${survey.id}`}
                  >
                    Answer Survey
                  </Button>
                </Box> */}
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
            </Grid>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default SurveyList;
