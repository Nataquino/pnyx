<?php
    header('Access-Control-Allow-Origin: *');
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Include your database connection code here
    
    include 'connection.php';
    session_start();

    if ($conn->connect_error) {  // we are calling the variable name 
        die("Connection failed: " . $conn->connect_error);
    }


    $userName = $_POST["username"];
    $password = $_POST["password"];

    // Insert data into the database
    $sqlverifyuser = "SELECT * FROM users WHERE username = '$userName' AND password = '$password'";
    $result = mysqli_query($conn, $sqlverifyuser);
    $anything_found = mysqli_num_rows($result);

    $sqlUserID = " SELECT * FROM users Where username = '$userName'";
    $resultID = mysqli_query($conn,$sqlUserID);
    $row = $resultID->fetch_assoc();
    $_SESSION['UserID'] = $row['UserID'];
    $_SESSION['Username'] = $row['Username'];
    
    if(strtolower($userName) === 'admin' && strtolower($password) === 'admin') {
        header('Location: /HighTech/adminDashboard/index.php');
    }elseif ($anything_found < 1) {
        $conn->close();
        echo "You don't have an account!";
    }else {
        if ($conn->query($sqlverifyuser) == TRUE) {
            header('Location: /home');
        } else {
            echo "Error: " . $sqlverifyuser . "<br>" . $conn->error;
        }
        $conn->close();
    }
}
?>