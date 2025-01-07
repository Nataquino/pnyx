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
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RedeemIcon from "@mui/icons-material/Redeem";
import axios from "axios";
import NavBar from "../components/NavBar";

const RedeemPage = () => {
  const [points, setPoints] = useState();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");

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
        "http://localhost/survey-app/get-rewards.php",
        { points: pointsRequired },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setPoints(response.data.new_points);
        setVoucherCode(response.data.voucher_code);
        setIsDialogOpen(true);
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
    <Paper sx={{ backgroundColor: "#87CEEB", minHeight: "100vh" }}> {/* Skyblue Background */}
      <NavBar />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
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
              background: "linear-gradient(45deg, #60a3d9, #ffffff)", // Soft gradient background
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 3, // Add shadow for depth
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                width: { xs: "50%", sm: "60%" },
                aspectRatio: "1",
                backgroundColor: "#fff",
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                color="primary"
              >
                {points}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                marginTop: 2,
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 600,
                color: "#333", // Darker text for contrast
              }}
            >
              Account Points
            </Typography>
          </Box>
        </Box>

        {/* Rewards Section */}
        <Box
          sx={{
            width: { xs: "100%", md: "63%" },
            backgroundColor: "#fff",
            borderRadius: 3,
            padding: 2,
            overflowY: "auto",
            maxHeight: "44vh",
            boxShadow: 2,
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
                <CircularProgress color="secondary" />
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
                <Typography sx={{ fontSize: "20px", color: "#333" }}>
                  No rewards available
                </Typography>
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
                      backgroundColor: "#f8f8f8", // Light background for cards
                      width: "90%",
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: 3,
                      transition: "transform 0.3s ease-in-out",
                      borderRadius: 3,
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#60a3d9", // Match skyblue gradient
                        marginBottom: 1,
                      }}
                    >
                      <RedeemIcon sx={{ fontSize: "2rem", color: "#fff" }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.3rem" },
                        fontWeight: 500,
                        textAlign: "center",
                        color: "#333",
                      }}
                    >
                      {reward.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: 1,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        textAlign: "center",
                        color: "#555",
                      }}
                    >
                      {reward.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: 1,
                        fontSize: { xs: "0.7rem", md: "0.8rem" },
                        color: "#888",
                      }}
                    >
                      Points Required: {reward.points_required}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: 2,
                        fontSize: { xs: "0.7rem", md: "0.9rem" },
                        width: "70%",
                        borderRadius: 5,
                        padding: "10px",
                      }}
                      startIcon={<RedeemIcon />}
                      onClick={() => handleRedeem(reward.points_required)}
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
            width: "30vw",
            height: "30vh",
            padding: 2,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            backgroundColor: "#F9F9F9",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#333",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
            You successfully redeemed your reward!
          </Typography>
          {voucherCode && (
            <Typography
              variant="body1"
              sx={{
                marginTop: 2,
                fontWeight: "bold",
                color: "#60a3d9", // Skyblue color for the voucher code
                fontSize: "1rem",
              }}
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
