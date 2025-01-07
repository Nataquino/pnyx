<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

require 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
    echo json_encode(["error" => "Reward ID is required."]);
    exit;
}

$id = intval($data['id']);

$sql = "DELETE FROM rewards WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Reward deleted successfully!"]);
} else {
    echo json_encode(["error" => "Error deleting reward: " . $conn->error]);
}

$conn->close();
?>
