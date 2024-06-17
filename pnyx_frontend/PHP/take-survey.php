<?php
header('Access-Control-Allow-Origin: *');
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

// Fetch survey details
$sql = "SELECT id, title, description FROM surveys WHERE id = $survey_id";
$result = $conn->query($sql);

$survey = null;

if ($result->num_rows > 0) {
    $survey = $result->fetch_assoc();
} else {
    echo json_encode(["error" => "Survey not found"]);
    $conn->close();
    exit;
}

// Fetch questions
$sql = "SELECT id, question_text, question_type FROM questions WHERE survey_id = $survey_id";
$result = $conn->query($sql);

$questions = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $question_id = $row['id'];
        $row['options'] = [];

        if (in_array($row['question_type'], ['multiple_choice', 'checkbox'])) {
            // Fetch options for the question
            $sql_options = "SELECT id, option_text FROM options WHERE question_id = $question_id";
            $result_options = $conn->query($sql_options);

            if ($result_options->num_rows > 0) {
                while ($option = $result_options->fetch_assoc()) {
                    $row['options'][] = $option;
                }
            }
        }
        $questions[] = $row;
    }
}

$survey['questions'] = $questions;

$conn->close();

echo json_encode($survey);
?>
