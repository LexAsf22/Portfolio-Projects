<?php
// backend/api/check_availability.php
include("../config/auth.php");
include("../config/database.php");

checkLogin();

header('Content-Type: application/json');

$lab_id    = (int)   ($_GET['lab_id']   ?? 0);
$date      =          $_GET['date']     ?? '';
$time_slot =          $_GET['time_slot'] ?? '';

if (!$lab_id || !$date || !$time_slot) {
    echo json_encode(['available' => true]);
    exit;
}

$stmt = $conn->prepare("
    SELECT id FROM reservations
    WHERE lab_id = ? AND date = ? AND time_slot = ? AND status != 'Rejected'
");
$stmt->bind_param("iss", $lab_id, $date, $time_slot);
$stmt->execute();
$stmt->store_result();

echo json_encode(['available' => $stmt->num_rows === 0]);