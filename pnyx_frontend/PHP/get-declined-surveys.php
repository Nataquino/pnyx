<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
session_start();

include 'connection.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT id, title, description FROM surveys WHERE status = 'declined'";
$result = $conn->query($sql);

$surveys = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $surveys[] = $row;
    }
} else {
    echo json_encode(["message" => "No surveys found"]);
    exit;
}

$conn->close();

echo json_encode($surveys);
?>
