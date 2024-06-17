import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Button, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await axios.get('http://localhost/survey-app/get-surveys.php');
                console.log(response); // Log the entire response
                console.log(response.data); // Log the response data
                console.log(Array.isArray(response.data)); // Check if response.data is an array

                if (Array.isArray(response.data)) {
                    setSurveys(response.data);
                }
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };

        fetchSurveys();
    }, []);

    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                {surveys.map((survey) => (
                    <Grid item xs={12} sm={6} md={4} key={survey.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {survey.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {survey.description}
                                </Typography>
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/take-survey/${survey.id}`}
                                    >
                                        Answer Survey
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SurveyList;
