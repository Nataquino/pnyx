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
  List,
  ListItem,
  ListItemText,
  Paper,
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

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(
        "http://localhost/survey-app/get-declined-surveys.php"
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

  return (
    <Paper sx={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <AdminMain />

        <Container
          sx={{
            marginTop: { xs: 10, md: -30 },
            marginBottom: 5,
            flexGrow: 1,
            marginLeft: { xs: 1, sm: 4, md: 33 },
            overflowX: "hidden", // Prevent horizontal overflow
            maxWidth: "100%", // Ensure the container width doesn't exceed the screen
            paddingX: { xs: 2, sm: 3, md: 4 }, // Add padding for different screen sizes
            border: "5px solid rgba(0, 0, 0, 0.1)", // Very light border
            borderRadius: 2, // Slightly rounded corners for a soft look
            height: "80vh"
          }}
        >
          <Grid container spacing={2}>
            {surveys.map((survey) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={survey.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                  width: "100%",
                }}
              >
              <Card
                sx={{
                  marginTop: 2,
                  width: "100%", // Make sure the card takes up 100% of its grid item
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 5,
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "#e1f5fe", // Light blue background for approved status
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
                >
                  <CardContent
                    sx={{
                      padding: 2,
                      backgroundColor: "#1976d2",
                      color: "white",
                      textAlign: "center",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {survey.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: 1 }}
                    >
                      {survey.description}
                    </Typography>
                  </CardContent>

                  {/* Survey Status */}
                  <Box
                    sx={{
                      backgroundColor: "red",
                      paddingY: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <Typography variant="body2">DECLINED</Typography>
                  </Box>

                  <Box
                    sx={{
                      marginTop: "auto",
                      paddingBottom: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleView(survey)}
                      sx={{
                        borderRadius: 20,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        paddingX: 3,
                        backgroundColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Decline Dialog */}
        <Dialog
          open={openDeclineDialog}
          onClose={() => setOpenDeclineDialog(false)}
        >
          <DialogTitle>Decline Survey</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Reason for declining the survey.
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
          <Dialog open={openSurveyDialog} onClose={handleCloseSurveyDialog}>
            <DialogTitle>{survey.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{survey.description}</DialogContentText>
              <List>
                {survey.questions.map((question) => (
                  <ListItem key={question.id}>
                    <ListItemText primary={question.question_text} />
                    {question.options.length > 0 && (
                      <List>
                        {question.options.map((option) => (
                          <ListItem key={option.id}>
                            <ListItemText primary={option.option_text} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSurveyDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
    </Paper>
  );
};

export default Admin;
