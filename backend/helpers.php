<?php
require 'config/database.php';

/**
 * Check if user is logged in
 */
function is_logged_in() {
    return isset($_SESSION['user']);
}

/**
 * Require user role (student, teacher, admin)
 */
function require_role($role) {
    if (!is_logged_in() || $_SESSION['user']['role'] !== $role) {
        header("Location: ../../frontend/login.php");
        exit();
    }
}

/**
 * Redirect to dashboard based on role
 */
function redirect_dashboard($role) {
    switch($role) {
        case 'student':
            header("Location: ../frontend/student/dashboard.php");
            break;
        case 'teacher':
            header("Location: ../frontend/teacher/dashboard.php");
            break;
        case 'admin':
            header("Location: ../frontend/admin/dashboard.php");
            break;
    }
}

/**
 * Fetch all labs (optional: filter by campus)
 */
function get_labs($campus_id = null) {
    global $pdo;
    if ($campus_id) {
        $stmt = $pdo->prepare("SELECT * FROM labs WHERE campus_id=?");
        $stmt->execute([$campus_id]);
    } else {
        $stmt = $pdo->query("SELECT * FROM labs");
    }
    return $stmt->fetchAll();
}

/**
 * Fetch all equipment in a lab
 */
function get_equipment($lab_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM equipment WHERE lab_id=?");
    $stmt->execute([$lab_id]);
    return $stmt->fetchAll();
}

/**
 * Create a lab booking
 */
function create_booking($user_id, $lab_id, $equipment_ids, $start_time, $end_time) {
    global $pdo;
    $equipment_csv = implode(',', $equipment_ids);
    $stmt = $pdo->prepare("INSERT INTO bookings (user_id, lab_id, equipment_ids, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'pending')");
    return $stmt->execute([$user_id, $lab_id, $equipment_csv, $start_time, $end_time]);
}

/**
 * Check equipment availability
 */
function check_equipment_availability($equipment_id, $start_time, $end_time) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE FIND_IN_SET(?, equipment_ids) AND status='approved' AND ((start_time <= ? AND end_time >= ?) OR (start_time <= ? AND end_time >= ?))");
    $stmt->execute([$equipment_id, $start_time, $start_time, $end_time, $end_time]);
    return $stmt->rowCount() === 0;
}

/**
 * Report a lab/classroom issue
 */
function create_issue($lab_id, $reporter_id, $category, $priority, $description) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO issues (lab_id, reporter_id, category, priority, status, description, reported_at) VALUES (?, ?, ?, ?, 'pending', ?, NOW())");
    return $stmt->execute([$lab_id, $reporter_id, $category, $priority, $description]);
}

/**
 * Fetch pending bookings (for admin approval)
 */
function get_pending_bookings() {
    global $pdo;
    $stmt = $pdo->query("SELECT b.*, u.name as student_name, l.name as lab_name FROM bookings b
                         JOIN users u ON b.user_id = u.id
                         JOIN labs l ON b.lab_id = l.id
                         WHERE b.status='pending' ORDER BY b.start_time DESC");
    return $stmt->fetchAll();
}

/**
 * Approve or reject booking
 */
function update_booking_status($booking_id, $status) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE bookings SET status=? WHERE id=?");
    return $stmt->execute([$status, $booking_id]);
}

/**
 * Fetch pending issues
 */
function get_pending_issues() {
    global $pdo;
    $stmt = $pdo->query("SELECT i.*, l.name as lab_name, u.name as reporter_name FROM issues i
                         JOIN labs l ON i.lab_id = l.id
                         JOIN users u ON i.reporter_id = u.id
                         WHERE i.status='pending' ORDER BY i.reported_at DESC");
    return $stmt->fetchAll();
}

/**
 * Update issue status
 */
function update_issue_status($issue_id, $status) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE issues SET status=?, resolved_at=NOW() WHERE id=?");
    return $stmt->execute([$status, $issue_id]);
}
?>