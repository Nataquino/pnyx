import {
    Stack,
    Box,
    Stepper,
    Step,
    StepLabel,
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    return(
    <Stack
        sx={{
        backgroundColor: "skyblue",
        height: "110vh",
        }}
    >
        <Typography sx={{ marginTop: "40px", fontSize: "30px" }}>Welcome Home :D</Typography>
    </Stack>
    );
}
export default HomePage;