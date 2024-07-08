<?php
// save-survey.php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'connection.php';
session_start();

// Retrieve POST data from frontend
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

try {
    // Initialize PDO connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Start a transaction
    $conn->beginTransaction();

    // Insert survey information
    $stmt = $conn->prepare("INSERT INTO surveys (title, description, user_id) VALUES (:title, :description, :user_id)");
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->execute();
    $survey_id = $conn->lastInsertId();

    // Insert questions and options
    foreach ($data['questions'] as $question) {
        $stmt = $conn->prepare("INSERT INTO questions (survey_id, question_text, question_type) VALUES (:survey_id, :question_text, :question_type)");
        $stmt->bindParam(':survey_id', $survey_id);
        $stmt->bindParam(':question_text', $question['text']);
        $stmt->bindParam(':question_type', $question['type']);
        $stmt->execute();
        $question_id = $conn->lastInsertId();

        // Insert options if applicable (for multiple_choice and checkbox types)
        if (in_array($question['type'], ['multiple_choice', 'checkbox']) && isset($question['options'])) {
            foreach ($question['options'] as $option) {
                $stmt = $conn->prepare("INSERT INTO options (question_id, option_text) VALUES (:question_id, :option_text)");
                $stmt->bindParam(':question_id', $question_id);
                $stmt->bindParam(':option_text', $option);
                $stmt->execute();
            }
        }
    }

    // Commit transaction
    $conn->commit();

    // Return success message
    echo json_encode(array('message' => 'Survey saved successfully!'));

} catch (PDOException $e) {
    // Rollback transaction on error
    $conn->rollBack();
    http_response_code(500);
    echo 'Hello';
    echo json_encode(array('message' => 'Failed to save survey: ' . $e->getMessage()));
    
}
?>
