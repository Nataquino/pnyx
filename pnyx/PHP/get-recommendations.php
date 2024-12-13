<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';

// Get user_id from cookie
if (isset($_COOKIE['user_id'])) {
    $user_id = $_COOKIE['user_id'];
} else {
    echo json_encode(["error" => "User ID is not set in cookie"]);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the user's interactions with surveys
$sql = "SELECT survey_id, rating FROM survey_interactions WHERE user_id = $user_id";
$result = $conn->query($sql);
$user_ratings = [];
while ($row = $result->fetch_assoc()) {
    $user_ratings[$row['survey_id']] = $row['rating'];
}

// Retrieve the survey-survey similarity matrix from the database (or compute it beforehand)
$sql_similarities = "SELECT survey_id_1, survey_id_2, similarity_score FROM survey_similarities";
$similarities_result = $conn->query($sql_similarities);

$survey_similarities = [];
while ($row = $similarities_result->fetch_assoc()) {
    $survey_similarities[$row['survey_id_1']][$row['survey_id_2']] = $row['similarity_score'];
}

// Generate recommendations based on the ratings and similarities
$recommendations = [];
foreach ($user_ratings as $survey_id => $rating) {
    if ($rating > 0) { // Only consider surveys the user has interacted with
        // Check if similarities for this survey exist
        if (isset($survey_similarities[$survey_id])) {
            // Find similar surveys and compute a weighted recommendation score
            foreach ($survey_similarities[$survey_id] as $similar_survey_id => $similarity_score) {
                if (!isset($user_ratings[$similar_survey_id])) { // Only recommend surveys not already rated
                    if (!isset($recommendations[$similar_survey_id])) {
                        $recommendations[$similar_survey_id] = 0;
                    }
                    $recommendations[$similar_survey_id] += $rating * $similarity_score;
                }
            }
        }
    }
}

// Sort recommendations by score
arsort($recommendations);

// Fetch recommended surveys
$recommended_survey_ids = array_keys(array_slice($recommendations, 0, 5)); // Get top 5 recommended surveys
$recommended_surveys = [];
foreach ($recommended_survey_ids as $survey_id) {
    $sql_survey = "SELECT id, title, description FROM surveys WHERE id = $survey_id";
    $survey_result = $conn->query($sql_survey);
    if ($survey_result->num_rows > 0) {
        $recommended_surveys[] = $survey_result->fetch_assoc();
    }
}

// Fetch all surveys (recommended and non-recommended)
$sql_all_surveys = "SELECT id, title, description FROM surveys WHERE status = 'approved' AND user_id != $user_id";
$all_surveys_result = $conn->query($sql_all_surveys);
$all_surveys = [];

while ($row = $all_surveys_result->fetch_assoc()) {
    $all_surveys[] = $row;
}

// Sort the surveys: Recommended surveys at the top
$final_surveys = array_merge($recommended_surveys, $all_surveys);

// Close connection
$conn->close();

// Output the surveys in the desired order
echo json_encode($final_surveys);
?>
