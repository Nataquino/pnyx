<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

include('connection.php');

// Check if request is made via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the raw POST data
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Check if required fields are set
    if (isset($inputData['survey_id']) && isset($inputData['passcode'])) {
        $survey_id = intval($inputData['survey_id']);
        $passcode = $inputData['passcode'];

        // Check for valid survey_id and passcode
        if ($survey_id > 0 && !empty($passcode)) {
            // Sanitize inputs to prevent SQL injection
            $survey_id = $conn->real_escape_string($survey_id);
            $passcode = $conn->real_escape_string($passcode);

            // Update the survey to add the passcode and lock it
            $query = "UPDATE surveys SET passcode = '$passcode', is_locked = 1 WHERE id = $survey_id";

            if ($conn->query($query) === TRUE) {
                echo json_encode(['status' => 'success', 'message' => 'Survey locked successfully.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error locking survey: ' . $conn->error]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid survey ID or passcode.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Survey ID or passcode not provided.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

$conn->close();
?>
