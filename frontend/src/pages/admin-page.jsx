import { Stack, Box, Typography } from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [userCount, setUserCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  const [setUsers] = useState([]);
  const [setSurveys] = useState([]);
  const [error, setError] = useState(""); // Added state for error messages

  useEffect(() => {
    axios
      .get("http://localhost/survey-app/admin-stats.php")
      .then((res) => {
        if (res.data && res.data.users && res.data.surveys) {
          // Check if the response is structured correctly
          setUsers(res.data.users);
          setSurveys(res.data.surveys);
          setUserCount(res.data.users.length);
          setSurveyCount(res.data.surveys.length);
        } else {
          setError("Unexpected data structure received.");
          console.log(res.data);
        }
      })
      .catch((error) => {
        setError("There was an error fetching the admin stats!"); // Set error message for user
        console.error("There was an error fetching the admin stats!", error);
      });
  },);

  return (
    <Stack sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <Box>
        <AdminMain />
        <Stack
          sx={{ backgroundColor: "lightgray", height: "100vh", padding: 4 , display: "flex", justifyContent: "center",}}
        >
          <Box sx={{ marginTop: 5, marginBottom: 5, marginLeft: 91,  }}>
            <Typography variant="h4">Admin Dashboard</Typography>
          </Box>
          {error && ( // Display error message if there is an error
            <Box
              sx={{
                padding: 2,
                backgroundColor: "red",
                color: "white",
                borderRadius: 2,
                marginBottom: 4,
                width: "50vw",
                marginLeft: 59, 
                textAlign: "center"
                
              }}
            >
              <Typography variant="h6">{error}</Typography>
            </Box>
          )}
          <Box
            sx={{ display: "flex", justifyContent: "center", marginLeft: 30 }}
          >
            <Box
              sx={{
                textAlign: "center",
                width: "20vw",
                margin: 10,
                padding: 10,
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4">{userCount}</Typography>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                width: "20vw",
                margin: 10,
                padding: 10,
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Surveys</Typography>
              <Typography variant="h4">{surveyCount}</Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Admin;
