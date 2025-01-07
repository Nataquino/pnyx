import {
  Stack,
  Box,
  Paper,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CircularProgress
} from "@mui/material";

import { format } from "date-fns";
import Avatar from "../components/AvatarPic";
import ChipInterest from "../components/ChipInterest";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AvatarPic from "../components/AvatarPic";

const Account = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [error, setError] = useState(false); // Error state if fetching fails
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("This is an editable paragraph.");
  const [editedText, setEditedText] = useState(text);
  const [userInterest, setUserInterest] = useState(null);
  const [rewards, setRewards] = useState([]); // State for redeemed rewards
  const [loading, setLoading] = useState(true); // Loading state for rewards

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Send the updated bio to the backend
        const response = await axios.post(
          "http://localhost/survey-app/get-userprofile.php",
          { bio: editedText },
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Bio updated successfully!");

          // Fetch the updated user data
          const updatedResponse = await axios.get(
            "http://localhost/survey-app/get-userprofile.php",
            { withCredentials: true }
          );

          if (updatedResponse.data.user) {
            // Update bio state with the new bio after successful update
            setText(updatedResponse.data.user.bio);
            setEditedText(updatedResponse.data.user.bio);
          } else {
            console.error("Error fetching updated bio from the database");
          }
        } else {
          console.error("Error updating bio:", response.data.error);
        }
      } catch (err) {
        console.error("Error updating bio:", err);
      }
    } else {
      // Initialize editedText with current bio value when switching to edit mode
      setEditedText(text);
    }

    // Toggle editing state
    setIsEditing(!isEditing);
  };
  const handleTextChange = (e) => {
    setEditedText(e.target.value); // Update the editedText state with the new value
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/survey-app/get-userprofile.php", 
          { withCredentials: true }
        );

        if (response.data) {
          const { user, preferences } = response.data;
          setUserData(user);
          setUserInterest(preferences || []);
          setText(user.bio || ""); // Set the initial bio text here
          setEditedText(user.bio || ""); // Sync editedText with initial bio
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      }
    };
    const fetchRewards = async () => {
      try {
        const response = await axios.get(
          "http://localhost/survey-app/user-reward.php",
          { withCredentials: true }
        );
        if (response.data && response.data.rewards) {
          setRewards(response.data.rewards);
        }
      } catch (err) {
        console.error("Error fetching rewards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchRewards();
  }, []);

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
        {userData && (
          <>
            <Box
              sx={{
                marginLeft: 5,
                backgroundColor: "white",
                width: "25vw",
                height: "83vh",
              }}
            >
              <Container
                sx={{
                  marginTop: 1,
                  width: "20vw", // Adjusted width
                  height: "30vh", // Adjusted height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  padding: 2, // Added padding for better spacing
                }}
              >
                <AvatarPic />
              </Container>

              <Container>
                <Box sx={{ marginTop: 3, marginLeft: 5 }}>
                  <Typography>Bio</Typography>
                </Box>
                <Container
                  sx={{
                    marginBottom: 2,
                    backgroundColor: "floralwhite",
                    border: 2,
                    borderBlockStyle: "solid",
                    height: "15vh", // Fixed height for scrollability
                    width: "22vw",
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: -2.5,
                      maxHeight: "100px", // Limit the height for scrollable content
                      overflowY: "auto", // Enable vertical scrolling
                      overflowX: "hidden", // Prevent horizontal scrolling
                      padding: 1,
                      width: "18vw",
                    }}
                  >
                    {isEditing ? (
                      <Box
                        sx={{
                          marginTop: -1,
                          maxHeight: "12vh",
                          overflow: "hidden",
                        }}
                      >
                        <TextField
                          multiline
                          variant="outlined"
                          value={editedText} // Display the edited value
                          onChange={handleTextChange}
                          fullWidth
                          sx={{
                            marginLeft: -1.5,
                            height: "70%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "transparent", // Remove border
                              },
                              "&:hover fieldset": {
                                borderColor: "transparent", // Remove hover border
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "transparent", // Remove focus border
                              },
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-line", // Respect line breaks
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            fontSize: "19px",
                          }}
                        >
                          {text} {/* Display the bio */}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* <Typography>{userData.bio}</Typography> Assuming bio is in user data */}
                </Container>
                <Box
                  sx={{
                    marginTop: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color={isEditing ? "success" : "primary"}
                    sx={{ paddingLeft: "30px", paddingRight: "30px" }}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? "Save" : "Edit"}{" "}
                    {/* Toggle between Edit and Save */}
                  </Button>
                </Box>
                <Box sx={{ marginTop: 2, marginLeft: 5 }}>
                  <Typography>Interest</Typography>
                </Box>

                <Container
                  sx={{
                    backgroundColor: "white",
                    border: 2,
                    borderBlockStyle: "solid",
                    height: "15vh", // Fixed height for scrollability
                    width: "22vw", // Slightly wider container for better chip spacing
                    overflowY: "auto", // Enable vertical scrolling
                    overflowX: "hidden", // Prevent horizontal scrolling
                    display: "flex",
                    flexWrap: "wrap", // Allow chips to wrap
                    alignItems: "flex-start", // Align to top
                    justifyContent: "flex-start", // Align to the left
                    padding: "8px", // Padding for consistent spacing
                    gap: "8px", // Adjust space between chips
                  }}
                >
                  {/* <Typography>{userData.interests}</Typography>{" "} */}
                  <ChipInterest />
                  {/* Assuming interests are in user data */}
                </Container>
              </Container>
            </Box>
            <Stack
              sx={{
                marginLeft: 5,
                width: "65vw",
                height: "83vh",
                direction: "column",
              }}
            >
              <Box
                sx={{ backgroundColor: "white", width: "65vw", height: "55vh" }}
              >
                <Stack sx={{ margin: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 3,
                      gap: 1,
                    }}
                  >
                    <Typography>Name:</Typography>
                    <Typography>
                      {userData.firstname.charAt(0).toUpperCase() +
                        userData.firstname.slice(1)}{" "}
                      {userData.lastname.charAt(0).toUpperCase() +
                        userData.lastname.slice(1)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 3,
                      gap: 1,
                    }}
                  >
                    <Typography>Email:</Typography>
                    <Typography>{userData.email}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 3,
                      gap: 1,
                    }}
                  >
                    <Typography>Birthdate:</Typography>
                    <Typography>
                      {format(new Date(userData.birthdate), "dd/MM/yyyy")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 3,
                      gap: 1,
                    }}
                  >
                    <Typography>Gender: </Typography>
                    <Typography> {userData.gender} </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ height: "6vh" }}></Box>
              <Box
                sx={{ backgroundColor: "red", width: "65vw", height: "40vh" }}
              >
                <Box
                  sx={{
                    width: "65vw",
                    backgroundColor: "white",
                    borderRadius: 2,
                    padding: 2,
                    overflowY: "auto",
                    maxHeight: "44vh",
                    margin: 5,
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Redeemed Vouchers
                </Typography>
                <Grid container spacing={2}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "40vh" }}>
                      <CircularProgress />
                    </Box>
                  ) : rewards.length === 0 ? (
                    <Typography>No redeemed vouchers available.</Typography>
                  ) : (
                    rewards.map((reward, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ padding: 2, backgroundColor: "#EBEBF0" }}>
                          <Typography variant="h6">{reward.name}</Typography>
                          <Typography>{reward.description}</Typography>
                          <Typography>Voucher Code: {reward.voucher_code}</Typography>
                          <Typography>Expiry Date: {reward.expiry_date}</Typography>
                        </Card>
                      </Grid>
                      ))
                    )}
                  </Grid>
                </Box>

              </Box>
            </Stack>
          </>
        )}{" "}
        {error && (
          <Typography variant="h6" color="error" textAlign="center">
            Error fetching user data. Please try again.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default Account;
