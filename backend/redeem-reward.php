<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php';  // Database connection

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['reward_id'])) {
    echo json_encode(["success" => false, "message" => "Missing reward_id"]);
    exit();
}

$reward_id = $data['reward_id'];

// Start transaction
$conn->begin_transaction();

try {
    // Check if the reward exists and has sufficient stock
    $reward_query = $conn->prepare("SELECT id, name, stock, points_required, voucher_code FROM rewards WHERE id = ? FOR UPDATE");
    $reward_query->bind_param("i", $reward_id);
    $reward_query->execute();
    $result = $reward_query->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Reward not found"]);
        $conn->rollback();
        exit();
    }

    $reward = $result->fetch_assoc();

    if ($reward['stock'] <= 0) {
        echo json_encode(["success" => false, "message" => "Reward out of stock"]);
        $conn->rollback();
        exit();
    }

    // Use the existing voucher code
    $voucher_code = $reward['voucher_code'];

    // Decrement stock by 1
    $update_stock_query = $conn->prepare("UPDATE rewards SET stock = stock - 1 WHERE id = ?");
    $update_stock_query->bind_param("i", $reward_id);
    $update_stock_query->execute();

    // Insert redemption record (if you have a redemptions table)
    $user_id = 1; // Replace with the actual user ID, e.g., from session or JWT
    $insert_redemption_query = $conn->prepare("
        INSERT INTO redemptions (user_id, reward_id, voucher_code, redeemed_at)
        VALUES (?, ?, ?, NOW())
    ");
    $insert_redemption_query->bind_param("iis", $user_id, $reward_id, $voucher_code);
    $insert_redemption_query->execute();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Reward redeemed successfully",
        "voucher_code" => $voucher_code
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

// Close connection
$conn->close();
?>
