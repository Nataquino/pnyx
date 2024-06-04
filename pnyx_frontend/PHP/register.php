<?php
    include 'connection.php';
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if ($conn->connect_error) {  // we are calling the variable name 
            die("Connection failed: " . $conn->connect_error);
        }else{
            $userName = $_POST['username'];
            $userFirstName = $_POST['firstname'];
            $userLastName = $_POST['lastname'];
            $userGender = $_POST['gender'];
            $userBirthdate = $_POST['birthdate'];
            $userEmail =$_POST['email'];
            $userPassword =$_POST['password'];

            $sqlRegister = "INSERT INTO users VALUES ('$userName','$userFirstName','$userLastName','$userGender','$userBirthdate','$userEmail','$userPassword')";
            $res = mysqli_query($conn,$sqlRegister);

            if($res){
            echo 'Success';
            }else{
                echo 'Error';
            }
            $conn->close();
        }
    }
    echo 'Testing'
?>
