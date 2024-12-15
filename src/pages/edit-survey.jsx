import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import TakeSurveyNav from "../components/TakeSurveyNav";

const EditSurvey = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the survey ID from the URL
    const [survey, setSurvey] = useState(null);
    const [updatedSurvey, setUpdatedSurvey] = useState({});
    const [isFeedbackOpen, setFeedbackOpen] = useState(false); // State for feedback popup

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(
                    `http://localhost/survey-app/get-survey.php?id=${id}`
                );
                console.log(response.data);
                setSurvey(response.data);
                setUpdatedSurvey({
                    title: response.data.title,
                    description: response.data.description,
                    questions: response.data.questions,
                });
            } catch (error) {
                console.error("Error fetching survey:", error);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedSurvey((prevSurvey) => ({
            ...prevSurvey,
            [name]: value,
        }));
    };

    const handleQuestionChange = (questionId, e) => {
        const { name, value } = e.target;
        setUpdatedSurvey((prevSurvey) => {
            const updatedQuestions = prevSurvey.questions.map((question) => {
                if (question.id === questionId) {
                    return { ...question, [name]: value };
                }
                return question;
            });
            return { ...prevSurvey, questions: updatedQuestions };
        });
    };

    const handleOptionChange = (questionId, optionId, value) => {
        setUpdatedSurvey((prevSurvey) => {
            const updatedQuestions = prevSurvey.questions.map((question) => {
                if (question.id === questionId) {
                    const updatedOptions = question.options.map((option) => {
                        if (option.id === optionId) {
                            return { ...option, option_text: value };
                        }
                        return option;
                    });
                    return { ...question, options: updatedOptions };
                }
                return question;
            });
            return { ...prevSurvey, questions: updatedQuestions };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...updatedSurvey, surveyId: id };
        console.log("Submitting edited survey:", payload);

        try {
            const response = await axios.post(
                "http://localhost/survey-app/edit-survey.php",
                payload
            );
            console.log("Survey edited successfully:", response.data);
            navigate(`/survey-list`); // Redirect to the survey list page after successful submission
        } catch (error) {
            console.error("Error editing survey:", error);
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
                minHeight: "100vh",
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
                            Edit Survey
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
                            {/* Title and Description */}
                            <Box mt={4}>
                                <TextField
                                    label="Survey Title"
                                    fullWidth
                                    required
                                    name="title"
                                    value={updatedSurvey.title || ""}
                                    onChange={handleInputChange}
                                    style={{ width: "35vw" }}
                                />
                            </Box>
                            <Box mt={4}>
                                <TextField
                                    label="Survey Description"
                                    fullWidth
                                    required
                                    name="description"
                                    value={updatedSurvey.description || ""}
                                    onChange={handleInputChange}
                                    style={{ width: "35vw" }}
                                />
                            </Box>

                            {/* Questions */}
                            {updatedSurvey.questions.map((question) => (
                                question.question_text ? (
                                    <Box key={question.id} mt={4}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">
                                                <TextField
                                                    label="Question Text"
                                                    fullWidth
                                                    required
                                                    name="question_text"
                                                    value={question.question_text || ""}
                                                    onChange={(e) => handleQuestionChange(question.id, e)}
                                                    style={{ width: "35vw", marginBottom: "10px" }}
                                                />
                                            </FormLabel>

                                            {question.question_type === "multiple_choice" && (
                                                <RadioGroup
                                                    onChange={(e) => handleQuestionChange(question.id, e)}
                                                    value={question.answer || ""}
                                                >
                                                    {question.options.map((option) => (
                                                        <Box key={option.id} sx={{ display: "flex", alignItems: "center" }}>
                                                            <FormControlLabel
                                                                value={option.option_text}
                                                                control={<Radio />}
                                                                label={
                                                                    <TextField
                                                                        fullWidth
                                                                        value={option.option_text || ""}
                                                                        onChange={(e) =>
                                                                            handleOptionChange(question.id, option.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            width: "30vw",
                                                                            marginBottom: "10px",
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        </Box>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                            {question.question_type === "checkbox" &&
                                                question.options.map((option) => (
                                                    <FormControlLabel
                                                        key={option.id}
                                                        control={
                                                            <Checkbox
                                                                checked={question.answers && question.answers.includes(option.option_text)}
                                                                onChange={(e) =>
                                                                    handleQuestionChange(question.id, option.option_text, e.target.checked, true)
                                                                }
                                                            />
                                                        }
                                                        label={
                                                            <TextField
                                                                fullWidth
                                                                value={option.option_text || ""}
                                                                onChange={(e) =>
                                                                    handleOptionChange(question.id, option.id, e.target.value)
                                                                }
                                                                style={{
                                                                    width: "30vw",
                                                                    marginBottom: "10px",
                                                                }}
                                                            />
                                                        }
                                                    />
                                                ))}
                                            {question.question_type === "paragraph" && (
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    required
                                                    rows={4}
                                                    name={`question_${question.id}`}
                                                    value={question.answer || ""}
                                                    onChange={(e) => handleQuestionChange(question.id, e)}
                                                    style={{ width: "35vw" }}
                                                />
                                            )}
                                        </FormControl>
                                    </Box>
                                ) : null
                            ))}

                            <Box mt={4}>
                                <Button variant="contained" color="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                    </Container>
                </Card>
            </Card>

            {/* Feedback Popup (Optional) */}
            <Dialog open={isFeedbackOpen} onClose={() => setFeedbackOpen(false)}>
                <DialogTitle>Survey Edit Successful</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Your survey has been successfully updated.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate(`/survey-list`)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default EditSurvey;
