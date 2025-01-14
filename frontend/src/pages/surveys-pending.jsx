import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";

import axios from "axios";
import AdminMain from "../components/AdminMain";

const Admin = () => {
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [openPointsDialog, setOpenPointsDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [points, setPoints] = useState();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      await axios.post("http://localhost/survey-app/survey-pending.php", {
        id: survey.id,
        action: "approve", // Action to approve the survey
      });
      fetchSurveys(); // Refresh the surveys list
    } catch (error) {
      console.error("Error approving survey:", error);
    }
  };

  const handleDecline = async (survey) => {
    setSurvey(survey);
    setOpenDeclineDialog(true);
  };

  const handleDeclineConfirm = async () => {
    try {
      await axios.post("http://localhost/survey-app/survey-pending.php", {
        id: survey.id,
        action: "decline",
        comment,
      });
      setOpenDeclineDialog(false);
      setComment("");
      fetchSurveys();
    } catch (error) {
      console.error("Error declining survey:", error);
    }
  };



  const handleAssignPoints = (survey) => {
    setSurvey(survey);
    setOpenPointsDialog(true);
  };

  const handleAssignPointsConfirm = async () => {
    try {
      // Assign points first
      await axios.post("http://localhost/survey-app/get-pending.php", {
        surveyId: survey.id,
        points,
      });
  
      // Approve the survey and insert notification in the backend
      await axios.post("http://localhost/survey-app/survey-pending.php", {
        id: survey.id,
        action: "approve", // Approve the survey
      });
  
      setOpenPointsDialog(false);
      setPoints(0);
      fetchSurveys(); // Refresh the surveys after action
    } catch (error) {
      console.error("Error assigning points and approving survey:", error);
    }
  };
  

  const handleView = async (survey) => {
    try {
      const response = await axios.get(
        `http://localhost/survey-app/take-survey.php?id=${survey.id}`
      );
      setSurvey(response.data);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSurveyDialog = () => {
    setSurvey(null);
  };

  return (
    <Stack sx={{ height: "100vh", backgroundColor: "skyblue" }}>
      <AdminMain />
      <Container
        sx={{ marginTop: { xs: 12, md: -30 }, marginLeft: { md: 33 } }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "80vh",
            minHeight: "70vh",
            boxShadow: 5,
            borderRadius: 3,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "20px", fontFamily: "fantasy" }}>
                  TITLE
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontFamily: "fantasy" }}>
                  DESCRIPTION
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((survey) => (
                  <TableRow key={survey.id} hover>
                    <TableCell sx={{ fontWeight: "bold", color: "#48494B" }}>
                      {survey.title}
                    </TableCell>
                    <TableCell>{survey.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleView(survey)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={surveys.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Container>

      {/* View Survey Dialog */}
      {survey && (
        <Dialog
          open={Boolean(survey)}
          onClose={handleCloseSurveyDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            {survey.title}
            <IconButton
              aria-label="close"
              onClick={handleCloseSurveyDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              X
            </IconButton>
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
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDecline(survey)}
            >
              Decline
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleAssignPoints(survey)}
            >
              Assign Points
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Decline Dialog */}
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeclineDialog(false)}>Cancel</Button>
          <Button onClick={handleDeclineConfirm}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Points Dialog */}
      <Dialog
        open={openPointsDialog}
        onClose={() => setOpenPointsDialog(false)}
      >
        <DialogTitle>Assign Points</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter points for this survey:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            type="number"
            fullWidth
            value={points}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value, 10));
              setPoints(value || 0);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPointsDialog(false)}>Cancel</Button>
<Button
  variant="contained"
  color="success"
  onClick={() => {
    handleAssignPointsConfirm(); // Assign points
    handleApprove(survey); // Approve survey
    setOpenPointsDialog(false); // Close Assign Points dialog
    setSurvey(null); // Close View Survey dialog
  }}
>
  Assign Points & Approve
</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Admin;