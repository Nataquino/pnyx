<?php

session_start();
session_unset();
session_destroy();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
?>
