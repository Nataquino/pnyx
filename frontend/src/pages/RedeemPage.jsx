import {
  Stack,
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { QRCodeCanvas } from "qrcode.react"; // Updated import

const RedeemPage = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]); // Ensure this is always an array
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false); // State to control the popup
  const [voucherCode, setVoucherCode] = useState(""); // State to store voucher code

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-rewards.php", {
          withCredentials: true,
        });
        console.log("Full response:", response.data); // Log the entire response

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

  const handleRedeem = async (rewardId, requiredPoints) => {
    if (points < requiredPoints) {
      alert("Insufficient points to redeem this reward.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/survey-app/redeem-reward.php",
        {
          reward_id: rewardId,
          points_spent: requiredPoints,
        },
        { withCredentials: true }
      );

      console.log("Redeem response:", response.data);

      if (response.data.success) {
        setVoucherCode(response.data.voucher_code); // Set the voucher code received from the server
        setPoints((prevPoints) => prevPoints - requiredPoints); // Update points locally
        setOpenPopup(true); // Open the popup with the QR code
      } else {
        alert(response.data.message || "Failed to redeem reward.");
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("An error occurred while redeeming the reward.");
    }
  };

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
              <Typography sx={{ fontSize: "50px", color: "white" }}>{points}</Typography>
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Account Points: {points}</Typography>
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
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : rewards.length === 0 ? (
                <Typography>No rewards available</Typography>
              ) : (
                rewards.map((reward, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "#EBEBF0",
                        height: "30vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography sx={{ fontSize: "30px" }}>{reward.name}</Typography>
                      <Typography sx={{ fontSize: "20px", marginTop: 2 }}>
                        {reward.description}
                      </Typography>
                      <Typography sx={{ fontSize: "15px", marginTop: 2 }}>
                        Points Required: {reward.points_required}
                      </Typography>
                      <Box sx={{ marginTop: 5 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleRedeem(reward.id, reward.points_required)}
                        >
                          Redeem
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Box>
      </Stack>

      {/* Pop-up for displaying QR code */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Redeem Successful</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Your Voucher Code:</Typography>
          <Typography sx={{ marginBottom: 2 }}>{voucherCode}</Typography>
          {voucherCode ? <QRCodeCanvas value={voucherCode} /> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RedeemPage;
