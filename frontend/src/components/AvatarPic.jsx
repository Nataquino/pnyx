import React from "react";
import { Avatar, Container, Box } from "@mui/material";

const AvatarPic = () => {
  return (
    <Container
      sx={{
        marginTop: 1,
        width: "25vw",
        height: "30vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        padding: 2,
        marginLeft: -7,
      }}
    >

      
      {/* Circle with name inside */}
      <Box
        sx={{
          width: 170,
          height: 2000,
          backgroundColor: "grey",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          marginTop: 2,
        }}
      >
        John Doe
      </Box>
    </Container>
  );
};

export default AvatarPic;
