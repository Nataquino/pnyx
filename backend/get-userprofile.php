<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

// GET request to fetch user information and preferences
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch user information
    $sql_user = "SELECT id, firstname, lastname, email, birthdate, gender, username, reward_points, bio FROM users WHERE id = ?";
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
}

// POST request to handle new user interest (category)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if 'action' field is set to determine the type of request
    $inputData = json_decode(file_get_contents("php://input"), true);
    if (isset($inputData['action'])) {
        if ($inputData['action'] == 'add_interest') {
            // Handle new interest addition
            if (isset($inputData['interest']) && !empty($inputData['interest'])) {
                $newInterest = $conn->real_escape_string($inputData['interest']); // Sanitize the input

                // Insert the new interest into the database (user_preferences table)
                $sql_insert_interest = "INSERT INTO user_preferences (user_id, category) VALUES (?, ?)";
                $stmt_insert_interest = $conn->prepare($sql_insert_interest);

                if (!$stmt_insert_interest) {
                    echo json_encode(["error" => "SQL preparation failed for insert interest query: " . $conn->error]);
                    exit;
                }

                $stmt_insert_interest->bind_param("is", $user_id, $newInterest);
                $stmt_insert_interest->execute();

                if ($stmt_insert_interest->affected_rows > 0) {
                    echo json_encode(["success" => true, "interest" => $newInterest]);
                } else {
                    echo json_encode(["success" => false, "error" => "Failed to add interest"]);
                }

                $stmt_insert_interest->close();
            } else {
                echo json_encode(["error" => "Interest cannot be empty"]);
            }
        }

        // Handle other actions like updating bio and uploading avatar
        // Make sure to check 'action' field for each case
    } else {
        echo json_encode(["error" => "Action not specified"]);
    }
}

// Handle file upload for avatar (this part already exists in your 

$conn->close();
?>
