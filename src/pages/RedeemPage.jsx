import { Stack, Box, Card, Typography, Button,Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const RedeemPage = () => {
  const [points, setPoints] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/reward.php", { withCredentials: true });
        const data = response.data;
        setPoints(data.reward_points); 
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <Paper>    
        <NavBar/>
    <Stack direction="row" sx={{ backgroundColor: "skyblue", height: "100vh" }}>

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
              100
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
        <Box sx={{ marginLeft: 1, marginTop: 2,           padding: "auto",
          marginBottom: 2 }}>
          <Grid container spacing={4} >
            
            <Grid item sx={4}>
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
                  Jollibee Voucher
                </Typography>
                <Box sx={{ marginTop: 5 }}>
                  <Button variant="contained">Redeem</Button>
                </Box>
              </Card>
            </Grid>
            <Grid item sx={4}>
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
                  Jollibee Voucher
                </Typography>
                <Box sx={{ marginTop: 5 }}>
                  <Button variant="contained">Redeem</Button>
                </Box>
              </Card>
            </Grid>
            <Grid item sx={4}>
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
                  Jollibee Voucher
                </Typography>
                <Box sx={{ marginTop: 5 }}>
                  <Button variant="contained">Redeem</Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Stack>
    </Paper>

  );
};

export default RedeemPage;