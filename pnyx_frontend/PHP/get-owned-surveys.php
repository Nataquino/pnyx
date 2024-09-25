<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


include 'connection.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} else {
    // Default user_id if not set in session, remove or adjust based on your logic
    $user_id = 13;
}
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT id, title, description FROM surveys WHERE status = 'approved' AND user_id = " . $user_id;
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
