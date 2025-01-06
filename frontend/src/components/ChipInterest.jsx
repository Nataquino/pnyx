import React, { useState,useEffect, } from "react";
import { Chip, TextField, Box, Button } from "@mui/material";

const ChipInterest = () => {
  // const [surveys, setSurveys] = useState([]);
  const [interests, setInterests] = useState([]);

  const [newInterest, setNewInterest] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const capitalizeInterest = (interest) => {
    return interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase();
  };

  const handleAddInterest = () => {
    if (newInterest.trim() !== "") {
      setInterests([...interests, capitalizeInterest(newInterest)]);
      setNewInterest("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewInterest(""); // Clear the input field
    setIsAdding(false); // Exit adding state
  };


  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-userprofile.php", { withCredentials: true });
        console.log(response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setInterests(response.data);
        }
      } catch (error) {
        console.error("Error fetching interest:", error);
      }
    };

    fetchInterest();
  }, []);

  return (
    <Box>
      {/* Render chips */}
      {interests.map((interest) => (
        <Chip
          key={interest.interest}
          label={capitalizeInterest(interest)} // Capitalize the first letter of each interest
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

      {/* Add new interest chip */}
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
