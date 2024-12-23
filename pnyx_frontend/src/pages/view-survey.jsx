import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField } from '@mui/material';

const TakeSurvey = () => {
    const { id } = useParams(); // Get the survey ID from the URL
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`http://localhost/survey-app/survey-view.php?id=${id}`);
                console.log(response.data);
                setSurvey(response.data);
            } catch (error) {
                console.error('Error fetching survey:', error);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    if (!survey) return <div>Loading...</div>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>{survey.title}</Typography>
            <Typography variant="body1" gutterBottom>{survey.description}</Typography>
            <form>
                {survey.questions.map((question) => (
                    <Box key={question.id} mt={4}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">{question.question_text}</FormLabel>
                            {question.question_type === 'multiple_choice' && (
                                <RadioGroup onChange={(e) => handleChange(question.id, e.target.value)}>
                                    {question.options.map((option) => (
                                        <FormControlLabel key={option.id} value={option.option_text} control={<Radio />} label={option.option_text} />
                                    ))}
                                </RadioGroup>
                            )}
                            {question.question_type === 'checkbox' && (
                                question.options.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        control={<Checkbox onChange={(e) => handleChange(question.id, e.target.checked ? option.option_text : '')} />}
                                        label={option.option_text}
                                    />
                                ))
                            )}
                            {question.question_type === 'paragraph' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                />
                            )}
                        </FormControl>
                    </Box>
                ))}
            </form>
        </Container>
    );
};

export default TakeSurvey;
