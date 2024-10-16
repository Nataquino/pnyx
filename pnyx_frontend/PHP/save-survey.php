<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

include 'connection.php';



// Ensure session variable is properly referenced
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} else {
    // Default user_id if not set in session, remove or adjust based on your logic
    $user_id = 13;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Establishing a database connection
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Retrieve raw input data and log it for debugging
        $rawData = file_get_contents('php://input');
        error_log("Raw input data: " . $rawData);

        // Decode JSON input
        $data = json_decode($rawData, true);
        if (!$data) {
            throw new Exception("Invalid JSON input");
        }

        // Begin transaction
        $conn->beginTransaction();
        $inTransaction = true;

        // Prepare and execute survey insertion
        $stmt = $conn->prepare("INSERT INTO surveys (title, description, user_id) VALUES (:title, :description, :user_id)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->execute();

        // Get the last inserted survey ID
        $survey_id = $conn->lastInsertId();
        error_log("Survey ID: " . $survey_id);

        // Insert questions and related options
        foreach ($data['questions'] as $question) {
            $stmt = $conn->prepare("INSERT INTO questions (survey_id, question_text, question_type) VALUES (:survey_id, :question_text, :question_type)");
            $stmt->bindParam(':survey_id', $survey_id);
            $stmt->bindParam(':question_text', $question['text']);
            $stmt->bindParam(':question_type', $question['type']);
            $stmt->execute();

            // Get the last inserted question ID
            $question_id = $conn->lastInsertId();
            error_log("Question ID: " . $question_id);

            // Insert options if the question type is multiple choice or checkbox
            if (isset($question['options']) && in_array($question['type'], ['multiple_choice', 'checkbox'])) {
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
        $inTransaction = false;

        // Return success response
        echo json_encode(["status" => "success", "message" => "Survey saved successfully!"]);
    } catch (Exception $e) {
        // Rollback transaction in case of an error
        if (isset($inTransaction) && $inTransaction) {
            $conn->rollBack();
        }

        // Return error response and log the error
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save survey: " . $e->getMessage()]);
        error_log("Failed to save survey: " . $e->getMessage());
    }
}
?>
