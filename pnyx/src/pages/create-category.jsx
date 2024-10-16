import { Stack, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';

const AdminCategories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]); // State to hold the list of categories

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost/survey-app/get-categories.php'); // Adjust endpoint as necessary
            setCategories(response.data); // Assuming response.data is an array of categories
            console.log(response.data);
        } catch (error) {
            setMessage('Failed to fetch categories: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost/survey-app/add-category.php', {
                category_name: categoryName
            });

            setMessage(response.data.message);
            setCategoryName('');
            fetchCategories(); // Refresh the category list after adding a new category
        } catch (error) {
            setMessage('Failed to add category: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return; // Exit if the user doesn't confirm the deletion
        }

        try {
            const response = await axios.post('http://localhost/survey-app/remove-category.php', { id: categoryId });
            setMessage(response.data.message);
            fetchCategories(); // Refresh the list after deletion
        } catch (error) {
            setMessage('Failed to delete category: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <Stack sx={{ backgroundColor: "skyblue", height: "100vh" }}>
            <Box>
                <AdminMain />
                <Stack
                    sx={{
                        backgroundColor: "lightgray",
                        height: "100vh",
                        padding: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", // Center items horizontally
                    }}
                >
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>
                        Add New Category
                    </Typography>
                    <form onSubmit={handleAddCategory} style={{ width: '300px' }}>
                        <TextField
                            label="Category Name"
                            variant="outlined"
                            fullWidth
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            sx={{ marginBottom: 2 }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ backgroundColor: "#05B1BF", width: '100%' }}
                        >
                            Add Category
                        </Button>
                    </form>
                    {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}

                    <Typography variant="h5" sx={{ marginTop: 4 }}>
                        Existing Categories
                    </Typography>
                    <List sx={{ width: '300px', marginTop: 2 }}>
                        {categories.map((category) => (
                            <ListItem
                                key={category.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={category.category_name} />
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </Box>
        </Stack>
    );
};

export default AdminCategories;
