<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000'); // Allow requests from your frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Include OPTIONS method
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true'); // Allow credentials

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // OK
    exit();
}

include 'connection.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Decode JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $surveyId = $data['surveyId'] ?? null;
    $answers = $data['answers'] ?? [];

    if (!$surveyId || empty($answers)) {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Invalid input data."]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO survey_responses (survey_id, question_id, answer) VALUES (?, ?, ?)");

    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    foreach ($answers as $questionId => $answer) {
        if (is_array($answer)) {
            foreach ($answer as $singleAnswer) {
                $stmt->bind_param("iis", $surveyId, $questionId, $singleAnswer);
                $stmt->execute();
            }
        } else {
            $stmt->bind_param("iis", $surveyId, $questionId, $answer);
            $stmt->execute();
        }
    }

    $stmt->close();
    echo json_encode(["message" => "Survey submitted successfully."]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Invalid request method."]);
}

$conn->close();
?>
