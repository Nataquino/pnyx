<?php
// Set headers for JSON response
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

// Include the database connection file
include('connection.php');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the data from the POST request
    $data = $_POST;
    $user_id = isset($data['user_id']) ? $data['user_id'] : null;
    $reward_id = isset($data['reward_id']) ? $data['reward_id'] : null;
    $voucher_code = isset($data['voucher_code']) ? $data['voucher_code'] : null;

    if ($user_id && $reward_id && $voucher_code) {
        // Insert the redemption into the redemptions table
        $insert_query = "INSERT INTO redemptions (user_id, reward_id, voucher_code, redeemed_at) VALUES (?, ?, ?, NOW())";

        if ($stmt = $conn->prepare($insert_query)) {
            $stmt->bind_param("iis", $user_id, $reward_id, $voucher_code);
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Reward redemption recorded successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to insert redemption data']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare redemption query']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>
