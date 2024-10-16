import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sentiment from "sentiment"; // Import Sentiment for sentiment analysis
import {
    Stack,
    Container,
    Typography,
    Box,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    TextField,
    Card,
} from "@mui/material";
import TakeSurveyNav from "../components/TakeSurveyNav";

const TakeSurvey = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the survey ID from the URL
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const sentiment = new Sentiment(); // Initialize Sentiment

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(
                    `http://localhost/survey-app/take-survey.php?id=${id}`
                );
                console.log(response.data);
                setSurvey(response.data);
            } catch (error) {
                console.error("Error fetching survey:", error);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleChange = (questionId, value, optionId = null, isCheckbox = false) => {
        const question = survey.questions.find((q) => q.id === questionId);

        if (isCheckbox) {
            setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[questionId]?.answers || [];
                if (currentAnswers.includes(value)) { // Check if the answer text is already included
                    return {
                        ...prevAnswers,
                        [questionId]: {
                            question_type: question.question_type,
                            answers: currentAnswers.filter((answer) => answer !== value), // Remove the answer text
                        },
                    };
                } else {
                    return {
                        ...prevAnswers,
                        [questionId]: {
                            question_type: question.question_type,
                            answers: [...currentAnswers, value], // Add the answer text
                        },
                    };
                }
            });
        } else {
            if (question.question_type === "feedback") {
                // Perform sentiment analysis for feedback questions
                const sentimentResult = sentiment.analyze(value);
                setAnswers({
                    ...answers,
                    [questionId]: {
                        question_type: question.question_type,
                        answer: value, // Change 'text' to 'answer'
                        sentimentScore: sentimentResult.score, // Store sentiment score
                    },
                });
            } else {
                // Ensure that value is correctly assigned
                setAnswers({
                    ...answers,
                    [questionId]: {
                        question_type: question.question_type,
                        answer: value,
                    },
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { surveyId: id, answers };
        console.log("Submitting survey with data:", payload); // Log the data being sent
        try {
            const response = await axios.post(
                "http://localhost/survey-app/submit-survey.php",
                payload
            );
            console.log("Survey submitted successfully:", response.data);
            navigate("/home");
        } catch (error) {
            console.error("Error submitting survey:", error);
        }
    };

    if (!survey) return <div>Loading...</div>;

    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                backgroundColor: "skyblue",
                height: "120vh",
                overflowY: "auto",
                py: 2,
            }}
        >
            <Box sx={{ paddingBottom: 12 }}>
                <TakeSurveyNav />
            </Box>

            <Card
                maxWidth="md"
                sx={{
                    backgroundColor: "#F5F5F5",
                    width: "80vw", // Adjusted to 80% of the viewport width
                    height: "auto", // Set to auto for dynamic height
                    mb: 2, // Optional margin bottom
                }}
            >
                <Container sx={{ backgroundColor: "#05B1BF", padding: 2 }}>
                    <Box sx={{ py: 2, paddingLeft: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            {survey.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {survey.description}
                        </Typography>
                    </Box>
                </Container>
                <Card sx={{ height: "auto", overflowY: "auto" }}>
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                width: "100%", // Adjusted to 100%
                                padding: "10px 0", // Unified padding
                            }}
                        >
                            {survey.questions.map((question) => (
                                <Box key={question.id} mt={4}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            {question.question_text}
                                        </FormLabel>
                                        {question.question_type === "multiple_choice" && (
                                            <RadioGroup
                                                onChange={(e) =>
                                                    handleChange(question.id, e.target.value, e.target.dataset.optionId)
                                                }
                                            >
                                                {question.options.map((option) => (
                                                    <FormControlLabel
                                                        key={option.id}
                                                        value={option.option_text}
                                                        control={<Radio />}
                                                        label={option.option_text}
                                                        data-option-id={option.id}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                        {question.question_type === "checkbox" &&
                                            question.options.map((option) => (
                                                <FormControlLabel
                                                    key={option.id}
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    question.id,
                                                                    option.option_text, // Use option_text instead of option.id
                                                                    option.id,
                                                                    true
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={option.option_text}
                                                />
                                            ))}
                                        {question.question_type === "paragraph" && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                required
                                                rows={4}
                                                onChange={(e) =>
                                                    handleChange(question.id, e.target.value)
                                                }
                                                style={{ width: "35vw" }}
                                            />
                                        )}
                                        {question.question_type === "feedback" && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                required
                                                rows={4}
                                                placeholder="Provide your feedback"
                                                onChange={(e) =>
                                                    handleChange(question.id, e.target.value)
                                                }
                                                style={{ width: "35vw" }}
                                            />
                                        )}
                                    </FormControl>
                                </Box>
                            ))}
                            <Box mt={4}>
                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </Container>
                </Card>
            </Card>
        </Stack>
    );
};

export default TakeSurvey;
