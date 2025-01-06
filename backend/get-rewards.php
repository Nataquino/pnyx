<?php
// Set headers for JSON response
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

// Include the database connection file
include('connection.php');

// Function to generate a random voucher code
function generateVoucherCode() {
    return strtoupper(bin2hex(random_bytes(6))); // Generates a 12-character hex code
}

// Check if the request method is GET or POST
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
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Deduct points
    if (!isset($_COOKIE['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
        exit;
    }
    $user_id = $_COOKIE['user_id'];

    // Get the number of points to deduct from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $points_to_deduct = isset($data['points']) ? $data['points'] : 0;

    if ($points_to_deduct <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid points to deduct']);
        exit;
    }

    // Fetch the user's current points
    $points_query = "SELECT reward_points FROM users WHERE id = ?";
    
    if ($stmt = $conn->prepare($points_query)) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            $points_row = $result->fetch_assoc();
            $current_points = $points_row['reward_points'];

            if ($current_points >= $points_to_deduct) {
                // Deduct points
                $new_points = $current_points - $points_to_deduct;
                $update_query = "UPDATE users SET reward_points = ? WHERE id = ?";

                if ($update_stmt = $conn->prepare($update_query)) {
                    $update_stmt->bind_param("ii", $new_points, $user_id);
                    if ($update_stmt->execute()) {
                        // Generate voucher code
                        $voucher_code = generateVoucherCode();

                        // You may want to store the voucher code in a table for record-keeping
                        // For now, we'll just return it in the response
                        echo json_encode([
                            'status' => 'success', 
                            'message' => 'Points deducted successfully', 
                            'new_points' => $new_points,
                            'voucher_code' => $voucher_code // Include the generated voucher code
                        ]);
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'Failed to deduct points']);
                    }
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare update query']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Insufficient points']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch user points']);
    }
} else {
    // If the request method is not GET or POST, return an error message
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>
