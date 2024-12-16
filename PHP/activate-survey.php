<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Change this to your front-end URL
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON body from the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the survey ID is provided
    if (!isset($data['survey_id'])) {
        echo json_encode(['success' => false, 'message' => 'Survey ID is required']);
        exit;
    }

    $survey_id = $data['survey_id'];

    // Calculate the expiry date (30 days from today)
    $expiry_date = date('Y-m-d', strtotime('+30 days'));

    // Update the survey status to "activated" and set the expiry date
    try {
        // Prepare the query to update both the status and the expiry date
        $stmt = $conn->prepare("UPDATE surveys SET status = 'activated', expiry_date = ? WHERE id = ?");

        $stmt->bind_param("si", $expiry_date, $survey_id);  
        $stmt->execute();

        // Check if the row was updated
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Survey activated successfully', 'expiry_date' => $expiry_date]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Survey activation failed. Make sure it is approved.']);
        }

        // Close the statement
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
