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

    // Send the OTP via email before inserting the user into the database
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'mail.pnyx-surveys.com';  // Outgoing mail server
        $mail->SMTPAuth = true;
        $mail->Username = 'nathan@pnyx-surveys.com';  // Use your updated email address
        $mail->Password = 'nathan102908?';  // Use your email account’s password
        $mail->SMTPSecure = 'ssl';  // SSL encryption
        $mail->Port = 465;  // Port 465 for SSL

        $mail->setFrom('nathan@pnyx-surveys.com', 'Pnyx Surveys'); // Replace with your sender details
        $mail->addAddress($userEmail, $userFirstName);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your OTP for Email Verification';
        $mail->Body = "Hi $userFirstName,<br><br>Your OTP for verifying your account is: <strong>$otp</strong><br><br>Thank you,<br>Pnyx Surveys";

        // Attempt to send the email
        if (!$mail->send()) {
            throw new Exception('Message body empty');
        }

        // If email is sent successfully, insert the user into the database
        $sqlRegister = "INSERT INTO users (username, firstname, lastname, gender, birthdate, email, password, otp, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)";
        $stmt = $conn->prepare($sqlRegister);
        $stmt->bind_param("ssssssss", $userName, $userFirstName, $userLastName, $userGender, $userBirthdate, $userEmail, $hashedPassword, $otp);

        if ($stmt->execute()) {
            // Get the last inserted ID (user_id)
            $userId = $conn->insert_id;

            // Set cookies for user_id, username, and email
            setcookie("user_id", $userId, time() + (86400 * 30), "/");  // Expires in 30 days
            setcookie("username", $userName, time() + (86400 * 30), "/"); // Expires in 30 days
            setcookie("email", $userEmail, time() + (86400 * 30), "/"); // Expires in 30 days

            http_response_code(200);
            echo json_encode(['message' => 'Registration successful. Please check your email for the OTP.']);
        } else {
            error_log("Database Error: " . $stmt->error);
            http_response_code(500);
            echo json_encode(['message' => 'Registration failed.']);
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // If the OTP email fails to send, return an error without inserting the user
        error_log("Mailer Error: " . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(['message' => 'Registration failed, OTP email could not be sent: ' . $mail->ErrorInfo]);
    }
}
?>
