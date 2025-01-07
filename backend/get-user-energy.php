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
    // Prepare a query to fetch the user's energy
    $query = "SELECT energy FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a result is returned
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['energy' => $row['energy']]);
    } else {
        http_response_code(404); // Not found
        echo json_encode(['error' => 'User not found']);
    }

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
