<?php
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
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND is_verified = 1 ");
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
            // Set cookies for user_id and username
            setcookie('user_id', $row['id'], time() + (86400 * 30), "/"); // 30 days expiration
            setcookie('username', $row['username'], time() + (86400 * 30), "/");

            // You cannot check cookies immediately in the same request
            // So, return the user information directly from the $row
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful", 
                "user" => [
                    "user_id" => $row['id'], 
                    "username" => $row['username']
                ]
            ]);
        }
    }
    $stmt->close();
    $conn->close();
}
?>
