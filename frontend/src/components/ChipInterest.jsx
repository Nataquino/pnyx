import React, { useState } from "react";
import { Chip, TextField, Box, Button } from "@mui/material";

const ChipInterest = () => {
  const [interests, setInterests] = useState([
    "Gaming",
    "Sports",
    "Travel",
    "Coding",
    "Music",
    "Art",
  ]);
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

  return (
    <Box>
      {/* Render chips */}
      {interests.map((interest, index) => (
        <Chip
          key={index}
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
