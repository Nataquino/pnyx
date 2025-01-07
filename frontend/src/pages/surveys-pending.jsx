import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Container,
} from "@mui/material";
import axios from "axios";
import AdminMain from "../components/AdminMain";

const Admin = () => {
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [comment, setComment] = useState("");
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false);
  const [openPointsDialog, setOpenPointsDialog] = useState(false); // State for points dialog
  const [points, setPoints] = useState(0); // State for points entered

  const handleAssignPoints = (survey) => {
    setSelectedSurvey(survey); // Store selected survey for later use
    setOpenPointsDialog(true); // Open the dialog
  };

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(
        "http://localhost/survey-app/get-pending.php"
      );
      if (Array.isArray(response.data)) {
        setSurveys(response.data);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleApprove = async (survey) => {
    try {
      const response = await axios.post(
        "http://localhost/survey-app/survey-pending.php",
        {
          id: survey.id,
          action: "approve",
        }
      );
      fetchSurveys();
    } catch (error) {
      console.error("Error approving survey:", error);
    }
  };

  const handleDecline = (survey) => {
    setSelectedSurvey(survey);
    setOpenDeclineDialog(true);
  };

  const handleView = async (survey) => {
    try {
      const response = await axios.get(
        `http://localhost/survey-app/take-survey.php?id=${survey.id}`
      );
      setSurvey(response.data);
      setOpenSurveyDialog(true);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const handleDeclineConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost/survey-app/survey-pending.php",
        {
          id: selectedSurvey.id,
          action: "decline",
          comment: comment,
        }
      );
      setOpenDeclineDialog(false);
      setComment("");
      fetchSurveys();
    } catch (error) {
      console.error("Error declining survey:", error);
    }
  };

  const handleCloseSurveyDialog = () => {
    setOpenSurveyDialog(false);
    setSurvey(null);
  };

  const handleAssignPointsConfirm = async () => {
    try {
      // Make the API call to assign points (using get-pending.php for the POST request)
      const response = await axios.post(
        "http://localhost/survey-app/get-pending.php",
        {
          surveyId: selectedSurvey.id,
          points: points,
        }
      );
      console.log(
        `Assigned ${points} points to survey: ${selectedSurvey.title}`
      );
      setOpenPointsDialog(false); // Close the dialog after submitting
      setPoints(0); // Reset points input
      fetchSurveys(); // Refresh surveys after assigning points
    } catch (error) {
      console.error("Error assigning points:", error);
    }
  };

  return (
    <Stack sx={{ height: "100vh", backgroundColor: "skyblue" }}>
      <AdminMain />
      <Container
  sx={{
    marginTop: { xs: 12, md: -28 },
    marginLeft: { md: 33 },
    paddingLeft: { xs: 2, sm: 3, md: 5 },
    paddingRight: { xs: 2, sm: 3, md: 5 },
    paddingBottom: 4,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
    maxHeight: "80vh",
    width: "100%", // Adjust to fit smaller screens
    height: "100vh",
    overflowY: "auto",
    border: "5px solid rgba(0, 0, 0, 0.1)", // Very light border
  }}
>
  {surveys.length === 0 ? (
    // If no surveys are pending, display a message
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        textAlign: "center",
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        padding: { xs: 2, sm: 3 }, // Adjust padding for smaller screens
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "gray",
          fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" }, // Adjust font size
        }}
      >
        No pending surveys
      </Typography>
    </Box>
  ) : (
    // Render surveys if they exist
    <Grid container spacing={3} justifyContent="flex-start">
      {surveys.map((survey) => (
        <Grid item xs={12} sm={9} md={4.5} key={survey.id}>
          <Card
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              borderRadius: 3,
              boxShadow: 5,
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #00bcd4, #3f51b5)",
                color: "white",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 1,
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, // Responsive title font size
                }}
              >
                {survey.title}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                {survey.description}
              </Typography>
            </Box>
            <CardContent sx={{ flexGrow: 1, padding: { xs: 2, sm: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                View and manage the survey.
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                padding: { xs: 1.5, sm: 2 },
                justifyContent: "space-between",
                backgroundColor: "#f9f9f9",
                borderTop: "1px solid #ddd",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleView(survey)}
                sx={{
                  borderRadius: 20,
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  paddingX: 2,
                  marginBottom: 1,
                }}
              >
                View
              </Button>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleApprove(survey)}
                  sx={{
                    borderRadius: 20,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingX: 2,
                    marginBottom: 1,
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDecline(survey)}
                  sx={{
                    borderRadius: 20,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingX: 2,
                    marginBottom: 1,
                  }}
                >
                  Decline
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleAssignPoints(survey)}
                  sx={{
                    borderRadius: 20,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    paddingX: 2,
                    marginBottom: 1,
                  }}
                >
                  Assign Points
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
</Container>


      {/* Decline Survey Dialog */}
      <Dialog
        open={openDeclineDialog}
        onClose={() => setOpenDeclineDialog(false)}
      >
        <DialogTitle>Decline Survey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide a reason for declining the survey:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeclineDialog(false)}>Cancel</Button>
          <Button onClick={handleDeclineConfirm}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Survey Details Dialog */}
      {survey && (
        <Dialog
          open={openSurveyDialog}
          onClose={handleCloseSurveyDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}
          >
            {survey.title}
          </DialogTitle>

          <DialogContent sx={{ padding: 3 }}>
            <DialogContentText
              sx={{ marginBottom: 2, fontSize: "1.1rem", textAlign: "center" }}
            >
              {survey.description}
            </DialogContentText>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      QUESTION/S
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      OPTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {survey.questions.map((question) => (
                    <tr
                      key={question.id}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td style={{ padding: "10px", verticalAlign: "top" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {question.question_text}
                        </Typography>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {question.options.length > 0 ? (
                            question.options.map((option) => (
                              <Box
                                key={option.id}
                                sx={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  marginBottom: "5px",
                                  borderRadius: "4px",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "0.9rem",
                                    textAlign: "center",
                                  }}
                                >
                                  {option.option_text}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2">
                              No options available.
                            </Typography>
                          )}
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
            <Button
              variant="contained"
              onClick={handleCloseSurveyDialog}
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Assign Points Dialog */}
      <Dialog open={openPointsDialog} onClose={() => setOpenPointsDialog(false)}>
        <DialogTitle>Assign Points</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter points to assign to this survey:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Points"
            type="number"
            fullWidth
            variant="standard"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPointsDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignPointsConfirm}>Assign</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Admin;
