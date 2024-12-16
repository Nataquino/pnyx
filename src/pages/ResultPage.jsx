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
  CardContent,
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
  // Calculate positive and negative feedback counts
  let positiveCount = 0;
  let negativeCount = 0;

  Object.values(feedback_sentiments).forEach((sentimentData) => {
    if (sentimentData.average_sentiment >= 3) {
      negativeCount++;      
    } else {
positiveCount++;
    }
  });

  // Data for Pie Chart
  const chartData = [
    { name: "Positive", value: positiveCount },
    { name: "Negative", value: negativeCount },
  ];

  // Colors for the chart
  const pieCOLORS = ["#4CAF50", "#F44336"]; // Green for Positive, Red for Negative



  
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

            {/* Multiple Choice Results - Aligned to the Right */}
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
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: 15,
                    padding: 2,
                  }}
                >
                  Multiple Choice Results:
                </Typography>
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
                        <Box key={index} mb={4} sx={{ padding: 2 }}>
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
                width: "60vw"
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "center ", margin: 1}}
              >
                <Typography variant="h4">Feedback Sentiments</Typography>
              </Box>
              <Box mb={4} sx={{ margin: 3 , overflowY: "auto" , maxHeight: "55vh"} }>
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
                    <Box>
                      {Object.keys(feedback_sentiments).map((questionId) => {
                        const sentimentData = feedback_sentiments[questionId];
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
                                  {Object.keys(feedback_sentiments).map(
                                    (questionId) => {
                                      const sentimentData =
                                        feedback_sentiments[questionId];
                                      return (
                                        <TableRow key={questionId}>
                                          <TableCell>
                                            {feedback_sentiments.value}
                                          </TableCell>
                                          <TableCell>
                                            {
                                              sentimentData.descriptive_sentiment
                                            }
                                          </TableCell>
                                          <TableCell>
                                            {sentimentData.average_sentiment
                                              ? sentimentData.average_sentiment.toFixed(
                                                  2
                                                )
                                              : "N/A"}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </Paper>
                          </>
                        );
                      })}
                    </Box>
                    {/* <Paper sx={{ overflow: "auto" }}>
                      <Table variant="solid">
                        <TableHead>
                          <TableRow sx={{}}>
                            <TableCell>
                              {" "}
                              <Typography variant="h6">ANSWERS</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">REMARKS</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">POINTS</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.keys(feedback_sentiments).map(
                            (questionId) => {
                              const sentimentData =
                                feedback_sentiments[questionId];
                              return (
                                <TableRow key={questionId}>
                                  <TableCell>
                                    {sentimentData.feedback_sentiments}
                                  </TableCell>
                                  <TableCell>
                                    {sentimentData.descriptive_sentiment}
                                  </TableCell>
                                  <TableCell>
                                    {sentimentData.average_sentiment
                                      ? sentimentData.average_sentiment.toFixed(
                                          2
                                        )
                                      : "N/A"}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </Paper> */}
                  </>
                ) : (
                  <Typography variant="body1">
                    No feedback sentiments.
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Pie Chart for Positive/Negative Feedback */}
            <Paper sx={{ padding: 3, width: "60vw", textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Sentiment Analysis (Positive vs Negative)
              </Typography>
              <Box display="flex" justifyContent="center">
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
              </Box>
            </Paper>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
};

export default SurveyResults;
