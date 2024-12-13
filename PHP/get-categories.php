<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT id, category_name FROM categories";
    $result = $conn->query($sql);

    $categories = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row; // Add each row to the categories array
        }
    }

    echo json_encode($categories); // Return categories as JSON
}

$conn->close();
?>
