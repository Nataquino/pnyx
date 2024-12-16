import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack, Alert, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import AdminMain from "../components/AdminMain";

const RewardsAdmin = () => {
    const [rewardName, setRewardName] = useState("");
    const [rewardDescription, setRewardDescription] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [pointsRequired, setPointsRequired] = useState("");
    const [stock, setStock] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("active");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rewardName || !rewardDescription || !pointsRequired || !stock || !expiryDate) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost/survey-app/add-reward.php", {
                name: rewardName,
                description: rewardDescription,
                voucher_code: voucherCode,
                points_required: pointsRequired,
                stock: stock,
                expiry_date: expiryDate,
                status: status,
            });
            if (response.status === 200) {
                setSuccessMessage("Reward added successfully!");
                setRewardName("");
                setRewardDescription("");
                setVoucherCode("");
                setPointsRequired("");
                setStock("");
                setExpiryDate("");
                setStatus("active");
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Error adding reward:", error);
            setErrorMessage("Failed to add the reward. Please try again.");
        }
    };

    return (
        <Stack>
            <AdminMain />
            <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
                <Typography variant="h4" gutterBottom>
                    Add Reward
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
                        label="Voucher Code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        margin="normal"
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
                    <TextField
                        fullWidth
                        label="Expiry Date"
                        type="datetime-local"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        margin="normal"
                        required
                    />
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
                        Add Reward
                    </Button>
                </form>
            </Box>
        </Stack>
    );
};

export default RewardsAdmin;
