import React, { useState } from "react";
import { Button, Avatar, Input, Container, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AvatarPic = () => {
  const [image, setImage] = useState(null); // Stores selected image preview URL
  const [file, setFile] = useState(null); // Stores the actual file
  const [imageSelected, setImageSelected] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImage(URL.createObjectURL(selectedFile)); // Preview the image
      setFile(selectedFile); // Store the file for upload
      setImageSelected(true);
      setSaveVisible(true);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file); // Append the image file
  
    try {
      const response = await fetch("http://localhost/path/to/get-userprofile.php", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Profile picture saved successfully!");
        console.log("Server Response:", result);
        setSaveVisible(false); // Hide the Save button
      } else {
        alert("Error saving profile picture: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <Container
      sx={{
        marginTop: 1,
        width: "25vw",
        height: "10vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        padding: 2,
        marginLeft: -7,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Profile Picture"
          src={image || "/default-profile-pic.png"}
          sx={{
            width: 170,
            height: 170,
          }}
        />
        <label htmlFor="profile-pic-upload">
          <Input
            accept="image/*"
            id="profile-pic-upload"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            component="span"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              "&:hover": {
                opacity: 1,
              },
              fontSize: "0.75rem",
              padding: "8px 16px",
            }}
          >
            Upload
          </Button>
        </label>
      </Box>
      {saveVisible && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "50px",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSave}
            sx={{
              fontSize: "0.7rem",
              padding: "6px 12px",
            }}
          >
            Save Picture
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AvatarPic;
