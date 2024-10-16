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

    const { paragraph_answers, multiple_choice_stats = {}, feedback_sentiments } = results; // Default to an empty object

    // Colors for the pie chart
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

    return (
        <Stack>
            <NavBarResult />
            <Container maxWidth={false} sx={{ py: 4, backgroundColor: "skyblue" }}>
                <Card sx={{ padding: 3, marginBottom: 4, display: 'flex', flexDirection: 'column' }}>
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

                    {/* Multiple Choice Results - Aligned to the Right */}
                    <Box mb={4}>
                        <Box flexGrow={1} maxWidth={600}>
                            <Typography variant="h6">Multiple Choice Results:</Typography>
                            {Object.keys(multiple_choice_stats).length > 0 ? (
                                Object.entries(multiple_choice_stats).map(
                                    ([questionId, { question_text, options = {} }], index) => { // Default options to an empty object
                                        const choiceCounts = Object.entries(options).map(([choice, count]) => ({
                                            name: choice,
                                            value: count,
                                        }));

                                        return (
                                            <Box key={index} mb={4}>
                                                <Typography variant="h6" gutterBottom>
                                                    {question_text}
                                                </Typography>
                                                {choiceCounts.length > 0 ? ( // Check if choiceCounts has data
                                                    <PieChart width={400} height={300}>
                                                        <Pie
                                                            data={choiceCounts}
                                                            cx={200}
                                                            cy={150}
                                                            outerRadius={120}
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
                                                ) : (
                                                    <Typography variant="body2">No options available for this question.</Typography>
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

                    {/* Feedback Sentiments with Answers */}
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
                                            {sentimentData.average_sentiment ? sentimentData.average_sentiment.toFixed(2) : 'N/A'})
                                        </Typography>
                                        <Typography variant="body2">
                                            Feedback: {sentimentData.feedback || "No feedback provided."}
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
