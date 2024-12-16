<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';  // Database connection
require 'vendor/autoload.php';  // Load PHPMailer using Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userName = $_POST['username'];
    $userFirstName = $_POST['firstname'];
    $userLastName = $_POST['lastname'];
    $userGender = $_POST['gender'];
    $userBirthdate = $_POST['birthdate'];
    $userEmail = $_POST['email'];
    $userPassword = $_POST['password'];
    $hashedPassword = password_hash($userPassword, PASSWORD_BCRYPT);

    // Generate a 6-digit OTP
    $otp = random_int(100000, 999999);

    // Insert the user into the database
    $sqlRegister = "INSERT INTO users (username, firstname, lastname, gender, birthdate, email, password, otp, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)";
    $stmt = $conn->prepare($sqlRegister);
    $stmt->bind_param("ssssssss", $userName, $userFirstName, $userLastName, $userGender, $userBirthdate, $userEmail, $hashedPassword, $otp);

    if ($stmt->execute()) {
        // Get the last inserted ID (user_id)
        $userId = $conn->insert_id;

        // Set cookies for user_id, username, and email
        setcookie("user_id", $userId, time() + (86400 * 30), "/", "localhost", true, false);  // Expires in 30 days
        setcookie("username", $userName, time() + (86400 * 30), "/", "localhost", true, false); // Expires in 30 days
        setcookie("email", $userEmail, time() + (86400 * 30), "/", "localhost", true, false); // Expires in 30 days

        // Send the OTP via email
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'localhost';  // Mailhog
            $mail->Port = 1025;

            // Recipients
            $mail->setFrom('your_email@example.com', 'Survey App');
            $mail->addAddress($userEmail, $userFirstName);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Your OTP for Email Verification';
            $mail->Body    = "Hi $userFirstName, <br> Your OTP for verifying your account is: <strong>$otp</strong>";

            $mail->send();
            http_response_code(200);
            echo json_encode(['message' => 'Registration successful. Please check your email for the OTP.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'OTP could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Registration failed']);
    }

    $stmt->close();
    $conn->close();
}
?>
