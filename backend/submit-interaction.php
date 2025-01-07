<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'connection.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $data['userId'] ?? null;
    $surveyId = $data['surveyId'] ?? null;
    $interactionType = $data['interactionType'] ?? null;
    $rating = $data['rating'] ?? null;

    if (!$surveyId || !$userId || !$interactionType || is_null($rating)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input data."]);
        exit();
    }

    // Step 1: Insert the interaction into the survey_interactions table
    $stmt = $conn->prepare("INSERT INTO survey_interactions (user_id, survey_id, interaction_type, rating, interaction_date) VALUES (?, ?, ?, ?, NOW())");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("iisi", $userId, $surveyId, $interactionType, $rating);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Error recording interaction: " . $stmt->error]);
        exit();
    }

    $stmt->close();

    // Step 2: Deduct 20 energy from the user
    $updateEnergyStmt = $conn->prepare("UPDATE users SET energy = energy - 20 WHERE id = ?");
    if (!$updateEnergyStmt) {
        http_response_code(500);
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $updateEnergyStmt->bind_param("i", $userId);
    if (!$updateEnergyStmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Error deducting energy: " . $updateEnergyStmt->error]);
        exit();
    }
    $updateEnergyStmt->close();

    // Step 3: Add reward points based on the survey's survey_pts
    $getSurveyPtsStmt = $conn->prepare("SELECT survey_pts FROM surveys WHERE id = ?");
    if (!$getSurveyPtsStmt) {
        http_response_code(500);
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $getSurveyPtsStmt->bind_param("i", $surveyId);
    $getSurveyPtsStmt->execute();
    $surveyPtsResult = $getSurveyPtsStmt->get_result();

    if ($surveyPtsRow = $surveyPtsResult->fetch_assoc()) {
        $surveyPts = $surveyPtsRow['survey_pts'];

        $updateRewardStmt = $conn->prepare("UPDATE users SET reward_points = reward_points + ? WHERE id = ?");
        if (!$updateRewardStmt) {
            http_response_code(500);
            echo json_encode(["message" => "Prepare failed: " . $conn->error]);
            exit();
        }
        $updateRewardStmt->bind_param("ii", $surveyPts, $userId);
        if (!$updateRewardStmt->execute()) {
            http_response_code(500);
            echo json_encode(["message" => "Error adding reward points: " . $updateRewardStmt->error]);
            exit();
        }
        $updateRewardStmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Survey not found."]);
        exit();
    }
    $getSurveyPtsStmt->close();

    // Step 4: Get categories associated with the current survey
    $sql = "SELECT category_name FROM survey_category WHERE survey_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["message" => "Prepare failed: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("i", $surveyId);
    $stmt->execute();
    $result = $stmt->get_result();

    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['category_name'];
    }

    // Step 5: Update the user's preference_strength for each category only if rating is greater than 2
    if ($rating > 2) {
        foreach ($categories as $category) {
            $updateStmt = $conn->prepare("INSERT INTO user_preferences (user_id, category, preference_strength) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE preference_strength = preference_strength + 1");

            if (!$updateStmt) {
                http_response_code(500);
                echo json_encode(["message" => "Prepare failed: " . $conn->error]);
                exit();
            }

            $updateStmt->bind_param("is", $userId, $category);

            if (!$updateStmt->execute()) {
                http_response_code(500);
                echo json_encode(["message" => "Error updating preference strength: " . $updateStmt->error]);
                exit();
            }

            $updateStmt->close();
        }
    }

    echo json_encode(["message" => "Interaction recorded, energy deducted, reward points added, and preferences updated successfully."]);

} else {
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method."]);
}

$conn->close();
?>
