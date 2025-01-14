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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id'], $data['action'])) {
        $id = $conn->real_escape_string($data['id']);
        $action = $conn->real_escape_string($data['action']);
        $comment = isset($data['comment']) ? $conn->real_escape_string($data['comment']) : null;

        // Fetch user_id associated with the survey
        $surveyQuery = "SELECT user_id FROM surveys WHERE id = '$id'";
        $surveyResult = $conn->query($surveyQuery);

        if ($surveyResult->num_rows > 0) {
            $survey = $surveyResult->fetch_assoc();
            $user_id = $survey['user_id'];

            // Prepare notification data
            $notif_date = date('Y-m-d H:i:s');
            $notif_status = 'unseen';

            if ($action === 'approve') {
                $sql = "UPDATE surveys SET status = 'approved' WHERE id = '$id'";
                if ($conn->query($sql) === TRUE) {
                    $notif_message = "Your survey has been approved!";
                    $notifSql = "INSERT INTO notification (survey_id, user_id, notif_message, notif_date, notif_status)
                                 VALUES ('$id', '$user_id', '$notif_message', '$notif_date', '$notif_status')";
                    if ($conn->query($notifSql) === TRUE) {
                        echo json_encode(["message" => "Survey approved and notification sent."]);
                    } else {
                        echo json_encode(["error" => "Error inserting notification: " . $conn->error]);
                    }
                } else {
                    echo json_encode(["error" => "Error updating survey: " . $conn->error]);
                }
            } elseif ($action === 'decline') {
                $sql = "UPDATE surveys SET status = 'declined', comment = '$comment' WHERE id = '$id'";
                if ($conn->query($sql) === TRUE) {
                    $notif_message = "Your survey has been declined. Comment: $comment";
                    $notifSql = "INSERT INTO notification (survey_id, user_id, notif_message, notif_date, notif_status)
                                 VALUES ('$id', '$user_id', '$notif_message', '$notif_date', '$notif_status')";
                    if ($conn->query($notifSql) === TRUE) {
                        echo json_encode(["message" => "Survey declined and notification sent."]);
                    } else {
                        echo json_encode(["error" => "Error inserting notification: " . $conn->error]);
                    }
                } else {
                    echo json_encode(["error" => "Error updating survey: " . $conn->error]);
                }
            } else {
                echo json_encode(["error" => "Invalid action"]);
            }
        } else {
            echo json_encode(["error" => "Survey not found"]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

$conn->close();
?>