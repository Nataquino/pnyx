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
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
    categories: [],
    customCategory: "",
  });
  const [questions, setQuestions] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/survey-app/get-categories.php");
        setAvailableCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Add, remove, and update questions
  const addQuestion = () => setQuestions([...questions, { text: "", type: "", options: [] }]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
  };
  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === qIndex
        ? { ...q, options: q.options.map((opt, j) => (j === oIndex ? value : opt)) }
        : q
    );
    setQuestions(updatedQuestions);
  };
  const addOption = (index) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, options: [...q.options, ""] } : q
    );
    setQuestions(updatedQuestions);
  };

  // Handle form data submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, categories, customCategory } = formData;

    if (!title || !description || questions.length === 0) {
      alert("Please fill out all fields and add at least one question.");
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (
        !question.text ||
        !question.type ||
        (["multiple_choice", "checkbox"].includes(question.type) &&
          question.options.some((option) => !option))
      ) {
        alert(`Please complete all fields for question ${i + 1}.`);
        return;
      }
    }

    const finalCategories = [...categories, customCategory.trim()].filter(Boolean);
    try {
      const surveyData = { ...formData, questions, categories: finalCategories };
      const response = await axios.post("http://localhost/survey-app/save-survey.php", surveyData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Survey saved successfully!");
        setFormData({ title: "", description: "", questions: [], categories: [], customCategory: "" });
        setQuestions([]);
        navigate("/survey-list"); // Navigate to the survey list page
      } else {
        alert("Failed to save survey.");
      }
    } catch (error) {
      console.error("Error saving survey:", error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => setFormData({ ...formData, categories: e.target.value });

  return (
    <Stack fullWidth sx={{ backgroundColor: "#E0F7FA", height: "100vh" }}>
      <NavBarCreate />
      <Container
        sx={{
          backgroundColor: "#FFFFFF",
          width: "80%",
          maxWidth: 1200,
          marginTop: 8,
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            sx={{ marginBottom: 2 }}
            label="Survey Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            sx={{ marginBottom: 2 }}
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            variant="outlined"
          />

          {/* Category Selection */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Select Categories</InputLabel>
            <Select
              multiple
              value={formData.categories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Select Categories" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.category_name}>
                  <Checkbox checked={formData.categories.indexOf(category.category_name) > -1} />
                  <ListItemText primary={category.category_name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select one or more categories for your survey</FormHelperText>
          </FormControl>

          {/* Custom Category */}
          <TextField
            sx={{ marginBottom: 2 }}
            label="Add Custom Category"
            name="customCategory"
            fullWidth
            value={formData.customCategory}
            onChange={handleChange}
            placeholder="Enter custom category"
            variant="outlined"
          />

          {/* Questions Section */}
          <Box mt={4}>
            {questions.map((question, qIndex) => (
              <Box key={qIndex} mb={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`Question ${qIndex + 1}`}
                      fullWidth
                      value={question.text}
                      onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={question.type}
                        onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                        variant="outlined"
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                        <MenuItem value="checkbox">Checkbox</MenuItem>
                        <MenuItem value="feedback">Feedback</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton onClick={() => removeQuestion(qIndex)} color="error">
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Options for Multiple Choice/Checkbox */}
                {["multiple_choice", "checkbox"].includes(question.type) && (
                  <Box ml={3}>
                    {question.options.map((option, oIndex) => (
                      <Box key={oIndex} display="flex" alignItems="center" mb={1}>
                        <TextField
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          variant="outlined"
                          size="small"
                          sx={{ width: "200px" }}
                        />
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addOption(qIndex)}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add Option
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={addQuestion}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Question
            </Button>
            <Button variant="contained" color="success" type="submit">
              Save Survey
            </Button>
          </Box>
        </form>
      </Container>
    </Stack>
  );
};

export default SurveyPage;
