<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch notifications for a specific user (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ensure the user_id is fetched securely
    $user_id = $_COOKIE['user_id'] ?? null;

    if ($user_id) {
        $sql = "SELECT n.notif_message, n.notif_date, n.notif_status, n.survey_id, s.title AS survey_title
        FROM notification n
        JOIN surveys s ON n.survey_id = s.id
        WHERE n.user_id = ?
        ORDER BY n.notif_date DESC";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $user_id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $notifications = [];

            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }

            echo json_encode($notifications);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error executing query: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "User ID is required"]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
