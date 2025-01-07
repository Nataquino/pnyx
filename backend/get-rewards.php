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
    $rewards_query = "SELECT id, name, description, points_required FROM rewards";

    if ($rewards_result = $conn->query($rewards_query)) {
        // Check if the query was successful and if there are results
        if ($rewards_result && $rewards_result->num_rows > 0) {
            // Create an array to store the rewards
            $rewards = [];

            // Fetch each row and add to the rewards array
            while ($row = $rewards_result->fetch_assoc()) {
                $rewards[] = [
                    'id' => $row['id'],
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
    // Check if user is authenticated
    if (!isset($_COOKIE['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
        exit;
    }
    $user_id = $_COOKIE['user_id'];

    // Get the number of points to redeem and reward id from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $points_to_deduct = isset($data['points']) ? $data['points'] : 0;

    if ($points_to_deduct <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid points to redeem']);
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

                        // Fetch reward id based on points deducted (assuming each reward has unique points)
                        $reward_query = "SELECT id FROM rewards WHERE points_required = ?";
                        if ($reward_stmt = $conn->prepare($reward_query)) {
                            $reward_stmt->bind_param("i", $points_to_deduct);
                            $reward_stmt->execute();
                            $reward_result = $reward_stmt->get_result();

                            if ($reward_result && $reward_result->num_rows > 0) {
                                $reward_row = $reward_result->fetch_assoc();
                                $reward_id = $reward_row['id'];
                                
                                // Insert into the redemptions table
                                $redemption_query = "INSERT INTO redemptions (user_id, reward_id, voucher_code, redeemed_at) VALUES (?, ?, ?, NOW())";
                                
                                if ($redemption_stmt = $conn->prepare($redemption_query)) {
                                    $redemption_stmt->bind_param("iis", $user_id, $reward_id, $voucher_code);
                                    if ($redemption_stmt->execute()) {
                                        echo json_encode([
                                            'status' => 'success',
                                            'message' => 'Points redeemed successfully',
                                            'new_points' => $new_points,
                                            'voucher_code' => $voucher_code // Include the generated voucher code
                                        ]);
                                    } else {
                                        echo json_encode(['status' => 'error', 'message' => 'Failed to record redemption']);
                                    }
                                } else {
                                    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare redemption query']);
                                }
                            } else {
                                echo json_encode(['status' => 'error', 'message' => 'Reward not found']);
                            }
                        } else {
                            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch reward details']);
                        }
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
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>
