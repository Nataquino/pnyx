<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';  // Your database connection

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

$userId = $data['userId'];  // Get the user ID from the request
$interests = $data['interests'];  // Get the interests array

// Now, insert the new preferences
$stmt = $conn->prepare("INSERT INTO user_preferences (user_id, category) VALUES (?, ?)");
foreach ($interests as $interest) {
    $stmt->bind_param("is", $userId, $interest);
    $stmt->execute();
}
$stmt->close();

echo json_encode(["message" => "Preferences saved successfully!"]);  // Return a JSON response

?>
