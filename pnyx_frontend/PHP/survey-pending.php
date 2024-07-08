<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

include 'connection.php';

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, title, description FROM surveys WHERE status = 'pending'";
    $result = $conn->query($sql);

    $surveys = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $surveys[] = $row;
        }
        echo json_encode($surveys);
    } else {
        echo json_encode(["message" => "No surveys found"]);
    }
}


// Handle POST request to update survey status
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['action'])) {
        $id = $conn->real_escape_string($data['id']);
        $action = $conn->real_escape_string($data['action']);
        $comment = isset($data['comment']) ? $conn->real_escape_string($data['comment']) : null;

        if ($action === 'approve') {
            $sql = "UPDATE surveys SET status = 'approved' WHERE id = '$id'";
        } elseif ($action === 'decline') {
            $sql = "UPDATE surveys SET status = 'declined', comment = '$comment' WHERE id = '$id'";
        } else {
            echo json_encode(["error" => "Invalid action"]);
            exit;
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Survey updated successfully"]);
        } else {
            echo json_encode(["error" => "Error updating survey: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}

echo 'testing connection...';

$conn->close();
?>