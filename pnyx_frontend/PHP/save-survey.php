<?php
    header('Access-Control-Allow-Origin:*');
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        if($conn -> connect_error){
            die('Connection Failed: '. $conn -> connect_error);
        } else {
            ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);
            
            try {

                // Debug: Log the incoming data
                $rawData = file_get_contents('php://input');
                error_log("Raw input data: " . $rawData);

                $data = json_decode($rawData, true);
                if (!$data) {
                    throw new Exception("No data received or invalid JSON.");
                }

                // Debug: Log the decoded data
                error_log("Decoded data: " . print_r($data, true));


                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) {
                    throw new Exception("No data received or invalid JSON.");
                }

                $servername = "localhost"; // Change to your database server name
                $username = "root"; // Change to your database username
                $password = ""; // Change to your database password
                $dbname = "samplePnyx"; // Change to your database name

                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $conn->beginTransaction();
                $inTransaction = true;
            
                $stmt = $conn->prepare("INSERT INTO surveys (title, description) VALUES (:title, :description)");
                $stmt->bindParam(':title', $data['title']);
                $stmt->bindParam(':description', $data['description']);
                $stmt->execute();
                $survey_id = $conn->lastInsertId();
            
                error_log("Survey ID: " . $survey_id);

                foreach ($data['questions'] as $question) {
                    $stmt = $conn->prepare("INSERT INTO questions (survey_id, question_text, question_type) VALUES (:survey_id, :question_text, :question_type)");
                    $stmt->bindParam(':survey_id', $survey_id);
                    $stmt->bindParam(':question_text', $question['text']);
                    $stmt->bindParam(':question_type', $question['type']);
                    $stmt->execute();
                    $question_id = $conn->lastInsertId();

                    error_log("Question ID: " . $question_id);
            
                    if (isset($question['options']) && in_array($question['type'], ['multiple_choice', 'checkbox'])) {
                        foreach ($question['options'] as $option) {
                            $stmt = $conn->prepare("INSERT INTO options (question_id, option_text) VALUES (:question_id, :option_text)");
                            $stmt->bindParam(':question_id', $question_id);
                            $stmt->bindParam(':option_text', $option);
                            $stmt->execute();
                        }
                    }
                }
                $conn->commit();
                $inTransaction = false;
                echo "Survey saved successfully!";
            } catch (Exception $e) {
                if (isset($inTransaction) && $inTransaction) {
                    $conn->rollBack();
                }
                http_response_code(500);
                echo "Failed to save survey: " . $e->getMessage();
                error_log("Failed to save survey: " . $e->getMessage());
            }
        }
    }
?>
