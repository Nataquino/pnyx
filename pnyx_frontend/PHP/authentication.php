<?php
session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');



include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check for connection errors
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
            // Set session variables
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];

            // Debugging: check if session variables are set correctly
            if(isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
                echo json_encode(["status" => "success", "message" => "Login successful", "user" => $_SESSION]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to set session variables"]);
            }
        }
    }
    $stmt->close();
    $conn->close();
}
