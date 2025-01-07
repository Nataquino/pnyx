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
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import NavBar from "../components/NavBar";

const RedeemPage = () => {
  const [points, setPoints] = useState();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState(""); // New state to store the voucher code

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/survey-app/get-rewards.php",
          { withCredentials: true }
        );

        if (response.data && response.data.rewards) {
          setRewards(response.data.rewards);
        } else {
          setRewards([]);
        }

        setPoints(response.data.reward_points || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedeem = async (pointsRequired) => {
    if (points < pointsRequired) {
      alert("You don't have enough points to redeem this reward!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/survey-app/get-rewards.php", // URL to backend for redemption
        { points: pointsRequired }, // Points required for redemption
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setPoints(response.data.new_points); // Update the points state after redemption
        setVoucherCode(response.data.voucher_code); // Set the voucher code returned by the backend
        setIsDialogOpen(true); // Open the success dialog
      } else {
        alert(response.data.message || "Error during redemption.");
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("There was an error redeeming the reward. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Paper sx={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <NavBar />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        gap={5}
        sx={{
          marginLeft: { md: 3 },
          marginTop: { xs: 2, md: 10 },
          px: { xs: 2, md: 7 },
        }}
      >
        {/* Points Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: { xs: "100%", md: "30%" },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              padding: 3,
              backgroundColor: "white",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                width: { xs: "50%", sm: "60%" },
                aspectRatio: "1",
                backgroundColor: "#05B1BF",
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                color="white"
              >
                {points}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ marginTop: 2, fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Account Points
            </Typography>
          </Box>
        </Box>

        {/* Rewards Section */}
        <Box
          sx={{
            width: { xs: "100%", md: "63%" },
            backgroundColor: "white",
            borderRadius: 2,
            padding: 2,
            overflowY: "auto",
            maxHeight: "44vh",
            margin: 5,
          }}
        >
          <Grid container spacing={2}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  minHeight: "40vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : rewards.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "44vh",
                  width: "60vw",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "20px" }}>No rewards available</Typography>
              </Box>
            ) : (
              rewards.map((reward, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card
                    sx={{
                      backgroundColor: "#EBEBF0",
                      width: "90%",
                      height: "auto",
                      padding: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", md: "1.3rem" } }}
                    >
                      {reward.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: 1,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        textAlign: "center",
                      }}
                    >
                      {reward.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: 1,
                        fontSize: { xs: "0.7rem", md: "0.8rem" },
                      }}
                    >
                      Points Required: {reward.points_required}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        fontSize: { xs: "0.7rem", md: "0.9rem" },
                        width: "70%",
                      }}
                      onClick={() => handleRedeem(reward.points_required)} // Pass points required
                    >
                      Redeem
                    </Button>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Stack>

      {/* Success Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: "30vw", // Set width to 30% of the viewport width
            height: "30vh", // Set height to 30% of the viewport height
            padding: 2, // Optional: Add padding inside the dialog
            position: "relative", // Ensure the X button stays in position
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Centered Message */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center", // Center-align text
          }}
        >
          <Typography variant="h6">
            You successfully redeemed your reward!
          </Typography>
          {voucherCode && (
            <Typography
              variant="body1"
              sx={{ marginTop: 2, fontWeight: "bold" }}
            >
              Your Voucher Code: {voucherCode}
            </Typography> 
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default RedeemPage;
