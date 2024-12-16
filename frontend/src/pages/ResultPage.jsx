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
  Pie,
  PieChart,
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
  Paper,
} from "@mui/material";
import NavBarResult from "../components/NavBarResult";

const SurveyResults = () => {
  const { id } = useParams(); // Get the survey ID from the URL
  const [results, setResults] = useState({
    paragraph_answers: [],
    multiple_choice_stats: {},
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

  const { paragraph_answers, multiple_choice_stats, feedback_sentiments } =
    results;

  // Colors for bar and pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];
  const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };

  Object.keys(feedback_sentiments).forEach((questionId) => {
    const { feedback = [] } = feedback_sentiments[questionId];
    feedback.forEach(({ sentiment_score }) => {
      if (sentiment_score > 0) {
        sentimentCounts.Positive += 1;
      } else if (sentiment_score < 0) {
        sentimentCounts.Negative += 1;
      } else {
        sentimentCounts.Neutral += 1;
      }
    });
  });

  // Data for the pie chart
  const pieData = [
    { name: "Positive", value: sentimentCounts.Positive },
    { name: "Neutral", value: sentimentCounts.Neutral },
    { name: "Negative", value: sentimentCounts.Negative },
  ];

  // Colors for the pie chart
  const pieCOLORS = ["#4caf50", "#800080", "#f44336"]; // Green, Yellow, Red

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
        <Card
          sx={{
            padding: 3,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3" gutterBottom textAlign="center">
            Survey Results
          </Typography>

          {/* Paragraph Answers */}
          <Stack sx={{ display: "flex", flexDirection: "row", mt: 4 }}>
            <Box
              mb={4}
              sx={{
                backgroundColor: "lightgray",
                width: "40vw",
                maxHeight: "50vh",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "center ", margin: 1 }}
              >
                <Typography variant="h4">Paragraph Answers:</Typography>
              </Box>

              <Box sx={{ padding: 2, overflowX: "auto", maxHeight: "38vh"}}>
                {paragraph_answers.length > 0 ? (
                  paragraph_answers.map((item, index) => (
                    <Box key={index} mb={2}>
                      <Typography sx={{fontSize:"18px", fontWeight: "bold" }}>
                        {item.question_text}
                      </Typography>
                      <Typography sx={{fontStyle:"italic"}}>- {item.answer}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">No paragraph answers.</Typography>
                )}
              </Box>
            </Box>

            {/* Multiple Choice Results */}
            <Box
              mb={4}
              sx={{
                marginLeft: 5,
                backgroundColor: "lightgray",
                width: "50vw",
                maxHeight: "50vh",
                overflowX: "auto",
              }}
            >
              <Box flexGrow={1} maxWidth={600} sx={{ padding: 2 }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                  Multiple Choice Results:
                </Typography>
                {Object.keys(multiple_choice_stats).length > 0 ? (
                  Object.entries(multiple_choice_stats).map(
                    ([questionId, { question_text, options = {} }], index) => {
                      const choiceCounts = Object.entries(options).map(
                        ([choice, count]) => ({
                          name: choice,
                          value: count,
                        })
                      );

                      return (
                        <Box key={index} mb={4} sx={{ padding: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {question_text}
                          </Typography>
                          {choiceCounts.length > 0 ? (
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

          {/* Feedback Sentiments with Scores */}
          <Stack sx={{ display: "flex", flexDirection: "row" }}>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "start",
                backgroundColor: "lightgray",
                flexDirection: "column",
                width: "60vw",
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "center ", margin: 1 }}
              >
                <Typography variant="h4">Feedback Sentiments</Typography>
              </Box>

              <Box
                mb={4}
                sx={{ margin: 3, overflowY: "auto", maxHeight: "55vh" }}
              >
                {Object.keys(feedback_sentiments).length > 0 ? (
                  Object.keys(feedback_sentiments).map((questionId) => {
                    const sentimentData = feedback_sentiments[questionId];
                    const {
                      feedback = [],
                      question_text,
                      total_score,
                      count,
                    } = sentimentData;

                    const average_sentiment =
                      count > 0 ? total_score / count : 0;

                    return (
                      <Box key={questionId} mb={4}>
                        <Typography variant="h6" gutterBottom>
                          Question: {question_text}
                        </Typography>
                        <Paper sx={{ overflowY: "auto" }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography variant="h6">Feedback</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="h6">
                                    Sentiment Score
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="h6">Remarks</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {feedback.length > 0 ? (
                                feedback.map(
                                  ({ answer, sentiment_score }, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {answer || "No feedback provided"}
                                      </TableCell>
                                      <TableCell>{sentiment_score}</TableCell>
                                      <TableCell>
                                        {sentiment_score > 0
                                          ? "Positive"
                                          : sentiment_score < 0
                                          ? "Negative"
                                          : "Neutral"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    No feedback provided for this question.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Paper>

                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                          Average Sentiment Score:{" "}
                          {average_sentiment.toFixed(2)} (
                          {average_sentiment > 0
                            ? "Positive"
                            : average_sentiment < 0
                            ? "Negative"
                            : "Neutral"}
                          )
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body1">
                    No feedback sentiments.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Pie Chart */}
            <Paper sx={{ padding: 3, width: "60vw", textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Sentiment Analysis
              </Typography>
              <Box display="flex" justifyContent="center">
                <PieChart width={500} height={400}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => {
                      const total = pieData.reduce(
                        (acc, cur) => acc + cur.value,
                        0
                      );
                      const percentage = ((entry.value / total) * 100).toFixed(
                        2
                      );
                      return `${entry.name}: ${percentage}%`;
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieCOLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
};

export default SurveyResults;