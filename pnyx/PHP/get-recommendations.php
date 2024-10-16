<?php

// Remove session_start() as we're no longer using sessions
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

// Check if the 'user_id' cookie is set
if (isset($_COOKIE['user_id'])) {
    $user_id = $_COOKIE['user_id'];
} else {
    // Default user_id if not set in cookie, adjust this based on your logic
    echo $_COOKIE['user_id'];
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Update the SQL query to also fetch `status` and `comment`
$sql = "SELECT id, title, description, status, comment FROM surveys WHERE status = 'approved' AND user_id !=$user_id";
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

// Output the surveys with the additional fields
echo json_encode($surveys);

?>
