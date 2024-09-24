import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  IconButton,
  Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import '../App.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const SurveyPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: []
  });
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: '', options: [] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = questions.map((question, i) => (
      i === index ? { ...question, [field]: value } : question
    ));
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = questions.map((question, i) => (
      i === qIndex
        ? { ...question, options: question.options.map((option, j) => j === oIndex ? value : option) }
        : question
    ));
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = questions.map((question, i) => (
      i === index ? { ...question, options: [...question.options, ''] } : question
    ));
    setQuestions(newQuestions);
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  // Serialize form data
  const formData = new FormData(e.target);
  const serializedFormData = {};
  for (const [key, value] of formData.entries()) {
    serializedFormData[key] = value;
  }

  console.log('Submitting form data:', { ...serializedFormData, questions });

  try {
    const response = await axios.post('http://localhost:3000/survey-app/submit-survey.php', {
      ...serializedFormData,
      questions
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', response.data);

    if (response.status === 200) {
      console.log('Survey saved successfully!');
      // Clear form data and questions
      e.target.reset();
      setQuestions([]);
    } else {
      console.error('Failed to save survey:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving survey:', error);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create Your Survey
      </Typography>
      <form id="surveyForm" onSubmit={handleSubmit} method='POST' noValidate>
        <TextField
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
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
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
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="">Select Question Type</MenuItem>
                      <MenuItem value="paragraph">Paragraph</MenuItem>
                      <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                      <MenuItem value="checkbox">Checkbox</MenuItem>
                      <MenuItem value="dropdown">Dropdown</MenuItem>
                      <MenuItem value="file_upload">File Upload</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="time">Time</MenuItem>
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
                {['multiple_choice', 'checkbox'].includes(question.type) && question.options.map((option, oIndex) => (
                  <Box display="flex" alignItems="center" key={oIndex} mb={1}>
                    <TextField
                      label={`Option ${oIndex + 1}`}
                      fullWidth
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder="Option"
                      margin="normal"
                    />
                  </Box>
                ))}
                {['multiple_choice', 'checkbox'].includes(question.type) && (
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
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={addQuestion}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add Question
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};


export default SurveyPage;