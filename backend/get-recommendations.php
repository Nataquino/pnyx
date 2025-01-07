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
$sql_preferences = "SELECT category, preference_strength FROM user_preferences WHERE user_id = ?";
$stmt_preferences = $conn->prepare($sql_preferences);
$stmt_preferences->bind_param("i", $user_id);
$stmt_preferences->execute();
$result_preferences = $stmt_preferences->get_result();

$user_preferences = [];
while ($row = $result_preferences->fetch_assoc()) {
    $user_preferences[$row['category']] = $row['preference_strength'];
}
$stmt_preferences->close();

// Get user interactions (surveys the user has already interacted with)
$sql_interactions = "SELECT survey_id, rating FROM survey_interactions WHERE user_id = ?";
$stmt_interactions = $conn->prepare($sql_interactions);
$stmt_interactions->bind_param("i", $user_id);
$stmt_interactions->execute();
$result_interactions = $stmt_interactions->get_result();

$user_ratings = [];
while ($row = $result_interactions->fetch_assoc()) {
    $user_ratings[$row['survey_id']] = $row['rating'];
}
$stmt_interactions->close();

// Retrieve survey-survey similarities
$sql_similarities = "SELECT survey_id_1, survey_id_2, similarity_score FROM survey_similarities";
$similarities_result = $conn->query($sql_similarities);

$survey_similarities = [];
while ($row = $similarities_result->fetch_assoc()) {
    $survey_similarities[$row['survey_id_1']][$row['survey_id_2']] = $row['similarity_score'];
}

// Generate recommendations based on user interactions and preferences
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

// Fetch recommended surveys with categories from `survey_categories`
$weighted_recommendations = [];
if (!empty($recommendations)) {
    $placeholders = implode(',', array_fill(0, count($recommendations), '?'));
    $sql_recommended = "
        SELECT s.id, s.title, s.description, sc.category_name, s.is_locked
        FROM surveys s
        LEFT JOIN survey_categories sc ON s.id = sc.survey_id
        WHERE s.id IN ($placeholders)";
    $stmt_recommended = $conn->prepare($sql_recommended);

    $stmt_recommended->bind_param(str_repeat('i', count($recommendations)), ...array_keys($recommendations));
    $stmt_recommended->execute();
    $result_recommended = $stmt_recommended->get_result();

    while ($row = $result_recommended->fetch_assoc()) {
        $survey_id = $row['id'];
        $category = $row['category_name'];
        $base_score = $recommendations[$survey_id] ?? 0;

        // Apply preference weight
        $preference_weight = $user_preferences[$category] ?? 1; // Default to 1 if no preference
        $final_score = $base_score * $preference_weight;

        $row['weighted_score'] = $final_score;
        $weighted_recommendations[$survey_id] = $row; // Use survey ID as key to avoid duplicates
    }
    $stmt_recommended->close();

    // Sort recommendations by weighted_score in descending order
    usort($weighted_recommendations, function ($a, $b) {
        return $b['weighted_score'] <=> $a['weighted_score'];
    });
}

// Fetch all activated surveys excluding the user's own surveys and surveys they have interacted with
$sql_all_surveys = "
    SELECT s.id, s.title, s.description, sc.category_name, s.is_locked
    FROM surveys s
    LEFT JOIN survey_categories sc ON s.id = sc.survey_id
    WHERE s.status = 'activated' AND s.user_id != ? AND s.id NOT IN (SELECT survey_id FROM survey_interactions WHERE user_id = ?)";
$stmt_all = $conn->prepare($sql_all_surveys);
$stmt_all->bind_param("ii", $user_id, $user_id); // Exclude surveys the user has interacted with
$stmt_all->execute();
$all_surveys_result = $stmt_all->get_result();

$all_surveys = [];
while ($row = $all_surveys_result->fetch_assoc()) {
    $all_surveys[$row['id']] = $row; // Use survey ID as key to avoid duplicates
}
$stmt_all->close();

// Combine and deduplicate surveys
$final_surveys = [];
$seen_ids = [];
foreach (array_merge($weighted_recommendations, $all_surveys) as $survey) {
    if (!in_array($survey['id'], $seen_ids)) {
        $final_surveys[] = $survey;
        $seen_ids[] = $survey['id'];
    }
}

// Output the surveys, including the `is_locked` field for frontend to check passcode status
echo json_encode($final_surveys);
$conn->close();
?>
