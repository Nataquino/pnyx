<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

require 'connection.php';
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed."]));
}

// Read input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['name']) || empty($data['description']) || empty($data['points_required']) || empty($data['stock']) || empty($data['expiry_date']) || empty($data['status'])) {
    echo json_encode(["error" => "All fields are required."]);
    exit;
}

$name = $data['name'];
$description = $data['description'];
$points_required = intval($data['points_required']);
$stock = intval($data['stock']);
$expiry_date = $data['expiry_date'];
$status = $data['status'];

if ($points_required <= 0 || $stock <= 0) {
    echo json_encode(["error" => "Points required and stock must be greater than zero."]);
    exit;
}

if (!strtotime($expiry_date)) {
    echo json_encode(["error" => "Invalid expiry date format."]);
    exit;
}

// Insert reward using prepared statement
$stmt = $conn->prepare("INSERT INTO rewards (name, description, points_required, stock, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssiiis", $name, $description, $points_required, $stock, $expiry_date, $status);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reward added successfully!", "id" => $stmt->insert_id]);
} else {
    error_log("Error adding reward: " . $stmt->error, 3, "/var/log/php_errors.log");
    echo json_encode(["error" => "An error occurred while adding the reward. Please try again later."]);
}

$stmt->close();
$conn->close();
?>
