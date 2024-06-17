<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    
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
        
        // For debugging: Send the retrieved hashed password in the response
        $retrievedHashedPassword = $row['password'];
        // Verify the hashed password
        if (!password_verify($password, $retrievedHashedPassword)) {
            echo json_encode(["status" => "error", "message" => "Incorrect password", "retrieved_password" => $retrievedHashedPassword , $password]);
        } else {
            $_SESSION['id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            // Successful login, send success response
            echo json_encode(["status" => "success", "message" => "Login successful"]);
        }
    }

    $stmt->close();
    $conn->close();
}
?>
