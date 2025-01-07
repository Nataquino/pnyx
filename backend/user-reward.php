<?php
// Set headers for JSON response
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

// Include the database connection file
include('connection.php');

// Start the response
$response = [];

// Get the user_id from cookies
if (isset($_COOKIE['user_id'])) {
    $user_id = $_COOKIE['user_id'];

    // Prepare the SQL query to fetch the required data
    $query = "
        SELECT 
            r.name AS reward_name,
            r.description AS reward_description,
            ur.voucher_code,
            ur.expiry_date
        FROM 
            user_rewards ur
        INNER JOIN 
            rewards r
        ON 
            ur.reward_id = r.id
        WHERE 
            ur.user_id = ?
    ";

    // Prepare and execute the query
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $user_id); // Bind the user_id as an integer
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if any records were returned
        if ($result->num_rows > 0) {
            $rewards = [];
            while ($row = $result->fetch_assoc()) {
                $rewards[] = [
                    'name' => $row['reward_name'],
                    'description' => $row['reward_description'],
                    'voucher_code' => $row['voucher_code'],
                    'expiry_date' => $row['expiry_date'],
                ];
            }
            $response = [
                'success' => true,
                'rewards' => $rewards,
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'No rewards found for the user.',
            ];
        }

        $stmt->close();
    } else {
        $response = [
            'success' => false,
            'message' => 'Failed to prepare the database query.',
        ];
    }
} else {
    $response = [
        'success' => false,
        'message' => 'User not logged in.',
    ];
}

// Close the database connection
$conn->close();

// Output the JSON response
echo json_encode($response);
?>
