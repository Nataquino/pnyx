<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($data['userId']) && isset($data['otp'])) {
        $userId = $data['userId'];  // Get the user ID from the request body
        $otp = $data['otp'];  // Get the OTP from the request body

        // Prepare and execute the SQL query to check OTP
        $sql = "SELECT otp FROM users WHERE id = ? AND otp = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $userId, $otp);  // 'i' for integer, 's' for string
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Update user as verified
            $updateSql = "UPDATE users SET is_verified = 1 WHERE id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("i", $userId);
            $updateStmt->execute();
            $updateStmt->close();

            echo json_encode(['message' => 'Email verified successfully']);
        } else {
            echo json_encode(['message' => 'Invalid OTP']);
        }

        $stmt->close();
    } else {
        // Required data not found, return an error
        http_response_code(400);
        echo json_encode(['message' => 'User ID or OTP not provided.']);
    }

    $conn->close();
}
?>
