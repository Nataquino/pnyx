import React, { useState } from 'react';
import { Button, Container, TextField, Typography, Stack, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleVerifyOtp = async () => {
        const userId = getCookieValue('user_id');
        if (!userId) {
            alert('User ID not found. Please log in or register.');
            return;
        }

        try {
            const response = await axios.post('http://localhost/survey-app/verify-email.php',
                { userId, otp },
                { withCredentials: true }
            );
            alert(response.data.message);
            if (response.data.message === 'Email verified successfully') {
                navigate('/interest');
            }
        } catch (error) {
            alert('OTP verification failed: ' + error.message);
        }
    };

    return (
        <Stack
            sx={{
                backgroundColor: "skyblue",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Box sx={{ position: "absolute", top: "20px", left: "20px" }}>
                <Button variant="outlined" onClick={() => navigate("/sign-up")}>
                    Back
                </Button>
            </Box>

            <Container
                sx={{
                    backgroundColor: "#FFF",
                    width: "40vw",
                    maxWidth: "400px",
                    height: "auto",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px"
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 500 }}>
                    Email Verification
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", marginBottom: 3, textAlign: "center" }}>
                    A One-Time Password (OTP) has been sent to your email. Please enter it below to verify your email.
                </Typography>
                
                <TextField
                    label="Enter OTP"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ marginBottom: 3 }}
                />
                
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleVerifyOtp}
                    sx={{
                        backgroundColor: "#0288D1",
                        color: "#FFF",
                        padding: "10px",
                        fontWeight: "bold",
                        ':hover': {
                            backgroundColor: "#0277BD"
                        }
                    }}
                >
                    Verify OTP
                </Button>
            </Container>
        </Stack>
    );
};

export default OtpVerificationPage;
