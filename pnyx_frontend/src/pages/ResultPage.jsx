import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Container, Typography, Box, Card } from "@mui/material";

const SurveyResults = () => {
    const { id } = useParams(); // Get the survey ID from the URL
    const [results, setResults] = useState({
        paragraph_answers: [],
        multiple_choice_stats: {},
        feedback_sentiments: {}
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost/survey-app/survey-responses.php?id=${id}`);
                console.log(response.data); // Log the entire response data
                setResults(response.data || {}); // Handle empty responses
            } catch (error) {
                console.error("Error fetching survey results:", error);
            }
        };

        fetchResults();
    }, [id]);

    const { paragraph_answers, multiple_choice_stats, feedback_sentiments } = results;

    // Colors for the pie chart
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

    return (
        <Container sx={{ py: 4 }}>
            <Card sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Survey Results
                </Typography>

                {/* Paragraph Answers */}
                <Box mb={4}>
                    <Typography variant="h6">Paragraph Answers:</Typography>
                    {paragraph_answers.length > 0 ? (
                        <Box>
                            {paragraph_answers.map((answer, index) => (
                                <Typography key={index} variant="body1">
                                    {answer}
                                </Typography>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1">No paragraph answers.</Typography>
                    )}
                </Box>

                {/* Multiple Choice Results - Grouped by Question */}
                <Box mb={4}>
                    <Typography variant="h6">Multiple Choice Results:</Typography>
                    {Object.keys(multiple_choice_stats).length > 0 ? (
                        Object.entries(multiple_choice_stats).map(([questionId, choices], index) => {
                            const choiceCounts = Object.entries(choices).map(([choice, count]) => ({
                                name: choice,
                                value: count
                            }));

                            return (
                                <Box key={index} mb={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Question {questionId}:
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
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </Box>
                            );
                        })
                    ) : (
                        <Typography variant="body1">No multiple choice answers.</Typography>
                    )}
                </Box>

                {/* Feedback Sentiments */}
                <Box mb={4}>
                    <Typography variant="h6">Feedback Sentiments:</Typography>
                    {Object.keys(feedback_sentiments).length > 0 ? (
                        <Box>
                            {Object.keys(feedback_sentiments).map((questionId) => {
                                const sentimentData = feedback_sentiments[questionId];
                                return (
                                    <Box key={questionId} mb={2}>
                                        <Typography variant="body1">
                                            Question ID {questionId}: {sentimentData.descriptive_sentiment} (Avg:{" "}
                                            {sentimentData.average_sentiment.toFixed(2)})
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <Typography variant="body1">No feedback sentiments.</Typography>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default SurveyResults;
