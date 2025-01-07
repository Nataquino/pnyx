import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PollIcon from "@mui/icons-material/Poll";
import AdminMain from "../components/AdminMain";
import axios from "axios";

const Admin = () => {
  const [userCount, setUserCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost/survey-app/admin-stats.php")
      .then((res) => {
        if (res.data && res.data.users && res.data.surveys) {
          setUserCount(res.data.users.length);
          setSurveyCount(res.data.surveys.length);
        } else {
          setError("Unexpected data structure received.");
          console.error("Response:", res.data);
        }
      })
      .catch((err) => {
        setError("There was an error fetching the admin stats!");
        console.error("Error:", err);
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetching data
      });
  }, []);

  return (
    <Stack sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <AdminMain />
      <Stack
        sx={{
          backgroundColor: "skyblue",
          minHeight: "100vh",
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -9,
        }}
      >
        {/* Dashboard Title */}
        <Box sx={{ textAlign: "center", marginBottom: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of system statistics
          </Typography>
        </Box>

        {/* Loading or Error */}
        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Alert severity="error" sx={{ width: "50%", textAlign: "center" }}>
            {error}
          </Alert>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            {/* Total Users Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  padding: 2,
                }}
              >
                <CardContent>
                  <PeopleIcon
                    sx={{
                      fontSize: 50,
                      color: "#1976d2",
                      marginBottom: 1,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {userCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Surveys Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#ede7f6",
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                  padding: 2,
                }}
              >
                <CardContent>
                  <PollIcon
                    sx={{
                      fontSize: 50,
                      color: "#673ab7",
                      marginBottom: 1,
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Active Surveys
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {surveyCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
};

export default Admin;
