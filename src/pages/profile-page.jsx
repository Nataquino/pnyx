import { Stack, Box, Paper, Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Account = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [error, setError] = useState(false); // Error state if fetching fails

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your backend URL to fetch user data
        const response = await axios.get("http://localhost/survey-app/get-userprofile.php", { withCredentials: true });
        console.log(response.data)
        if (response.data) {
          setUserData(response.data); // Set user data in state
          setError(false); // Reset error state if successful
        } else {
          setError(true); // Handle empty or unexpected response
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      }
    };

    fetchUserData();
  }, []); // Empty array ensures this effect runs once after the initial render

  return (
    <Paper fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Stack
        sx={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
          marginTop: 5,
        }}
      >
        <Box
          sx={{
            marginLeft: 5,
            backgroundColor: "white",
            width: "25vw",
            height: "83vh",
          }}
        >
          {/* Display user info in left sidebar */}
          {userData && (
            <>
              <Container sx={{ marginTop: 5, backgroundColor: "gray", width: "20vw", height: "30vh" }}>
              </Container>
              <Box sx={{ marginTop: 3, marginLeft: 5 }}>
                <Typography>Bio</Typography>
              </Box>
              <Container sx={{ marginBottom: 2, backgroundColor: "floralwhite", border: 2, borderBlockStyle: "solid", height: "15vh", width: "20vw" }}>
                <Typography>{userData.bio}</Typography> {/* Assuming bio is in user data */}
              </Container>
              <Box sx={{ marginTop: 3, marginLeft: 5 }}>
                <Typography>Interest</Typography>
              </Box>
              <Container sx={{ backgroundColor: "floralwhite", border: 2, borderBlockStyle: "solid", height: "15vh", width: "20vw" }}>
                <Typography>{userData.interests}</Typography> {/* Assuming interests are in user data */}
              </Container>
            </>
          )}
          {error && (
            <Typography variant="h6" color="error" textAlign="center">
              Error fetching user data. Please try again.
            </Typography>
          )}
        </Box>

        {/* Main content area */}
        <Stack
          sx={{
            marginLeft: 5,
            width: "65vw",
            height: "83vh",
            direction: "column",
          }}
        >
          <Box sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}></Box>
          <Box sx={{ height: "6vh" }}></Box>
          <Box sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}></Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Account;
