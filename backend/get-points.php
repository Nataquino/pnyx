<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

// Check if the user is authenticated (assuming you're storing user ID in the session or cookies)
if ($_SERVER["REQUEST_METHOD"] == "GET") {
$user_id = $_COOKIE['user_id']; // Replace with $_COOKIE['user_id'] if using cookies

try {
    $stmt = $pdo->prepare("SELECT reward_points, account_energy FROM users WHERE id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

} catch (PDOException $e) {
    // Handle any database errors
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
}
?>
