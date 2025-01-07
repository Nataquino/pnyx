import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import AdminMain from "../components/AdminMain";

const RewardsAdmin = () => {
  const [rewardName, setRewardName] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("active");
  const [rewards, setRewards] = useState([]);
  const [editingReward, setEditingReward] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch rewards from the server
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-reward.php");
        if (response.status === 200) {
          setRewards(response.data);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
        setErrorMessage("Failed to load rewards.");
      }
    };
    fetchRewards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !rewardName ||
      !rewardDescription ||
      !pointsRequired ||
      !stock ||
      !expiryDate
    ) {
      setErrorMessage("All fields are required!");
      return;
    }

    try {
      const url = editingReward
        ? "http://localhost/survey-app/update-reward.php"
        : "http://localhost/survey-app/add-reward.php";

      const payload = {
        id: editingReward?.id || null,
        name: rewardName,
        description: rewardDescription,
        points_required: pointsRequired,
        stock: stock,
        expiry_date: expiryDate,
        status: status,
      };

      const response = await axios.post(url, payload);
      if (response.status === 200) {
        setSuccessMessage(editingReward ? "Reward updated successfully!" : "Reward added successfully!");
        setRewardName("");
        setRewardDescription("");
        setPointsRequired("");
        setStock("");
        setExpiryDate("");
        setStatus("active");
        setEditingReward(null);
        setErrorMessage("");
        setRewards((prev) => (editingReward ? prev.map((r) => (r.id === payload.id ? payload : r)) : [...prev, payload]));
      }
    } catch (error) {
      console.error("Error adding/updating reward:", error);
      setErrorMessage("Failed to save the reward. Please try again.");
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setRewardName(reward.name);
    setRewardDescription(reward.description);
    setPointsRequired(reward.points_required);
    setStock(reward.stock);
    setExpiryDate(reward.expiry_date);
    setStatus(reward.status);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post("http://localhost/survey-app/delete-reward.php", { id });
      setRewards((prev) => prev.filter((reward) => reward.id !== id));
      setSuccessMessage("Reward deleted successfully!");
    } catch (error) {
      console.error("Error deleting reward:", error);
      setErrorMessage("Failed to delete reward.");
    }
  };

  return (
    <Stack>
      <AdminMain />

      <Box sx={{ p: 3, maxWidth: 600, mx: "auto", marginTop: {xs: 12, md: -30} }}>
        <Typography variant="h4" gutterBottom>
          {editingReward ? "Edit Reward" : "Add Reward"}
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Reward Name"
            value={rewardName}
            onChange={(e) => setRewardName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={rewardDescription}
            onChange={(e) => setRewardDescription(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Points Required"
            type="number"
            value={pointsRequired}
            onChange={(e) => setPointsRequired(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          <Box sx={{ marginTop: 3 }}>
            <Typography>Expiration Date</Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              margin="normal"
              required
            />
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {editingReward ? "Update Reward" : "Add Reward"}
          </Button>
        </form>
      </Box>

      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Rewards List
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>{reward.name}</TableCell>
                  <TableCell>{reward.description}</TableCell>
                  <TableCell>{reward.points_required}</TableCell>
                  <TableCell>{reward.stock}</TableCell>
                  <TableCell>{reward.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(reward)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(reward.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

export default RewardsAdmin;
