import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
<<<<<<< HEAD
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
=======
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
  Divider,
  Card,
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
} from "@mui/material";
import TakeSurveyNav from "../components/TakeSurveyNav";

const TakeSurvey = () => {
  const { id } = useParams(); // Get the survey ID from the URL
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});

<<<<<<< HEAD
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

    const handleChange = (questionId, value, isCheckbox = false) => {
        if (isCheckbox) {
            setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[questionId] || [];
                if (currentAnswers.includes(value)) {
                    return {
                        ...prevAnswers,
                        [questionId]: currentAnswers.filter((answer) => answer !== value),
                    };
                } else {
                    return {
                        ...prevAnswers,
                        [questionId]: [...currentAnswers, value],
                    };
                }
            });
        } else {
            setAnswers({
                ...answers,
                [questionId]: value,
            });
        }
=======
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
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
    };
    

<<<<<<< HEAD
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
        } catch (error) {
            console.error("Error submitting survey:", error);
        }
    };
=======
    fetchSurvey();
  }, [id]);
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996

  const handleChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

<<<<<<< HEAD
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
                    width: "50vw",
                    height: "120vh",
                }}
            >
                <Container sx={{ backgroundColor: "#05B1BF" }}>
                    <Box sx={{ py: 2, paddingLeft: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            {survey.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {survey.description}
                        </Typography>
                    </Box>
                </Container>
                <Card sx={{ height: "96vh", overflowY: "auto" }}>
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
                                width: "105%",
                                paddingLeft: 200,
                                paddingTop: 10,
                                paddingBottom: 10,
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
                                                    handleChange(question.id, e.target.value)
                                                }
                                            >
                                                {question.options.map((option) => (
                                                    <FormControlLabel
                                                        key={option.id}
                                                        value={option.option_text}
                                                        control={<Radio />}
                                                        label={option.option_text}
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
                                        {/* Add other question types as needed */}
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
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/survey-app/submit-survey.php",
        { surveyId: id, answers }
      );
      console.log("Survey submitted successfully:", response.data);
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
          width: "50vw",
          height: "120vh",
        }}
      >
        <Container sx={{ backgroundColor: "#05B1BF" }}>
          <Box sx={{py:2, paddingLeft: 5 }}>
            <Typography variant="h4" gutterBottom>
              {survey.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {survey.description}
            </Typography>
          </Box>
        </Container>
        <Card sx={{ height: "96vh", overflowY: "auto" }}>
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
                width: "105%",
                paddingLeft: 200,
                paddingTop: 10,
                paddingBottom: 10,
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
                          handleChange(question.id, e.target.value)
                        }
                      >
                        {question.options.map((option) => (
                          <FormControlLabel
                            key={option.id}
                            value={option.option_text}
                            control={<Radio />}
                            label={option.option_text}
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
                                  e.target.checked ? option.option_text : ""
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
                    {/* Add other question types as needed */}
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
>>>>>>> 2bab7da32c3bba16534233e016a9c3a2b4c08996
};

export default TakeSurvey;
