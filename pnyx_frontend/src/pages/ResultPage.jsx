import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Container, Typography, Box, Card, Stack } from "@mui/material";
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

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

  return (
    <Stack>
      {" "}
      <NavBarResult />
      <Container maxWidth={false} sx={{ py: 4, backgroundColor: "skyblue" }}>
        <Card sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom>
            Survey Results
          </Typography>

          {/* Paragraph Answers */}
          <Box mb={4}>
            <Typography variant="h6">Paragraph Answers:</Typography>
            {paragraph_answers.length > 0 ? (
              paragraph_answers.map((item, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body1">{item.question_text}</Typography>
                  <Typography variant="body2">{item.answer}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1">No paragraph answers.</Typography>
            )}
          </Box>

          {/* Multiple Choice Results - Grouped by Question */}
          <Box mb={4}>
            <Typography variant="h6">Multiple Choice Results:</Typography>
            {Object.keys(multiple_choice_stats).length > 0 ? (
              Object.entries(multiple_choice_stats).map(
                ([questionId, { question_text, options }], index) => {
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
                      <PieChart width={500} height={400}>
                        <Pie
                          data={choiceCounts}
                          cx={250}
                          cy={200}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {choiceCounts.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </Box>
                  );
                }
              )
            ) : (
              <Typography variant="body1">
                No multiple choice answers.
              </Typography>
            )}
          </Box>

          {/* Feedback Sentiments */}
          <Box mb={4}>
            <Typography variant="h6">Feedback Sentiments:</Typography>
            {Object.keys(feedback_sentiments).length > 0 ? (
              Object.keys(feedback_sentiments).map((questionId) => {
                const sentimentData = feedback_sentiments[questionId];
                return (
                  <Box key={questionId} mb={2}>
                    <Typography variant="body1">
                      {sentimentData.question_text}:{" "}
                      {sentimentData.descriptive_sentiment} (Avg:{" "}
                      {sentimentData.average_sentiment.toFixed(2)})
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body1">No feedback sentiments.</Typography>
            )}
          </Box>
        </Card>
      </Container>
    </Stack>
  );
};

export default SurveyResults;
