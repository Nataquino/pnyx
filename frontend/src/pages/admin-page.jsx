import React, { useState, useEffect } from "react";
import { Stack, Box, Typography, Alert, CircularProgress } from "@mui/material";
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
          // Update counts based on response
          setUserCount(res.data.users.length);
          setSurveyCount(res.data.surveys.filter((survey) => survey.status === "active").length);
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
    <Stack sx={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <AdminMain />
      <Stack
        sx={{
          backgroundColor: "lightgray",
          minHeight: "100vh",
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
        </Box>
        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Alert severity="error" sx={{ width: "50%", textAlign: "center" }}>
            {error}
          </Alert>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* User Count */}
            <Box
              sx={{
                textAlign: "center",
                padding: 4,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 2,
                width: "20%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3" color="primary">
                {userCount}
              </Typography>
            </Box>

            {/* Active Surveys Count */}
            <Box
              sx={{
                textAlign: "center",
                padding: 4,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 2,
                width: "20%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Active Surveys
              </Typography>
              <Typography variant="h3" color="secondary">
                {surveyCount}
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Admin;
