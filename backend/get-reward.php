<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

require 'connection.php';

$sql = "SELECT * FROM rewards";
$result = $conn->query($sql);

$rewards = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rewards[] = $row;
    }
}

echo json_encode($rewards);
$conn->close();
?>
