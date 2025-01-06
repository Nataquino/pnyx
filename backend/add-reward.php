<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'connection.php';
// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Read input data from request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (empty($data['name']) || empty($data['description']) || empty($data['points_required']) || empty($data['stock']) || empty($data['expiry_date']) || empty($data['status'])) {
    echo json_encode(["error" => "All fields are required."]);
    exit;
}

// Sanitize input data
$name = $conn->real_escape_string($data['name']);
$description = $conn->real_escape_string($data['description']);
$voucher_code = !empty($data['voucher_code']) ? $conn->real_escape_string($data['voucher_code']) : null;
$points_required = intval($data['points_required']);
$stock = intval($data['stock']);
$expiry_date = $conn->real_escape_string($data['expiry_date']);
$status = $conn->real_escape_string($data['status']);

// SQL query to insert new reward
$sql = "INSERT INTO Rewards (name, description, voucher_code, points_required, stock, expiry_date, status) 
        VALUES ('$name', '$description', '$voucher_code', $points_required, $stock, '$expiry_date', '$status')";

if ($conn->query($sql) === TRUE) {
    // Return success message
    $response = [
        "message" => "Reward added successfully!",
        "id" => $conn->insert_id
    ];
    echo json_encode($response);
} else {
    // Return error message
    echo json_encode(["error" => "Error adding reward: " . $conn->error]);
}

// Close the database connection
$conn->close();
?>
