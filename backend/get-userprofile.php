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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the action from the request body
    $inputData = json_decode(file_get_contents("php://input"), true);

    // Add interest functionality
    if (isset($inputData['action']) && $inputData['action'] === 'add_interest') {
        $interest = $conn->real_escape_string($inputData['interest']); // Sanitize the interest string
    
        if (empty($interest)) {
            echo json_encode(["error" => "Interest cannot be empty"]);
            exit;
        }
    
        // Check if the interest already exists
        $sql_check_existing = "SELECT COUNT(*) FROM user_preferences WHERE user_id = ? AND category = ?";
        $stmt_check = $conn->prepare($sql_check_existing);
        $stmt_check->bind_param("is", $user_id, $interest);
        $stmt_check->execute();
        $stmt_check->bind_result($count);
        $stmt_check->fetch();
        $stmt_check->close();
    
        if ($count > 0) {
            echo json_encode(["error" => "Interest already exists"]); // Specific response for existing interest
            exit;
        }
    
        // Insert the new interest into the user_preferences table
        $sql_add_interest = "INSERT INTO user_preferences (user_id, category) VALUES (?, ?)";
        $stmt_add_interest = $conn->prepare($sql_add_interest);
    
        if (!$stmt_add_interest) {
            echo json_encode(["error" => "SQL preparation failed for insert query: " . $conn->error]);
            exit;
        }
    
        $stmt_add_interest->bind_param("is", $user_id, $interest);
        if (!$stmt_add_interest->execute()) {
            echo json_encode(["error" => "Error inserting interest: " . $stmt_add_interest->error]);
            exit;
        }
    
        if ($stmt_add_interest->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Interest added successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to add interest"]);
        }
    
        $stmt_add_interest->close();
    }
    

    // Update bio functionality
    if (isset($inputData['bio'])) {
        $newBio = $conn->real_escape_string($inputData['bio']);

        if (empty($newBio)) {
            echo json_encode(["error" => "Bio cannot be empty"]);
            exit;
        }

        // Update the bio in the database
        $sql_update = "UPDATE users SET bio = ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);

        if (!$stmt_update) {
            echo json_encode(["error" => "SQL preparation failed for update query: " . $conn->error]);
            exit;
        }

        $stmt_update->bind_param("si", $newBio, $user_id);
        $stmt_update->execute();

        if ($stmt_update->affected_rows > 0) {
            echo json_encode(["success" => true]); // Successfully updated
        } else {
            echo json_encode(["success" => false, "error" => "Failed to update bio"]);
        }

        $stmt_update->close();
    }
}

$conn->close();
?>
