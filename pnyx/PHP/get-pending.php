<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


include 'connection.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT id, title, description FROM surveys WHERE status = 'pending'";
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
