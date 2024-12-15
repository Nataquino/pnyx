import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Container,
  Typography,
  Box,
  Card,
  Stack,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Paper,
} from "@mui/material";
import NavBarResult from "../components/NavBarResult";

const SurveyResults = () => {
  const { id } = useParams(); // Get the survey ID from the URL
  const [results, setResults] = useState({
    paragraph_answers: [],
    multiple_choice_stats: {}, // Ensure this is an object
    feedback_sentiments: {},
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost/survey-app/survey-responses.php?id=${id}`
        );
        console.log(response.data); // Log the entire response data
        setResults(response.data || {}); // Handle empty responses
      } catch (error) {
        console.error("Error fetching survey results:", error);
      }
    };

    fetchResults();
  }, [id]);

  const {
    paragraph_answers,
    multiple_choice_stats = {},
    feedback_sentiments,
  } = results; // Default to an empty object

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <Stack>
      <NavBarResult />
      <Container
        maxWidth={false}
        sx={{
          py: 4,
          backgroundColor: "skyblue",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Stack></Stack>
        <Card
          sx={{
            padding: 3,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              paddingBottom: 2,
            }}
          >
            <Typography variant="h3" gutterBottom>
              Survey Results
            </Typography>
          </Container>

          {/* Paragraph Answers */}
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Box mb={4} sx={{ backgroundColor: "green", width: "40vw" }}>
              <Typography variant="h6">Paragraph Answers:</Typography>
              {paragraph_answers.length > 0 ? (
                paragraph_answers.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body1">
                      {item.question_text}
                    </Typography>
                    <Typography variant="body2">{item.answer}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">No paragraph answers.</Typography>
              )}
            </Box>

            {/* Multiple Choice Results - Aligned to the Right */}
            <Box
              mb={4}
              sx={{
                marginLeft: 5,
                backgroundColor: "red",
                width: "50vw",
                overflowX: "auto",
              }}
            >
              <Box flexGrow={1} maxWidth={600}>
                <Typography variant="h6">Multiple Choice Results:</Typography>
                {Object.keys(multiple_choice_stats).length > 0 ? (
                  Object.entries(multiple_choice_stats).map(
                    ([questionId, { question_text, options = {} }], index) => {
                      // Default options to an empty object
                      const choiceCounts = Object.entries(options).map(
                        ([choice, count]) => ({
                          name: choice,
                          value: count,
                        })
                      );

                      return (
                        <Box key={index} mb={4}>
                          <Typography variant="h6" gutterBottom>
                            {question_text}
                          </Typography>
                          {choiceCounts.length > 0 ? ( // Check if choiceCounts has data
                            <BarChart
                              width={500}
                              height={300}
                              data={choiceCounts}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="5 5" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8">
                                {choiceCounts.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          ) : (
                            <Typography variant="body2">
                              No options available for this question.
                            </Typography>
                          )}
                        </Box>
                      );
                    }
                  )
                ) : (
                  <Typography variant="body1">No Results Yet</Typography>
                )}
              </Box>
            </Box>
          </Stack>

          {/* Feedback Sentiments with Answers */}
          <Stack
            sx={{
              display: "flex",
              backgroundColor: "blue",
              flexDirection: "row",
            }}
          >
            <Paper
              sx={{
                display: "flex",
                justifyContent: "start",
                backgroundColor: "yellow",
                flexDirection: "column",
                width: "60vw",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "center ", margin: 2 }}
              >
                <Typography variant="h4">Feedback Sentiments</Typography>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Answers</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* <Box mb={4}>
              <Typography variant="h6">Feedback Sentiments:</Typography>
              {Object.keys(feedback_sentiments).length > 0 ? (
                Object.keys(feedback_sentiments).map((questionId) => {
                  const sentimentData = feedback_sentiments[questionId];
                  return (
                    <Box key={questionId} mb={2}>
                      <Typography variant="body1">
                        {sentimentData.question_text}:{" "}
                        {sentimentData.descriptive_sentiment} (Avg:{" "}
                        {sentimentData.average_sentiment
                          ? sentimentData.average_sentiment.toFixed(2)
                          : "N/A"}
                        )
                      </Typography>
                      <Typography variant="body2">
                        Feedback:{" "}
                        {sentimentData.feedback || "No feedback provided."}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body1">No feedback sentiments.</Typography>
              )}
            </Box> */}
            </Paper>
            <Paper sx={{ marginLeft: 4, width: "30vw" }}>
              <Box>
                <Typography sx={{ display: "flex", justifyContent: "center" }}>Overall Sentiment Result</Typography> 
              </Box>
              <Box>sdbhasb</Box>
            </Paper>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
};

export default SurveyResults;
