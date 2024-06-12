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
import axios from 'axios';

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

    const { title, description } = formData;

    if (!title) {
      alert('Title cannot be blank');
      return;
    }
    
    if (!description) {
      alert('Description cannot be blank');
      return;
    }
    
    if (questions.length === 0) {
      alert('At least one question is required');
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
      if (['multiple_choice', 'checkbox'].includes(questions[i].type) && questions[i].options.some(option => !option)) {
        alert(`All options for Question ${i + 1} must be filled`);
        return;
      }
    }

    try {
      // Merge formData with questions
      const surveyData = { ...formData, questions };
      console.log(surveyData);

      const response = await axios.post('http://localhost/survey-app/save-survey.php', surveyData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      if (response.status === 200) {
        console.log('Survey saved successfully!');
        e.target.reset();
        setQuestions([]);
        setFormData({
          title: '',
          description: '',
          questions: []
        });
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