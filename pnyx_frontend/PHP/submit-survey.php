<?php

header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight request
    exit(0);
}

include 'connection.php';


echo 'Hello'
    
?>


//
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception("No data received or invalid JSON.");
    }
}
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->beginTransaction();

    $stmt = $conn->prepare("INSERT INTO surveys (title, description) VALUES (:title, :description)");
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->execute();
    $survey_id = $conn->lastInsertId();

    foreach ($data['questions'] as $question) {
        $stmt = $conn->prepare("INSERT INTO questions (survey_id, question_text, question_type) VALUES (:survey_id, :question_text, :question_type)");
        $stmt->bindParam(':survey_id', $survey_id);
        $stmt->bindParam(':question_text', $question['text']);
        $stmt->bindParam(':question_type', $question['type']);
        $stmt->execute();
        $question_id = $conn->lastInsertId();

        if (isset($question['options']) && in_array($question['type'], ['multiple_choice', 'checkbox'])) {
            foreach ($question['options'] as $option) {
                $stmt = $conn->prepare("INSERT INTO options (question_id, option_text) VALUES (:question_id, :option_text)");
                $stmt->bindParam(':question_id', $question_id);
                $stmt->bindParam(':option_text', $option);
                $stmt->execute();
            }
        }
    }

    $conn->commit();
    echo "Survey saved successfully!";
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo "Failed to save survey: " . $e->getMessage();
    error_log("Failed to save survey: " . $e->getMessage());
}

\\