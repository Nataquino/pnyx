<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include 'connection.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if ($conn->connect_error) {  
        die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
    }

    $userName = $_POST["username"];
    $password = trim($_POST["password"]);

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $userName);

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows < 1) {
        echo json_encode(["status" => "error", "message" => "You don't have an account!"]);
    } else {
        $row = $result->fetch_assoc();
        $retrievedHashedPassword = $row['password'];
        
        // Verify the hashed password
        if (!password_verify($password, $retrievedHashedPassword)) {
            echo json_encode(["status" => "error", "message" => "Incorrect password"]);
        } else {
            // Regenerate session ID to prevent session fixation
            session_regenerate_id(true);
            
            $_SESSION['user_id'] = $row['id']; // Store user ID in session
            $_SESSION['username'] = $row['username']; // Store username in session
            
            // Successful login, send success response
            echo json_encode(["status" => "success", "message" => "Login successful"]);
        }
    }

    $stmt->close();
    $conn->close();
}
?>
