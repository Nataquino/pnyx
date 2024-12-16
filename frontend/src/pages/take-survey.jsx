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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Rating,
} from "@mui/material";
import TakeSurveyNav from "../components/TakeSurveyNav";

const TakeSurvey = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the survey ID from the URL
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isFeedbackOpen, setFeedbackOpen] = useState(false); // State for feedback popup
    const [rating, setRating] = useState(0); // State for star rating
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

    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleChange = (questionId, value, optionId = null, isCheckbox = false) => {
        const question = survey.questions.find((q) => q.id === questionId);

        if (isCheckbox) {
            setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[questionId]?.answers || [];
                if (currentAnswers.includes(value)) {
                    return {
                        ...prevAnswers,
                        [questionId]: {
                            question_type: question.question_type,
                            answers: currentAnswers.filter((answer) => answer !== value),
                        },
                    };
                } else {
                    return {
                        ...prevAnswers,
                        [questionId]: {
                            question_type: question.question_type,
                            answers: [...currentAnswers, value],
                        },
                    };
                }
            });
        } else {
            if (question.question_type === "feedback") {
                const sentimentResult = sentiment.analyze(value);
                setAnswers({
                    ...answers,
                    [questionId]: {
                        question_type: question.question_type,
                        answer: value,
                        sentimentScore: sentimentResult.score,
                    },
                });
            } else {
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
        console.log("Submitting survey with data:", payload);

        try {
            const response = await axios.post(
                "http://localhost/survey-app/submit-survey.php",
                payload
            );
            console.log("Survey submitted successfully:", response.data);
            setFeedbackOpen(true); // Open feedback popup after successful submission
        } catch (error) {
            console.error("Error submitting survey:", error);
        }
    };

    const handleFeedbackSubmit = async () => {
        const userId = getCookieValue("user_id");
        try {
            console.log("User feedback rating:", rating);
            // Determine the interaction type based on the rating
            const interactionType = rating === 0 ? "completed" : "rated";
            // Prepare the payload for survey interactions
            const payload = {
                userId: userId, 
                surveyId: id, 
                interactionType: interactionType, 
                rating: rating,
            };
            const response = await axios.post(
                "http://localhost/survey-app/submit-interaction.php",
                payload
            );
    
            console.log("Feedback submitted successfully:", response.data);
            setFeedbackOpen(false);
            navigate("/home");
        } catch (error) {
            console.error("Error submitting feedback:", error);
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
                minheight: "100vh",
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
                    width: "80vw",
                    height: "auto",
                    mb: 2,
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
                                width: "100%",
                                padding: "10px 0",
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
                                                    handleChange(
                                                        question.id,
                                                        e.target.value,
                                                        e.target.dataset.optionId
                                                    )
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
                                                                    option.option_text,
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

            {/* Feedback Popup */}
            <Dialog open={isFeedbackOpen} onClose={() => setFeedbackOpen(false)}>
                <DialogTitle>Thank you for completing the survey!</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Please rate your experience with this survey:
                    </Typography>
                    <Rating
                        name="user-feedback-rating"
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFeedbackSubmit} color="primary">
                        Submit Feedback
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default TakeSurvey;
