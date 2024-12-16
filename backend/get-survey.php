<?php

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'connection.php';

$survey_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($survey_id <= 0) {
    echo json_encode(["error" => "Invalid survey ID"]);
    exit;
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if it's a POST request to update the survey
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['title'], $data['description'], $data['questions'])) {
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $questions = $data['questions'];

        // Update survey title and description
        $sql_update_survey = "UPDATE surveys SET title = '$title', description = '$description' WHERE id = $survey_id";
        if ($conn->query($sql_update_survey) === TRUE) {
            // Delete existing questions and options before updating
            $conn->query("DELETE FROM questions WHERE survey_id = $survey_id");
            $conn->query("DELETE FROM options WHERE question_id IN (SELECT id FROM questions WHERE survey_id = $survey_id)");

            // Insert updated questions and options
            foreach ($questions as $question) {
                // Insert question
                $question_text = $conn->real_escape_string($question['text']);
                $question_type = $conn->real_escape_string($question['type']);

                $sql_insert_question = "INSERT INTO questions (survey_id, question_text, question_type) VALUES ($survey_id, '$question_text', '$question_type')";
                if ($conn->query($sql_insert_question) === TRUE) {
                    $question_id = $conn->insert_id;

                    // Insert options for the question if it has options
                    if (in_array($question_type, ['multiple_choice', 'checkbox']) && isset($question['options'])) {
                        foreach ($question['options'] as $option) {
                            $option_text = $conn->real_escape_string($option);
                            $sql_insert_option = "INSERT INTO options (question_id, option_text) VALUES ($question_id, '$option_text')";
                            $conn->query($sql_insert_option);
                        }
                    }
                }
            }

            // Return success message
            echo json_encode(["success" => "Survey updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update survey"]);
        }
    } else {
        echo json_encode(["error" => "Invalid data"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
