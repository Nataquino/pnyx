import React, { useState, useEffect } from "react"; // Import useEffect
import { Chip, TextField, Box, Button } from "@mui/material";
import axios from "axios"; // Import axios for making requests

const ChipInterest = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [interests, setInterests] = useState([]); // Local state for interests
  const [newInterest, setNewInterest] = useState(""); // New interest input value
  const [isAdding, setIsAdding] = useState(false); // State to toggle between adding and displaying interests
  const [error, setError] = useState(false); // State to track errors

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
          setInterests(preferences || []); // Set user preferences to interests state
          setError(false); // Clear error if successful
          console.log(response.data);
        } else {
          setError(true); // Set error if no data
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true); // Set error on failed request
      }
    };

    fetchUserData();
  }, []); // Run only once when the component mounts

  // Capitalize the first letter of the interest string
  const capitalizeInterest = (interest) => {
    return interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase();
  };

  // Handle adding new interest
  const handleAddInterest = () => {
    if (newInterest.trim() !== "") {
      const capitalizedInterest = capitalizeInterest(newInterest);
      setInterests([...interests, capitalizedInterest]); // Add to the list
      setNewInterest(""); // Clear input
      setIsAdding(false); // Exit adding mode
    }
  };

  // Handle canceling the addition of a new interest
  const handleCancel = () => {
    setNewInterest(""); // Clear the input field
    setIsAdding(false); // Exit adding state
  };

  return (
    <Box>
      {/* Render interests as Chips */}
      {interests.map((interest, index) => (
        <Chip
          key={index} // Use the index or a unique value as key
          label={interest}
          clickable
          color="primary"
          sx={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            height: "24px",
            margin: "2px",
          }}
        />
      ))}

      {/* Option to add new interest */}
      {isAdding ? (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            sx={{ marginRight: "8px" }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAddInterest}
            disabled={!newInterest.trim()}
            sx={{ marginRight: "4px" }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Chip
          label="Add Interest"
          clickable
          onClick={() => setIsAdding(true)}
          sx={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            height: "24px",
            margin: "2px",
            backgroundColor: "#f0f0f0",
            color: "#555",
          }}
        />
      )}
    </Box>
  );
};

export default ChipInterest;
