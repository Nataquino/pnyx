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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material"; 

import { format } from "date-fns";
import ChipInterest from "../components/ChipInterest";
import NavBar from "../components/NavBar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code"; // Import QRCode library

const Account = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [error, setError] = useState(false); // Error state if fetching fails
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState(text);
  const [userInterest, setUserInterest] = useState(null);
  const [rewards, setRewards] = useState([]); // State for redeemed rewards
  const [loading, setLoading] = useState(true); // Loading state for rewards
  const [open, setOpen] = useState(false); // Manage dialog state

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Update the bio in the database
        const response = await axios.post(
          "http://localhost/survey-app/get-userprofile.php",
          { bio: editedText },
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Bio updated successfully!");
        } else {
          console.error("Error updating bio:", response.data.error);
          // If the server responds with an error, revert the bio to the previous one
          setText(text);
        }
      } catch (err) {
        console.error("Error updating bio:", err);
        // If an error occurs, revert the bio to the previous one
        setText(text);
      }
    } else {
      // Initialize the editable bio text
      setEditedText(text);
    }

    // Toggle the editing mode
    setIsEditing(!isEditing);
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value); // Update the editedText state with the new value
    setText(e.target.value); // Update the displayed text in real-time as the user types
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
    <Paper
      fullWidth
      sx={{ backgroundColor: "skyblue", height: "100vh", overflowY: "auto" }}
    >
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
                marginBottom: 3,
                backgroundColor: "white",
                width: "25vw",
                height: "90vh",
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
                <Container
                  sx={{
                    marginTop: 1,
                    width: "25vw",
                    height: "30vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    padding: 2,
                    marginLeft: -7,
                  }}
                >
                  {/* Circle with name inside */}
                  <Box
                    sx={{
                      width: 170,
                      height: 2000,
                      backgroundColor: "grey",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "16px",
                      marginTop: 2,
                    }}
                  >
                    <Typography>{userData.username}</Typography>
                  </Box>
                </Container>
              </Container>

              <Container>
                <Box sx={{ marginTop: 3, marginLeft: 2 }}>
                  <Typography>Bio</Typography>
                </Box>
                <Container
                  sx={{
                    marginBottom: 2,
                    backgroundColor: "floralwhite", // Soft background for a clean look
                    border: 2,
                    borderColor: "#ddd", // Light gray border for subtle separation
                    borderRadius: 2, // Rounded corners for a modern touch
                    height: "auto", // Flexible height based on content
                    width: "22vw",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for depth
                    padding: 2,
                    position: "relative", // Make the container relative to position child elements absolutely
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: -2,
                      height: "10.5vh",
                      maxHeight: "11vh", // Limit the height for scrollability
                      overflowY: "auto", // Enable vertical scrolling
                      overflowX: "hidden", // Prevent horizontal scrolling
                      width: "100%",
                    }}
                  >
                    {isEditing ? (
                      <Box
                        sx={{
                          height: "10vh",
                          maxHeight: "11vh", // Limit height for text input
                          overflow: "hidden",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <TextField
                          multiline
                          variant="outlined"
                          value={editedText} // Display the edited value
                          onChange={handleTextChange} // Handle text change
                          fullWidth
                          inputProps={{ maxLength: 60 }} // Limit to 60 characters
                          sx={{
                            borderRadius: 1,
                            marginBottom: 1,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "transparent", // Remove default border
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
                        <Box
                          sx={{
                            position: "absolute", // Position character count relative to the container
                            bottom: "8px", // Distance from the bottom
                            right: "8px", // Distance from the right
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            zIndex: 1, // Ensure it's on top of other elements
                          }}
                        >
                          <Typography
                            variant="body2"
                            color={
                              editedText.length > 60 ? "error" : "textSecondary"
                            }
                            sx={{
                              visibility: isEditing ? "visible" : "hidden", // Ensure visibility only in editing mode
                            }}
                          >
                            {editedText.length} / 60
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-line", // Respect line breaks
                            wordWrap: "break-word",
                            fontSize: "16px", // Slightly smaller font size for better readability
                          }}
                        >
                          {text} {/* Display the bio */}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color={isEditing ? "success" : "primary"}
                      sx={{
                        paddingLeft: "30px",
                        paddingRight: "30px",
                        textTransform: "none", // Keep the text case consistent
                        "&:hover": {
                          transform: "scale(1.05)", // Slight scale effect on hover for interaction feedback
                        },
                      }}
                      onClick={handleEditToggle}
                    >
                      {isEditing ? "Save" : "Edit"}{" "}
                      {/* Toggle between Edit and Save */}
                    </Button>
                  </Box>
                </Container>

                <Box sx={{ marginTop: 2, marginLeft: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: 2 }}
                  >
                    Interests
                  </Typography>
                </Box>

                <Container
                  sx={{
                    backgroundColor: "#f5f5f5", // Light gray background for a modern look
                    border: "2px solid #ddd", // Subtle border for separation
                    borderRadius: 2, // Rounded corners
                    borderBlockStyle: "solid",
                    height: "13vh",
                    maxHeight: "13vh", // Fixed height for scrollability
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
                sx={{
                  backgroundColor: "white",
                  width: "65vw",
                  height: "55vh",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Stack sx={{ margin: 2, padding: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", marginBottom: 3 }}
                  >
                    User Information
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* Name Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 2,
                        alignItems: "center",
                        borderBottom: "1px solid #ddd",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: "500" }}>Name:</Typography>
                      <Typography sx={{ color: "gray", fontWeight: "400" }}>
                        {userData.firstname.charAt(0).toUpperCase() +
                          userData.firstname.slice(1)}{" "}
                        {userData.lastname.charAt(0).toUpperCase() +
                          userData.lastname.slice(1)}
                      </Typography>
                    </Box>

                    {/* Email Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 2,
                        alignItems: "center",
                        borderBottom: "1px solid #ddd",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: "500" }}>Email:</Typography>
                      <Typography sx={{ color: "gray", fontWeight: "400" }}>
                        {userData.email}
                      </Typography>
                    </Box>

                    {/* Birthdate Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 2,
                        alignItems: "center",
                        borderBottom: "1px solid #ddd",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: "500" }}>
                        Birthdate:
                      </Typography>
                      <Typography sx={{ color: "gray", fontWeight: "400" }}>
                        {format(new Date(userData.birthdate), "dd/MM/yyyy")}
                      </Typography>
                    </Box>

                    {/* Gender Section */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: 2,
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: "500" }}>
                        Gender:
                      </Typography>
                      <Typography sx={{ color: "gray", fontWeight: "400" }}>
                        {userData.gender}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  backgroundColor: "red",
                  width: "65vw",
                  maxHeight: "20vh",
                  position: "relative", // Position relative for internal elements
                  marginTop: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 3,
                    height: "26.5vh",
                    display: "flex",
                    flexDirection: "column", // Allow flexible layout
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ marginBottom: 3, fontWeight: "bold" }}
                  >
                    Redeemed Vouchers
                  </Typography>

                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress size={60} color="primary" />
                    </Box>
                  ) : rewards.length === 0 ? (
                    <Box sx={{ textAlign: "center", padding: 3 }}>
                      <Typography variant="h6" sx={{ color: "gray" }}>
                        You haven't redeemed any vouchers yet.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                      <Grid container spacing={3}>
                        {rewards.map((reward, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                              sx={{
                                backgroundColor: "#F9FAFB",
                                padding: 3,
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: "transform 0.3s ease",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "600",
                                  marginBottom: 1,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {reward.name}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: "0.95rem",
                                  color: "text.secondary",
                                  marginBottom: 2,
                                }}
                              >
                                {reward.description}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    marginRight: 1,
                                    color: "primary.main",
                                  }}
                                >
                                  Voucher Code:
                                </Typography>
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  <span style={{ fontWeight: "normal" }}>
                                    {reward.voucher_code}
                                  </span>
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    marginRight: 1,
                                    color: "text.secondary",
                                  }}
                                >
                                  Expiry Date:
                                </Typography>
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  {reward.expiry_date}
                                </Typography>
                              </Box>

                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingX: 3,
                                  paddingY: 1,
                                  borderRadius: 2,
                                  boxShadow: 2,
                                  fontSize: "0.875rem",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    boxShadow: 3,
                                    transform: "scale(1.05)",
                                  },
                                }}
                                onClick={handleClickOpen}
                              >
                                <Typography sx={{ marginRight: 1 }}>
                                  Use QR
                                </Typography>
                              </Button>

                              {/* Dialog for QR Code */}
                              <Dialog open={open} onClose={handleClose}>
                                <DialogActions>
                                  {/* Simple X button */}
                                  <Button
                                    sx={{
                                      position: "absolute",
                                      top: 10,
                                      right: 10,
                                      zIndex: 1,
                                      fontSize: "1.5rem",
                                      fontWeight: "bold",
                                      color: "text.primary",
                                    }}
                                    onClick={handleClose}
                                  >
                                    X
                                  </Button>
                                </DialogActions>
                                <DialogContent
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 3,
                                  }}
                                >
                                  {/* QR Code */}
                                  <QRCode
                                    value={reward.voucher_code}
                                    size={256}
                                  />

                                  {/* Voucher Code Text below QR */}
                                  <Box
                                    sx={{ marginTop: 2, textAlign: "center" }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        color: "text.primary",
                                        marginBottom: 1,
                                      }}
                                    >
                                      Voucher Code:
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "1.1rem",
                                        fontWeight: "600",
                                        color: "primary.main",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {reward.voucher_code}
                                    </Typography>
                                  </Box>
                                </DialogContent>
                              </Dialog>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
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
