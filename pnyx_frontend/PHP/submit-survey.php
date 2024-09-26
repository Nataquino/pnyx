<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'connection.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
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

    // Prepare the SQL statement for inserting survey responses
    $stmt = $conn->prepare("INSERT INTO survey_responses (survey_id, question_id, question_type, answer, sentiment_score, option_score) VALUES (?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    // Prepare the SQL statement for updating the option_score
    $stmt_update_score = $conn->prepare("UPDATE survey_responses SET option_score = option_score + 1 WHERE id = ?");

    if (!$stmt_update_score) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    foreach ($answers as $questionId => $answerData) {
        $questionType = $answerData['question_type'] ?? null;
        if (isset($answerData['answers']) && is_array($answerData['answers'])) {
            foreach ($answerData['answers'] as $singleAnswer) {
                // Insert survey response
                $sentimentScore = ($questionType === "feedback") ? ($answerData['sentimentScore'] ?? 0) : 0;
                $optionScore = ($questionType === 'multiple_choice') ? 1 : 0; // Set option_score to 1 for multiple_choice
                $stmt->bind_param("iissdd", $surveyId, $questionId, $questionType, $singleAnswer, $sentimentScore, $optionScore);
                $stmt->execute();
                
                // Update option_score for multiple choice options
                if ($questionType === 'multiple_choice') {
                    $stmt_update_score->bind_param("i", $singleAnswer);
                    $stmt_update_score->execute();
                }
            }
        } else {
            $answer = $answerData['answer'] ?? '';
            $sentimentScore = ($questionType === "feedback") ? ($answerData['sentimentScore'] ?? 0) : 0;
            $optionScore = ($questionType === 'multiple_choice') ? 1 : 0; // Set option_score to 1 for multiple_choice
            $stmt->bind_param("iissdd", $surveyId, $questionId, $questionType, $answer, $sentimentScore, $optionScore);
            $stmt->execute();
            
            // Update option_score for multiple choice options
            if ($questionType === 'multiple_choice') {
                $stmt_update_score->bind_param("i", $answer);
                $stmt_update_score->execute();
            }
        }
    }

    $stmt->close();
    $stmt_update_score->close();
    echo json_encode(["message" => "Survey submitted successfully."]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Invalid request method."]);
}

$conn->close();
?>
