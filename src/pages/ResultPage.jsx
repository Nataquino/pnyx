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
  const pieCOLORS = ["#4CAF50", "#F44336"]; // Green for Positive, Red for Negative

  // Calculate positive and negative feedback counts
  let positiveCount = 0;
  let negativeCount = 0;
  Object.values(feedback_sentiments).forEach((sentimentData) => {
    if (sentimentData.average_sentiment >= 3) {
      positiveCount++;
    } else {
      negativeCount++;
    }
  });

  // Data for Pie Chart
  const chartData = [
    { name: "Positive", value: positiveCount },
    { name: "Negative", value: negativeCount },
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
                overflowX: "auto",
              }}
            >
              <Box sx={{ padding: 2 }}>
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

          {/* Feedback Sentiments with Answers */}
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
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
                {/* <Box>
                  {Object.keys(feedback_sentiments).map((questionId) => {
                    const sentimentData = feedback_sentiments[questionId];
                    return (
                      <Typography key={questionId}>
                        {`Question: ${sentimentData.question_text}`}
                      </Typography>
                    );
                  })}
                </Box> */}

                {Object.keys(feedback_sentiments).length > 0 ? (
                  <>
                    <Box sx={{padding: 2}}>
                      {Object.keys(feedback_sentiments).map((questionId) => {
                        const sentimentData = feedback_sentiments[questionId];
                        const {
                          feedback = [],
                          descriptive_sentiment,
                          average_sentiment,
                          question_text,
                        } = sentimentData;

                        return (
                          <>
                            <Typography key={questionId}>
                              {`Question: ${sentimentData.question_text}`}
                            </Typography>
                            <Paper sx={{ overflow: "auto" }}>
                              <Table variant="solid">
                                <TableHead>
                                  <TableRow sx={{}}>
                                    <TableCell>
                                      {" "}
                                      <Typography variant="h6">
                                        ANSWERS
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="h6">
                                        REMARKS
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="h6">
                                        POINTS
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {feedback.length > 0 ? (
                                    feedback.map((answer, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {answer || "No feedback provided"}
                                        </TableCell>
                                        <TableCell>
                                          {descriptive_sentiment}
                                        </TableCell>
                                        <TableCell>
                                          {average_sentiment
                                            ? average_sentiment.toFixed(2)
                                            : "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ))
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
                          </>
                        );
                      })}
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1">
                    No feedback sentiments.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Pie Chart */}
            <Paper sx={{ padding: 3, width: "50vw", textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Sentiment Analysis (Positive vs Negative)
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieCOLORS[index % pieCOLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
};

export default SurveyResults;
