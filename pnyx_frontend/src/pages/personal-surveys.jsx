import { Stack, Box, Button } from "@mui/material";
import BasicCard from "../components/BasicCard";
import NavBar from "../components/NavBar";
import { useContext, useState } from "react";


const OwnSurvey = () => {

    const cards = [

    ]

    useContext(() => {
        //put setCards
    }, [cards])//translate into setstate Card

    return (

        <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
            <NavBar />
        </Stack>
    );
};

export default OwnSurvey;