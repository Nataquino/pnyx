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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch all user interactions for surveys
$sql = "SELECT user_id, survey_id, rating FROM survey_interactions";
$result = $conn->query($sql);

$user_interactions = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $user_interactions[$row['survey_id']][$row['user_id']] = $row['rating'];
    }
} else {
    echo json_encode(["message" => "No interactions found"]);
    exit;
}

// Calculate similarity between each pair of surveys
$survey_ids = array_keys($user_interactions);
$survey_similarities = [];

for ($i = 0; $i < count($survey_ids); $i++) {
    for ($j = $i + 1; $j < count($survey_ids); $j++) {
        $survey_id_1 = $survey_ids[$i];
        $survey_id_2 = $survey_ids[$j];

        // Get ratings for both surveys
        $ratings_1 = $user_interactions[$survey_id_1] ?? [];
        $ratings_2 = $user_interactions[$survey_id_2] ?? [];

        // Find common users who interacted with both surveys
        $common_users = array_intersect_key($ratings_1, $ratings_2);

        if (count($common_users) > 0) {
            // Calculate Cosine Similarity
            $dot_product = 0;
            $sum_square_1 = 0;
            $sum_square_2 = 0;

            foreach ($common_users as $user_id => $rating_1) {
                $rating_2 = $ratings_2[$user_id];
                $dot_product += $rating_1 * $rating_2;
                $sum_square_1 += $rating_1 * $rating_1;
                $sum_square_2 += $rating_2 * $rating_2;
            }

            $similarity_score = $dot_product / (sqrt($sum_square_1) * sqrt($sum_square_2));

            // Prepare the data for inserting into survey_similarities
            $survey_similarities[] = [
                'survey_id_1' => $survey_id_1,
                'survey_id_2' => $survey_id_2,
                'similarity_score' => $similarity_score
            ];
        }
    }
}

// Insert similarity scores into survey_similarities table
foreach ($survey_similarities as $similarity) {
    $stmt = $conn->prepare("INSERT INTO survey_similarities (survey_id_1, survey_id_2, similarity_score) VALUES (?, ?, ?)");
    $stmt->bind_param("iid", $similarity['survey_id_1'], $similarity['survey_id_2'], $similarity['similarity_score']);
    if (!$stmt->execute()) {
        echo json_encode(["error" => "Error inserting similarity: " . $stmt->error]);
        exit;
    }
}

echo json_encode(["message" => "Item similarities calculated and inserted successfully"]);

$conn->close();
?>
