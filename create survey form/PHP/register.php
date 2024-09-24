<?php
header('Access-Control-Allow-Origin: *');
include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        $userName = $_POST['username'];
        $userFirstName = $_POST['firstname'];
        $userLastName = $_POST['lastname'];
        $userGender = $_POST['gender'];
        $userBirthdate = $_POST['birthdate'];
        $userEmail = $_POST['email'];
        $userPassword = $_POST['password'];

        // Hash the password using bcrypt
        $hashedPassword = password_hash($userPassword, PASSWORD_BCRYPT);

        $sqlRegister = "INSERT INTO users (username, firstname, lastname, gender, birthdate, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sqlRegister);
        $stmt->bind_param("sssssss", $userName, $userFirstName, $userLastName, $userGender, $userBirthdate, $userEmail, $hashedPassword);
        
        if ($stmt->execute()) {
            echo 'Success';
        } else {
            echo 'Error';
        }
        
        $stmt->close();
        $conn->close();
    }
}
?>
