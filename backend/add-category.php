<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Change this to your front-end URL
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php'; // Make sure to include your database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the data from the request
    $data = json_decode(file_get_contents('php://input'), true);
    

    $category_name = $data['category_name'];

    // Prepare the SQL statement to insert the category
    $sql = "INSERT INTO categories (category_name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $category_name); // 'i' for integer, 's' for string

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Category added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to add category']);
    }

    $stmt->close();
    $conn->close();
}
?>
