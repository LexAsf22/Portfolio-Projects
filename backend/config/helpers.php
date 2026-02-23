<?php
// backend/config/helpers.php

// Escape output safely
if (!function_exists('e')) {
    function e($string) {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}

// Example: other helper functions can go below
function statusBadge($status) {
    $colors = [
        "Pending" => "orange",
        "Approved" => "green",
        "Rejected" => "red"
    ];
    $color = $colors[$status] ?? "gray";
    return "<span style='color:$color; font-weight:bold;'>$status</span>";
}

function countReservations($conn, $userId, $status=null){
    if (!$userId) return 0; // Early return if no user ID

    $sql = "SELECT COUNT(*) as total FROM reservations WHERE user_id = ?";
    if ($status) {
        $sql .= " AND status = ?";
    }

    if ($status) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $userId, $status);
    } else {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
    }
    $stmt->execute();
    $res = $stmt->get_result();
    $count = 0;
    if ($row = $res->fetch_assoc()) {
        $count = $row['total'];
    }
    $stmt->close();
    return $count;
}