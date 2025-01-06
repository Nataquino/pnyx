<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

$userId = intval($data['userId']);
$surveyId = intval($data['surveyId']);
$feedbackScore = intval($data['feedbackScore']);

// Fetch survey categories
$sql_categories = "
    SELECT sc.category_name 
    FROM survey_categories sc 
    WHERE sc.survey_id = ?";
$stmt_categories = $conn->prepare($sql_categories);
$stmt_categories->bind_param("i", $surveyId);
$stmt_categories->execute();
$result_categories = $stmt_categories->get_result();

$categories = [];
while ($row = $result_categories->fetch_assoc()) {
    $categories[] = $row['category_name'];
}
$stmt_categories->close();

if (!empty($categories)) {
    foreach ($categories as $category) {
        // Increment preference_strength based on feedback score
        $sql_update = "
            INSERT INTO user_preferences (user_id, category, preference_strength)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                preference_strength = preference_strength + ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("isii", $userId, $category, $feedbackScore, $feedbackScore);
        $stmt_update->execute();
        $stmt_update->close();
    }
}

echo json_encode(["success" => true, "message" => "Preferences updated successfully"]);
$conn->close();
?>
