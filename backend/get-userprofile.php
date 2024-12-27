<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php'; // Ensure your connection file has the correct database credentials

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Check if the user_id cookie is set
if (!isset($_COOKIE['user_id'])) {
    echo json_encode(["error" => "User ID cookie not found"]);
    exit;
}

$user_id = intval($_COOKIE['user_id']); // Sanitize the user ID

// Fetch user information
$sql_user = "SELECT id, firstname,lastname, email, username, reward_points, bio FROM users WHERE id = ?";
$stmt_user = $conn->prepare($sql_user);

if (!$stmt_user) {
    echo json_encode(["error" => "SQL preparation failed for user query: " . $conn->error]);
    exit;
}

// Bind parameters and execute the statement for user info
$stmt_user->bind_param("i", $user_id);
$stmt_user->execute();
$result_user = $stmt_user->get_result();

if ($result_user->num_rows === 0) {
    echo json_encode(["error" => "User not found"]);
    $stmt_user->close();
    $conn->close();
    exit;
}

$newBio = $conn->real_escape_string($inputData['bio']);

if (empty($new_bio)) {
    echo json_encode(["error" => "Bio cannot be empty"]);
    exit;
}


$sql_update = "UPDATE users SET bio = ? WHERE id = ?";
$stmt_update = $conn->prepare($sql_update);

if (!$stmt_update) {
    echo json_encode(["error" => "SQL preparation failed for update query: " . $conn->error]);
    exit;
}

if ($stmt_update->execute()) {
    // Successfully updated bio
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error updating bio: " . $conn->error]);
}




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the new bio from the request body
    $inputData = json_decode(file_get_contents("php://input"), true);
    $newBio = $conn->real_escape_string($inputData['bio']);
    $user_id = intval($_COOKIE['user_id']); // Assume user_id is passed in a cookie

    // Update the bio in the database
    $sql_update = "UPDATE users SET bio = ? WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("si", $newBio, $user_id);
    $stmt_update->execute();

    if ($stmt_update->affected_rows > 0) {
        echo json_encode(["success" => true]); // Successfully updated
    } else {
        echo json_encode(["success" => false, "error" => "Failed to update bio"]);
    }

    $stmt_update->close();
}









$user = $result_user->fetch_assoc();

// Fetch user preferences
$sql_preferences = "SELECT category FROM user_preferences WHERE user_id = ?";
$stmt_preferences = $conn->prepare($sql_preferences);

if (!$stmt_preferences) {
    echo json_encode(["error" => "SQL preparation failed for preferences query: " . $conn->error]);
    exit;
}

// Bind parameters and execute the statement for preferences
$stmt_preferences->bind_param("i", $user_id);
$stmt_preferences->execute();
$result_preferences = $stmt_preferences->get_result();

$preferences = [];
while ($row = $result_preferences->fetch_assoc()) {
    $preferences[] = $row['category']; // Add each category to the preferences array
}

// Combine user information with preferences
$response = [
    "user" => $user,
    "preferences" => $preferences,
];

// Return the combined data as JSON
echo json_encode($response);

$stmt_user->close();
$stmt_preferences->close();
$conn->close();
?>
