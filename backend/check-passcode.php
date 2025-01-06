<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

include('connection.php');

// Get the raw POST data
$inputData = json_decode(file_get_contents('php://input'), true);

// Check if required fields are set
if (isset($inputData['survey_id']) && isset($inputData['passcode'])) {
    // Validate and sanitize the survey_id and passcode inputs
    $survey_id = is_numeric($inputData['survey_id']) ? intval($inputData['survey_id']) : 0;
    $passcode = !empty($inputData['passcode']) ? $inputData['passcode'] : null;

    if ($survey_id > 0 && !empty($passcode)) {
        // Sanitize inputs
        $survey_id = $conn->real_escape_string($survey_id);
        $passcode = $conn->real_escape_string($passcode);

        // Check if the passcode matches
        $query = "SELECT passcode FROM surveys WHERE id = $survey_id AND is_locked = 1";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $survey = $result->fetch_assoc();
            if ($survey['passcode'] === $passcode) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Incorrect passcode.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Survey not found or not locked.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid survey ID or passcode.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data. Survey ID or passcode not set.']);
}

$conn->close();
?>
