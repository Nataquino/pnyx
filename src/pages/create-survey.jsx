import React, { useState, useEffect } from "react";
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
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import NavBarCreate from "../components/NavBarCreate";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SurveyPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    categories: [], // Field to store selected categories
    customCategory: "", // Field to store custom category input
  });
  const [questions, setQuestions] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]); // Store available categories

  // Fetch available categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-categories.php");
        setAvailableCategories(response.data); // Assuming response.data is an array of categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

    const { title, description, categories, customCategory } = formData;

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

    // Combine selected categories and custom category
    let finalCategories = [...categories];
    if (customCategory.trim() !== "") {
      finalCategories.push(customCategory.trim()); // Add custom category if it's not blank
    }

    try {
      // Merge formData with questions and finalCategories
      const surveyData = { ...formData, questions, categories: finalCategories };

      const response = await axios.post(
        "http://localhost/survey-app/save-survey.php",
        surveyData, { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          }
        },
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
          categories: [],
          customCategory: "",
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

  // Function to handle category selection changes
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, categories: value });
  };

  return (
    <Stack fullWidth sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBarCreate />
      <Container
        sx={{
          backgroundColor: "#F5F5F5",
          width: "140vw",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          marginTop: 12,
          overflowY: "auto",
          padding: "auto",
          marginBottom: 2,
        }}
      >
        <form id="surveyForm" onSubmit={handleSubmit} method="POST" noValidate>
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

          {/* Category Selection */}
          <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel id="category-label">Select Categories</InputLabel>
            <Select
              labelId="category-label"
              id="categories"
              multiple
              value={formData.categories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Select Categories" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.category_name}>
                  <Checkbox
                    checked={formData.categories.indexOf(category.category_name) > -1}
                  />
                  <ListItemText primary={category.category_name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select one or more categories for your survey</FormHelperText>
          </FormControl>

          {/* Custom Category Input */}
          <TextField
            label="Add Custom Category"
            name="customCategory"
            id="customCategory"
            fullWidth
            margin="normal"
            placeholder="Enter custom category"
            value={formData.customCategory}
            onChange={handleChange}
          />
          <FormHelperText>If you don't find the category you need, add a custom one</FormHelperText>

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
                  {["multiple_choice", "checkbox"].includes(question.type) && (
                    <Box display="flex" alignItems="center" flexWrap="wrap" ml={2}>  {/* Add indent with margin-left */}
                      {question.options.map((option, oIndex) => (
                        <Box
                          key={oIndex}
                          mb={1}
                          mr={2}
                          p={1}
                          width="auto"
                          sx={{
                            backgroundColor: "#f0f0f0", // Light background for enclosure
                            border: "1px solid #ccc",    // Border to define the box
                            borderRadius: 2,             // Rounded corners for the box
                          }}
                        >
                          <TextField
                            label={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder="Option"
                            margin="normal"
                            variant="standard"  // Underline input style
                            sx={{ width: 150 }} // Adjust width if necessary
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

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
