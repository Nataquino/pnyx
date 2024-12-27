import {
  Stack,
  Box,
  Paper,
  Container,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Account = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [error, setError] = useState(false); // Error state if fetching fails
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("This is an editable paragraph.");
  const [editedText, setEditedText] = useState(text);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        // Send the updated bio to the backend
        const response = await axios.post(
          "http://localhost/survey-app/update-userprofile.php", // Backend endpoint to update bio
          { bio: editedText }, // Send the new bio value
          { withCredentials: true }
        );
  
        if (response.data.success) {
          // Successfully updated the bio in the database
          console.log("Bio updated successfully!");
  
          // Optionally, fetch the updated user data to ensure the display is up-to-date
          const updatedResponse = await axios.get(
            "http://localhost/survey-app/get-userprofile.php", // Backend endpoint to get updated user info
            { withCredentials: true }
          );
  
          if (updatedResponse.data.user) {
            setText(updatedResponse.data.user.bio); // Update the bio in frontend
            setEditedText(updatedResponse.data.user.bio); // Sync editedText with updated bio
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
      // When switching to editing mode, initialize editedText with current bio value
      setEditedText(text); // Ensure the current bio is shown in the TextField when editing
    }
  
    setIsEditing(!isEditing); // Toggle editing state
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

        if (response.data && response.data.user) {
          setUserData(response.data.user);
          setText(response.data.user.bio || ""); // Set bio for non-editable state
          setEditedText(response.data.user.bio || ""); // Set bio for editing
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      }
    };

    fetchUserData();
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
              <Container
                sx={{
                  marginTop: 5,
                  backgroundColor: "gray",
                  width: "15vw",
                  height: "25vh",
                }}
              ></Container>{" "}
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
                    height: "15vh",
                    width: "20vw",
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
                <Box sx={{ marginTop: 2, marginLeft: 5 }}>
                  <Typography>Interest</Typography>
                </Box>

                <Container
                  sx={{
                    backgroundColor: "floralwhite",
                    border: 2,
                    borderBlockStyle: "solid",
                    height: "15vh",
                    width: "20vw",
                  }}
                >
                  <Typography>{userData.interests}</Typography>{" "}
                  {/* Assuming interests are in user data */}
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
          <Box sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}>
            voucher here
          </Box>
          <Box sx={{ height: "6vh" }}></Box>
          <Box sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}>
            Answered surveys here. Or you can decide if what do you want to put
            in here
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Account;
