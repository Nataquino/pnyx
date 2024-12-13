<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if 'id' is provided
    if (isset($data['id'])) {
        $categoryId = $data['id'];

        // Prepare and execute SQL to delete the category
        $sql = "DELETE FROM categories WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $categoryId);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Category deleted successfully']);
        } else {
            echo json_encode(['message' => 'Failed to delete category']);
        }

        $stmt->close();
    } else {
        echo json_encode(['message' => 'Category ID is required']);
    }
}

$conn->close();
?>
