<?php
// Set headers for JSON response
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

// Include the database connection file
include('connection.php');

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Fetch user_id from cookie
    if (!isset($_COOKIE['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
        exit;
    }
    $user_id = $_COOKIE['user_id'];

    // Define the query to fetch the user's current points using prepared statements to avoid SQL injection
    $points_query = "SELECT reward_points FROM users WHERE id = ?";
    
    if ($stmt = $conn->prepare($points_query)) {
        $stmt->bind_param("i", $user_id);  // Bind the user_id as an integer parameter
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if the points query was successful and the user exists
        if ($result && $result->num_rows > 0) {
            $points_row = $result->fetch_assoc();
            $user_points = $points_row['reward_points'];
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database query failed']);
        exit;
    }

    // Define the query to fetch the name, description, and points_required of all rewards
    $rewards_query = "SELECT name, description, points_required FROM rewards";
    
    if ($rewards_result = $conn->query($rewards_query)) {
        // Check if the query was successful and if there are results
        if ($rewards_result && $rewards_result->num_rows > 0) {
            // Create an array to store the rewards
            $rewards = [];
            
            // Fetch each row and add to the rewards array
            while ($row = $rewards_result->fetch_assoc()) {
                $rewards[] = [
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'points_required' => $row['points_required']
                ];
            }

            // Send the rewards and user's points data as a JSON response
            echo json_encode([
                'status' => 'success',
                'reward_points' => $user_points,
                'rewards' => $rewards
            ]);
        } else {
            // If no rewards found, return an error message
            echo json_encode(['status' => 'error', 'message' => 'No rewards found']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch rewards']);
    }
} else {
    // If the request method is not GET, return an error message
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>