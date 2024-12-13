<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Database credentials
include 'connection.php';
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the user details (username and email)
$userDetailsSql = "SELECT username, email FROM users";
$userDetailsResult = $conn->query($userDetailsSql);

$users = [];
if ($userDetailsResult->num_rows > 0) {
    while ($row = $userDetailsResult->fetch_assoc()) {
        $users[] = $row;
    }
}

// Get the survey details (title and description)
$surveyDetailsSql = "SELECT title, description FROM surveys";
$surveyDetailsResult = $conn->query($surveyDetailsSql);

$surveys = [];
if ($surveyDetailsResult->num_rows > 0) {
    while ($row = $surveyDetailsResult->fetch_assoc()) {
        $surveys[] = $row;
    }
}

// Return the counts and details as JSON
echo json_encode([
    "users" => $users,
    "surveys" => $surveys
]);

// Close the connection
$conn->close();
?>
