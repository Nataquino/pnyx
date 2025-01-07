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

// Check if the request is a POST request (for assigning points)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the data from the POST request (surveyId and points)
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['surveyId']) && isset($data['points'])) {
        $surveyId = $data['surveyId'];
        $points = $data['points'];

        // Prepare the SQL query to update the points for the given survey
        $sql = "UPDATE surveys SET survey_pts = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $points, $surveyId); // Bind integer values (points and surveyId)

        if ($stmt->execute()) {
            echo json_encode(["message" => "Points assigned successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error assigning points: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data. Survey ID and points are required."]);
    }
} else {
    // If it's not a POST request, assume it's a GET request to fetch pending surveys
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

// Close the database connection
$conn->close();
?>
