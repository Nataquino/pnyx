<?php

session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

include 'connection.php'; // Assuming this includes your database connection info

// Get survey ID from query parameter and validate it
$surveyId = isset($_GET['id']) && is_numeric($_GET['id']) ? intval($_GET['id']) : null;

if (!$surveyId) {
    echo json_encode(['error' => 'Survey ID is required']);
    exit();
}

// Query to get all responses along with the question text for the given survey ID
$sql = "
    SELECT sr.question_id, q.question_text, q.question_type, sr.answer, sr.sentiment_score
    FROM survey_responses sr
    JOIN questions q ON sr.question_id = q.id
    WHERE sr.survey_id = ?
";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit();
}

$stmt->bind_param("i", $surveyId);
$stmt->execute();
$result = $stmt->get_result();

// Check if any results are returned
if ($result->num_rows === 0) {
    echo json_encode(['message' => 'No responses found for the given survey']);
    exit();
}

// Prepare arrays to store survey data
$responses = [
    'paragraph_answers' => [],
    'multiple_choice_stats' => [],
    'feedback_sentiments' => []
];

// Process each row and classify by question type
while ($row = $result->fetch_assoc()) {
    $questionId = $row['question_id'];
    $questionText = $row['question_text'];
    $questionType = $row['question_type'];
    $answer = $row['answer'];
    $sentimentScore = $row['sentiment_score'];

    switch ($questionType) {
        case 'paragraph':
            $responses['paragraph_answers'][] = [
                'question_text' => $questionText,
                'answer' => $answer
            ];
            break;
        case 'multiple_choice':
            // Initialize or update the count for each option
            if (!isset($responses['multiple_choice_stats'][$questionId])) {
                $responses['multiple_choice_stats'][$questionId] = [
                    'question_text' => $questionText,
                    'options' => []
                ];
            }
            if (!isset($responses['multiple_choice_stats'][$questionId]['options'][$answer])) {
                $responses['multiple_choice_stats'][$questionId]['options'][$answer] = 0;
            }
            $responses['multiple_choice_stats'][$questionId]['options'][$answer]++;
            break;
        case 'feedback':
            // Collect sentiment scores and feedback answers
            if (!isset($responses['feedback_sentiments'][$questionId])) {
                $responses['feedback_sentiments'][$questionId] = [
                    'question_text' => $questionText,
                    'total_score' => 0,
                    'count' => 0,
                    'feedback' => [] // Initialize feedback array
                ];
            }
            $responses['feedback_sentiments'][$questionId]['total_score'] += $sentimentScore;
            $responses['feedback_sentiments'][$questionId]['count']++;
            // Store the feedback answer
            $responses['feedback_sentiments'][$questionId]['feedback'][] = $answer;
            break;
    }
}

// Calculate average sentiment for feedback questions
foreach ($responses['feedback_sentiments'] as $questionId => $data) {
    $averageSentiment = $data['count'] > 0
        ? $data['total_score'] / $data['count']
        : 0;

    // Convert average sentiment to descriptive text
    $responses['feedback_sentiments'][$questionId]['average_sentiment'] = $averageSentiment;
    $responses['feedback_sentiments'][$questionId]['descriptive_sentiment'] = $averageSentiment < 0.5 ? 'Negative' : 'Positive';
}

// Send response
echo json_encode($responses);

$stmt->close();
$conn->close();
?>
