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
} from "@mui/material";

import axios from "axios";
import AdminMain from "../components/AdminMain";

const Admin = () => {
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [comment, setComment] = useState("");
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false); // State for controlling the survey details dialog

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(
        "http://localhost/survey-app/get-declined-surveys.php"
      );
      console.log(response); // Log the entire response
      console.log(response.data); // Log the response data
      console.log(Array.isArray(response.data)); // Check if response.data is an array

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
      console.log(response.data);
      fetchSurveys();
      // Update state or provide feedback to the user
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
      console.log(response.data);
      setSurvey(response.data);
      setOpenSurveyDialog(true); // Open the survey details dialog
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
      console.log(response.data);
      setOpenDeclineDialog(false);
      setComment("");
      fetchSurveys();
      // Update state or provide feedback to the user
    } catch (error) {
      console.error("Error declining survey:", error);
    }
  };

  const handleCloseSurveyDialog = () => {
    setOpenSurveyDialog(false);
    setSurvey(null); // Clear survey details after closing the dialog
  };

  return (
    <Stack
    maxHeight={"100vh"}
      sx={{
        backgroundColor: "grey",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "110vh",
        paddingBottom: -8
      }}
    >
      <AdminMain />
      <Container sx={{ marginTop: 10, marginBottom: 5, flexGrow: 1, overflowY: "auto" , marginLeft: 35}}>
        <Grid container spacing={3}>
          {surveys.map((survey) => (
            <Grid item xs={12} sm={6} md={4} key={survey.id}>
              <Card
                sx={{
                  width: "100%",
                  height: "50vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {survey.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {survey.description}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleView(survey)}
                  >
                    View
                  </Button>
                </Box>
                <CardActions
                  sx={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    sx={{ color: "green" }}
                    size="small"
                    onClick={() => handleApprove(survey)}
                  >
                    Approve
                  </Button>
                  <Button
                    sx={{ color: "red" }}
                    size="small"
                    onClick={() => handleDecline(survey)}
                  >
                    Decline
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
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
    </Stack>
  );
};

export default Admin;
