import { Stack, Box, Card, Typography, Button, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const RedeemPage = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);  // Ensure this is always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-rewards.php", { withCredentials: true });
        console.log("Full response:", response.data);  // Log the entire response
        if (response.data && response.data.rewards) {
          setRewards(response.data.rewards);
        } else {
          setRewards([]);
        }
        setPoints(response.data.reward_points || 0); // Fallback to 0 if reward points are missing
      } catch (error) {
        console.error("Error fetching data:", error);
        setRewards([]); // Ensure rewards is always defined
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <Paper sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Stack direction="row" sx={{ marginTop: -10 }}>
        <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 7 }}>
          <Box
            sx={{
              marginTop: 15,
              width: "30vw",
              height: "50vh",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                borderRadius: 50,
                marginTop: -2,
                width: "15vw",
                height: "30vh",
                backgroundColor: "#05B1BF",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "50px", color: "white" }}>
                {points}
              </Typography>
            </Box>
            <Box sx={{ marginTop: 5 }}>
              <Typography sx={{ fontSize: "30px" }}>Account Points</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: 3,
              backgroundColor: "white",
              width: "30vw",
              height: "20vh",
            }}
          >
            Account Points: {points}
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: 15,
            marginLeft: 3,
            backgroundColor: "white",
            width: "63vw",
            height: "73.4vh",
            overflowY: "auto",
          }}
        >
          <Box sx={{ marginLeft: 1, marginTop: 2, padding: "auto", marginBottom: 2 }}>
            <Grid container spacing={4}>
              {/* Check if rewards are loaded and if they're available */}
              {loading ? (
                <Typography>Loading...</Typography>
              ) : rewards.length === 0 ? (
                <Typography>No rewards available</Typography>
              ) : (
                rewards.map((reward, index) => (
                  <Grid item xs={4} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "#EBEBF0",
                        height: "30vh",
                        width: "19vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography sx={{ fontSize: "30px" }}>
                        {reward.name}
                      </Typography>
                      <Typography sx={{ fontSize: "20px", marginTop: 2 }}>
                        {reward.description}
                      </Typography>
                      <Typography sx={{ fontSize: "15px", marginTop: 2 }}>
                        Points Required: {reward.points_required}
                      </Typography>
                      <Box sx={{ marginTop: 5 }}>
                        <Button variant="contained">Redeem</Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

export default RedeemPage;
