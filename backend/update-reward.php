<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

require 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['name']) || empty($data['description']) || empty($data['points_required']) || empty($data['stock']) || empty($data['expiry_date']) || empty($data['status'])) {
    echo json_encode(["error" => "All fields are required."]);
    exit;
}

$id = intval($data['id']);
$name = $conn->real_escape_string($data['name']);
$description = $conn->real_escape_string($data['description']);
$points_required = intval($data['points_required']);
$stock = intval($data['stock']);
$expiry_date = $conn->real_escape_string($data['expiry_date']);
$status = $conn->real_escape_string($data['status']);

$sql = "UPDATE rewards SET name='$name', description='$description', points_required=$points_required, stock=$stock, expiry_date='$expiry_date', status='$status' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Reward updated successfully!"]);
} else {
    echo json_encode(["error" => "Error updating reward: " . $conn->error]);
}

$conn->close();
?>
