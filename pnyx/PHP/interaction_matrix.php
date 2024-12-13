// Assume you've already retrieved the interaction data from the database
$interactions = [
    ['user_id' => 1, 'survey_id' => 1, 'interaction_type' => 'rated', 'rating' => 4],
    ['user_id' => 1, 'survey_id' => 2, 'interaction_type' => 'completed', 'rating' => null],
    ['user_id' => 2, 'survey_id' => 2, 'interaction_type' => 'rated', 'rating' => 5],
    // Add more interactions...
];

// Initialize an empty matrix (associative array)
$matrix = [];

// Populate the matrix
foreach ($interactions as $interaction) {
    $user_id = $interaction['user_id'];
    $survey_id = $interaction['survey_id'];
    $rating = $interaction['rating'];
    $interaction_type = $interaction['interaction_type'];

    if (!isset($matrix[$user_id])) {
        $matrix[$user_id] = [];
    }

    // You can store different types of interactions here, such as rating or completed status
    if ($interaction_type === 'rated') {
        $matrix[$user_id][$survey_id] = "Rated " . $rating;
    } elseif ($interaction_type === 'completed') {
        $matrix[$user_id][$survey_id] = "Completed";
    } else {
        $matrix[$user_id][$survey_id] = "No interaction";
    }
}

// Now $matrix holds the user-survey interaction matrix
print_r($matrix);
