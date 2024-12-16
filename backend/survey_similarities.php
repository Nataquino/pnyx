<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';


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

            // Avoid division by zero
            if ($sum_square_1 > 0 && $sum_square_2 > 0) {
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
}

// Insert similarity scores into survey_similarities table
foreach ($survey_similarities as $similarity) {
    // Check if similarity already exists
    $check_sql = "SELECT COUNT(*) AS count FROM survey_similarities WHERE (survey_id_1 = ? AND survey_id_2 = ?) OR (survey_id_1 = ? AND survey_id_2 = ?)";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param(
        "iiii", 
        $similarity['survey_id_1'], 
        $similarity['survey_id_2'], 
        $similarity['survey_id_2'], 
        $similarity['survey_id_1']
    );
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    $row = $check_result->fetch_assoc();

    if ($row['count'] == 0) {
        // Insert similarity
        $stmt = $conn->prepare("INSERT INTO survey_similarities (survey_id_1, survey_id_2, similarity_score) VALUES (?, ?, ?)");
        $stmt->bind_param("iid", $similarity['survey_id_1'], $similarity['survey_id_2'], $similarity['similarity_score']);
        if (!$stmt->execute()) {
            echo json_encode(["error" => "Error inserting similarity: " . $stmt->error]);
            exit;
        }
    }
}
$conn->close();

?>
