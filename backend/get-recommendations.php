<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';
include 'survey_similarities.php';

// Get user_id from cookie
if (isset($_COOKIE['user_id'])) {
    $user_id = intval($_COOKIE['user_id']); // Ensure $user_id is sanitized
} else {
    echo json_encode(["error" => "User ID is not set in cookie"]);
    exit;
}

// Database connection check
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get user preferences
$sql_preferences = "SELECT category FROM user_preferences WHERE user_id = ?";
$stmt_preferences = $conn->prepare($sql_preferences);
$stmt_preferences->bind_param("i", $user_id);
$stmt_preferences->execute();
$result_preferences = $stmt_preferences->get_result();

$user_preferences = [];
while ($row = $result_preferences->fetch_assoc()) {
    $user_preferences[] = $row['category'];
}
$stmt_preferences->close();

// Ensure user preferences are available
if (empty($user_preferences)) {
    echo json_encode(["error" => "No preferences found for the user"]);
    exit;
}

// Fetch surveys matching user preferences
$placeholders = implode(',', array_fill(0, count($user_preferences), '?'));
$sql_surveys = "
    SELECT s.id, s.title, s.description, sc.category_name, s.is_locked, s.survey_pts
    FROM surveys s
    LEFT JOIN survey_categories sc ON s.id = sc.survey_id
    WHERE sc.category_name IN ($placeholders) 
      AND s.status = 'activated' 
      AND s.user_id != ? 
      AND s.id NOT IN (SELECT survey_id FROM survey_interactions WHERE user_id = ?)";
$stmt_surveys = $conn->prepare($sql_surveys);

// Combine user preferences and bind them to the query
$types = str_repeat('s', count($user_preferences)) . 'ii';
$params = array_merge($user_preferences, [$user_id, $user_id]);
$stmt_surveys->bind_param($types, ...$params);
$stmt_surveys->execute();
$result_surveys = $stmt_surveys->get_result();

$filtered_surveys = [];
while ($row = $result_surveys->fetch_assoc()) {
    $filtered_surveys[] = $row;
}
$stmt_surveys->close();

// Output the filtered surveys
echo json_encode($filtered_surveys);
$conn->close();
?>
