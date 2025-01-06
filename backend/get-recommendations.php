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

// Get user interactions
$sql = "SELECT survey_id, rating FROM survey_interactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$user_ratings = [];
while ($row = $result->fetch_assoc()) {
    $user_ratings[$row['survey_id']] = $row['rating'];
}
$stmt->close();

if (empty($user_ratings)) {
    // If no interactions exist, fetch all activated surveys excluding those created by the user
    $sql_all_surveys = "SELECT id, title, description FROM surveys WHERE status = 'activated' AND user_id != ?";
    $stmt_all = $conn->prepare($sql_all_surveys);
    $stmt_all->bind_param("i", $user_id);
    $stmt_all->execute();
    $all_surveys_result = $stmt_all->get_result();

    $all_surveys = [];
    while ($row = $all_surveys_result->fetch_assoc()) {
        $all_surveys[] = $row;
    }
    $stmt_all->close();

    // Output fallback surveys directly
    echo json_encode($all_surveys);
    $conn->close();
    exit;
}

// Retrieve survey-survey similarities
$sql_similarities = "SELECT survey_id_1, survey_id_2, similarity_score FROM survey_similarities";
$similarities_result = $conn->query($sql_similarities);

$survey_similarities = [];
while ($row = $similarities_result->fetch_assoc()) {
    $survey_similarities[$row['survey_id_1']][$row['survey_id_2']] = $row['similarity_score'];
}

// Generate recommendations based on user interactions
$recommendations = [];
foreach ($user_ratings as $survey_id => $rating) {
    if ($rating > 0 && isset($survey_similarities[$survey_id])) {
        foreach ($survey_similarities[$survey_id] as $similar_survey_id => $similarity_score) {
            if (!isset($user_ratings[$similar_survey_id])) {
                $recommendations[$similar_survey_id] = ($recommendations[$similar_survey_id] ?? 0) + $rating * $similarity_score;
            }
        }
    }
}

arsort($recommendations);
$recommended_survey_ids = array_keys(array_slice($recommendations, 0, 5));

// Fetch recommended surveys
$recommended_surveys = [];
if (!empty($recommended_survey_ids)) {
    $placeholders = implode(',', array_fill(0, count($recommended_survey_ids), '?'));
    $sql_recommended = "SELECT id, title, description FROM surveys WHERE id IN ($placeholders)";
    $stmt_recommended = $conn->prepare($sql_recommended);

    $stmt_recommended->bind_param(str_repeat('i', count($recommended_survey_ids)), ...$recommended_survey_ids);
    $stmt_recommended->execute();
    $result_recommended = $stmt_recommended->get_result();

    while ($row = $result_recommended->fetch_assoc()) {
        $recommended_surveys[] = $row;
    }
    $stmt_recommended->close();
}

// Fetch all activated surveys excluding the user's own surveys
$sql_all_surveys = "SELECT id, title, description FROM surveys WHERE status = 'activated' AND user_id != ?";
$stmt_all = $conn->prepare($sql_all_surveys);
$stmt_all->bind_param("i", $user_id);
$stmt_all->execute();
$all_surveys_result = $stmt_all->get_result();

$all_surveys = [];
while ($row = $all_surveys_result->fetch_assoc()) {
    $all_surveys[] = $row;
}
$stmt_all->close();

// Combine recommended surveys with all activated surveys
$final_surveys = array_unique(
    array_merge($recommended_surveys, $all_surveys),
    SORT_REGULAR
);

// Output the surveys
echo json_encode(array_values($final_surveys));
$conn->close();
?>
