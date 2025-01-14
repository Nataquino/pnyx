<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

// Check if the user ID cookie exists
if (!isset($_COOKIE['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Get the logged-in user's ID from the cookie
$user_id = intval($_COOKIE['user_id']); // Ensure the ID is an integer to prevent SQL injection

try {
    // Get today's date
    $today = date('Y-m-d');

    // Prepare a query to get the count of surveys answered today
    $query = "SELECT COUNT(*) as survey_count FROM survey_interactions WHERE user_id = ? AND DATE(interaction_date) = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $user_id, $today);

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Calculate the number of surveys the user has answered today
    $answered_surveys = $row['survey_count'];

    // Calculate the remaining surveys user can answer today (limit of 5)
    $survey_limit = max(0, 5 - $answered_surveys); 

    // Calculate the next available date if the user has reached the limit
    if ($survey_limit == 0) {
        // If the user reached the limit, set the next available date to tomorrow
        $next_available_date = date('l, F j, Y', strtotime('tomorrow'));
    } else {
        $next_available_date = null; // No need to show next date if user can still answer
    }

    echo json_encode([
        'survey_count' => $answered_surveys,
        'survey_limit' => $survey_limit,
        'next_available_date' => $next_available_date
    ]);

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Handle exceptions
    http_response_code(500); // Internal server error
    echo json_encode(['error' => 'An error occurred', 'details' => $e->getMessage()]);
    exit;
}
?>
