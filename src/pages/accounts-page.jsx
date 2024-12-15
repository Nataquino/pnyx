import { Stack, Box, Paper, Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Account = () => {
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
          <Container sx={{marginTop: 5  ,backgroundColor: "gray", width: "20vw", height: "30vh"}}>

          </Container>
          <Box sx={{marginTop: 3, marginLeft: 5}}><Typography>Bio</Typography></Box>
          <Container sx={{ marginBottom: 2, backgroundColor: "floralwhite", border: 2, borderBlockStyle: "solid", height: "15vh", width: "20vw"}}>

          </Container>
          <Box sx={{marginTop: 3, marginLeft: 5}}><Typography>Interest</Typography></Box>
          <Container sx={{  backgroundColor: "floralwhite", border: 2, borderBlockStyle: "solid", height: "15vh", width: "20vw"}}>

          </Container>

        </Box>
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
          ></Box>
          <Box sx={{ height: "6vh" }}></Box>

          <Box
            sx={{ backgroundColor: "white", width: "65vw", height: "40vh" }}
          ></Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Account;
