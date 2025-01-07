import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import AdminMain from "../components/AdminMain";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost/survey-app/get-categories.php"
      );
      setCategories(response.data);
    } catch (error) {
      setMessage(
        "Failed to fetch categories: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/survey-app/add-category.php",
        {
          category_name: categoryName,
        }
      );

      setMessage(response.data.message);
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      setMessage(
        "Failed to add category: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/survey-app/remove-category.php",
        { id: categoryId }
      );
      setMessage(response.data.message);
      fetchCategories();
    } catch (error) {
      setMessage(
        "Failed to delete category: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <Stack sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <AdminMain />
      <Box sx={{ padding: { xs: 2, sm: 4 }, marginTop: { xs: 20 , sm: -15 } }}>
        <Stack
          spacing={4}
          sx={{
            maxWidth: { xs: "100%", sm: "600px" },
            margin: "0 auto",
            marginTop: -9,
            backgroundColor: "#ffffff",
            borderRadius: 4,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: { xs: 2, sm: 4 },
            minHeight: { xs: "auto", md: "90vh" },
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#333", fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Manage Categories
          </Typography>

          <form onSubmit={handleAddCategory}>
            <Stack spacing={2}>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#145a8d" },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Add Category
              </Button>
            </Stack>
          </form>

          {message && (
            <Typography
              align="center"
              sx={{
                color: message.includes("Failed") ? "red" : "green",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {message}
            </Typography>
          )}

          <Divider sx={{ marginY: { xs: 1, sm: 2 } }} />

          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "#555",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Existing Categories
          </Typography>

          <Stack
            spacing={2}
            sx={{
              overflowY: "auto",
              maxHeight: { xs: "40vh", sm: "50vh" },
              paddingX: { xs: 1, sm: 0 },
            }}
          >
            {categories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: { xs: 1, sm: 2 },
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  <Typography>{category.category_name}</Typography>
                </CardContent>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteCategory(category.id)}
                  sx={{
                    color: "#d32f2f",
                    "&:hover": { color: "#9a1c1c" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AdminCategories;
