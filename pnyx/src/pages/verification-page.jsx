import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
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
        const userId = getCookieValue('user_id');  // Retrieve user_id from cookie
        if (!userId) {
            alert('User ID not found. Please log in or register.');
            return;
        }

        // Log the userId and otp being sent
        console.log('Sending data:', { userId, otp });

        try {
            const response = await axios.post('http://localhost/survey-app/verify-email.php', 
                { userId, otp }, // Use camelCase for consistency
                { withCredentials: true }
            );
            alert(response.data.message);
            if (response.data.message === 'Email verified successfully') {
                navigate('/interest');  // Redirect to interest page after successful verification
            }
        } catch (error) {
            alert('OTP verification failed: ' + error.message);
        }
    };

    return (
        <Container sx={{ marginTop: 8 }}>
            <Typography variant="h4">Verify Your Email</Typography>
            <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ marginTop: 4 }}
            />
            <Button
                variant="contained"
                onClick={handleVerifyOtp}
                sx={{ marginTop: 4 }}
            >
                Verify OTP
            </Button>
        </Container>
    );
};

export default OtpVerificationPage;
