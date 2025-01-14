<?php
// Set CORS headers for all responses
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust as needed for production
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Include OPTIONS for preflight
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond OK for preflight
    exit;
}

include('connection.php');

// Get the raw POST data
$inputData = json_decode(file_get_contents('php://input'), true);

if (isset($inputData['survey_id']) && isset($inputData['passcode'])) {
    // Validate and sanitize the inputs
    $survey_id = filter_var($inputData['survey_id'], FILTER_VALIDATE_INT);
    $passcode = trim($inputData['passcode']); // Trim to remove whitespace

    if ($survey_id && !empty($passcode)) {
        // Use prepared statements for security
        $stmt = $conn->prepare("SELECT passcode FROM surveys WHERE id = ? AND is_locked = 1");
        $stmt->bind_param("i", $survey_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $survey = $result->fetch_assoc();
            $dbPasscode = trim($survey['passcode']); // Trim database passcode

            if ($dbPasscode === $passcode) {
                // Passcode matches
                http_response_code(200); // Success
                echo json_encode(['status' => 'success']);
            } else {
                // Incorrect passcode
                http_response_code(401); // Unauthorized
                echo json_encode(['status' => 'error', 'message' => 'Invalid passcode.']);
            }
        } else {
            // Survey not found or not locked
            http_response_code(404); // Not Found
            echo json_encode(['status' => 'error', 'message' => 'Survey not available.']);
        }

        $stmt->close();
    } else {
        // Invalid survey_id or passcode
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Invalid survey ID or passcode.']);
    }
} else {
    // Missing required input
    http_response_code(422); // Unprocessable Entity
    echo json_encode(['status' => 'error', 'message' => 'Survey ID or passcode not provided.']);
}

$conn->close();
?>
