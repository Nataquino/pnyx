<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "samplePnyx";

try {
    // Create connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Begin transaction
    $conn->beginTransaction();

    // Insert survey data
    $stmt = $conn->prepare("INSERT INTO surveys (title, description) VALUES (:title, :description)");
    $stmt->bindParam(':title', $_POST['title']);
    $stmt->bindParam(':description', $_POST['description']);
    $stmt->execute();
    $survey_id = $conn->lastInsertId();

    // Insert questions
    foreach ($_POST['questions'] as $question) {
        $stmt = $conn->prepare("INSERT INTO questions (survey_id, question_text, question_type) VALUES (:survey_id, :question_text, :question_type)");
        $stmt->bindParam(':survey_id', $survey_id);
        $stmt->bindParam(':question_text', $question['text']);
        $stmt->bindParam(':question_type', $question['type']);
        $stmt->execute();
        $question_id = $conn->lastInsertId();

        // Insert options if applicable
        if (isset($question['options']) && in_array($question['type'], ['multiple_choice', 'checkbox'])) {
            foreach ($question['options'] as $option) {
                $stmt = $conn->prepare("INSERT INTO options (question_id, option_text) VALUES (:question_id, :option_text)");
                $stmt->bindParam(':question_id', $question_id);
                $stmt->bindParam(':option_text', $option['text']);
                $stmt->execute();
            }
        }
    }

    // Commit transaction
    $conn->commit();
    echo "Survey saved successfully!";
} catch (Exception $e) {
    // Rollback transaction in case of error
    $conn->rollBack();
    echo "Failed to save survey: " . $e->getMessage();
}

$conn = null;
?>
