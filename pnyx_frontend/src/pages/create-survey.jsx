import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import NavBarCreate from "../components/NavBarCreate";

const SurveyPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [questions, setQuestions] = useState([]);
  // Function to add a new question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "", options: [] }]);
  };

  // Function to remove a question by index
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // Function to update a question's field (text or type)
  const updateQuestion = (index, field, value) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, [field]: value } : question
    );
    setQuestions(newQuestions);
  };

  // Function to update an option of a question
  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = questions.map((question, i) =>
      i === qIndex
        ? {
            ...question,
            options: question.options.map((option, j) =>
              j === oIndex ? value : option
            ),
          }
        : question
    );
    setQuestions(newQuestions);
  };

  // Function to add an option to a question
  const addOption = (index) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? { ...question, options: [...question.options, ""] }
        : question
    );
    setQuestions(newQuestions);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = formData;

    // Basic validation
    if (!title) {
      alert("Title cannot be blank");
      return;
    }

    if (!description) {
      alert("Description cannot be blank");
      return;
    }

    if (questions.length === 0) {
      alert("At least one question is required");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text) {
        alert(`Question ${i + 1} text cannot be blank`);
        return;
      }
      if (!questions[i].type) {
        alert(`Question ${i + 1} type cannot be blank`);
        return;
      }
      if (
        ["multiple_choice", "checkbox"].includes(questions[i].type) &&
        questions[i].options.some((option) => !option)
      ) {
        alert(`All options for Question ${i + 1} must be filled`);
        return;
      }
    }

    try {
      // Merge formData with questions
      const surveyData = { ...formData, questions}; // Include userId

      const response = await axios.post(
        "http://localhost/survey-app/save-survey.php",
        surveyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        console.log("Survey saved successfully!");
        e.target.reset();
        setQuestions([]);
        setFormData({
          title: "",
          description: "",
          questions: [],
        });
      } else {
        console.error("Failed to save survey:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving survey:", error);
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBarCreate />
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "#F5F5F5",
          width: "100vw",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          marginTop: 12,
          overflowY: "auto",
          padding: "auto",
          marginBottom: 2,
        }}
      >
        <form
          id="surveyForm"
          onSubmit={handleSubmit}
          method="POST"
          noValidate
        >
          <TextField
            sx={{ marginTop: 5 }}
            label="Title"
            name="title"
            id="title"
            fullWidth
            margin="normal"
            required
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            id="description"
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <div id="questionContainer">
            {questions.map((question, qIndex) => (
              <Box key={qIndex} mt={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`Question ${qIndex + 1}`}
                      name={`questions[${qIndex}][text]`}
                      fullWidth
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(qIndex, "text", e.target.value)
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id={`type${qIndex}-label`}>Type</InputLabel>
                      <Select
                        labelId={`type${qIndex}-label`}
                        id={`type${qIndex}`}
                        value={question.type}
                        onChange={(e) =>
                          updateQuestion(qIndex, "type", e.target.value)
                        }
                        label="Type"
                      >
                        <MenuItem value="">Select Question Type</MenuItem>
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                        <MenuItem value="multiple_choice">
                          Multiple Choice
                        </MenuItem>
                        <MenuItem value="checkbox">Checkbox</MenuItem>
                        <MenuItem value="feedback">Feedback</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton onClick={() => removeQuestion(qIndex)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  {["multiple_choice", "checkbox"].includes(question.type) &&
                    question.options.map((option, oIndex) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        key={oIndex}
                        mb={1}
                      >
                        <TextField
                          label={`Option ${oIndex + 1}`}
                          fullWidth
                          value={option}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          placeholder="Option"
                          margin="normal"
                        />
                      </Box>
                    ))}
                  {["multiple_choice", "checkbox"].includes(question.type) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addOption(qIndex)}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add Option
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </div>
          <Box
            mt={4}
            display="flex"
            justifyContent="space-between"
            sx={{ paddingBottom: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={addQuestion}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Question
            </Button>
            <Button variant="contained" color="secondary" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    </Stack>
  );
};

export default SurveyPage;
