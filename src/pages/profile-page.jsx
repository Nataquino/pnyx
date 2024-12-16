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

  const handleEditToggle = () => {
    if (isEditing) {
      setText(editedText); // Save the changes
    }
    setIsEditing(!isEditing); // Toggle editing state
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your backend URL to fetch user data
        const response = await axios.get(
          "http://localhost/survey-app/get-userprofile.php",
          { withCredentials: true }
        );
        console.log(response.data);
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
              <Container
                sx={{
                  marginTop: 5,
                  backgroundColor: "gray",
                  width: "15vw",
                  height: "25vh",
                }}
              >
                </Container>{" "}
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
                      width:"18vw"
                    }}
                  >
                    {isEditing ? (
                      <Box
                        sx={{
                          marginTop: -1,
                          maxHeight: "12vh", // Limit the box height
                          overflow: "hidden", // Ensure the box does not scroll
                        }}
                      >
                        <TextField
                          multiline
                          variant="outlined"
                          value={editedText}
                          onChange={handleTextChange}
                          fullWidth // Ensures the TextField spans the full width of the Box
                          sx={{
                            marginLeft: -1.5,
                            height: "70%", // Makes the TextField take the full height of the Box
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "transparent", // Remove the blue border
                              },
                              "&:hover fieldset": {
                                borderColor: "transparent", // Ensure it's removed on hover as well
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "transparent", // Remove the border when focused
                              },
                            },
                          }}
                          inputProps={{
                            maxLength: 70, // Set maximum character limit
                          }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            marginTop:0.5,
                            whiteSpace: "pre-line", // Respect line breaks in the text
                            wordWrap: "break-word", // Wrap long words to prevent overflow
                            overflowWrap: "break-word", // Additional fallback for long unbroken strings
                            wordBreak: "break-word", // Ensure long words are broken properly
                            fontSize: "19px"
                          }}
                        >
                          {text}
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
                    {isEditing ? "Save" : "Edit"}
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
          <Box
            sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}
          >voucher here</Box>
          <Box sx={{ height: "6vh" }}></Box>
          <Box
            sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}
          >Answered surveys here. Or you can decide if what do you want to put in here</Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Account;
