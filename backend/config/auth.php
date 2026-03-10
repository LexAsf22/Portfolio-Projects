<?php
session_start();

/**
 * Redirect to login if the user is not authenticated.
 * Call this at the top of any protected page.
 */
function checkLogin() {
    if (!isset($_SESSION['user'])) {
        header("Location: ../../login.php");
        exit;
    }
}

/**
 * Ensure the logged-in user has one of the allowed roles.
 * Accepts a single role string or an array of allowed roles.
 *
 * Usage:
 *   checkRole('admin');
 *   checkRole(['admin', 'teacher']);
 */
function checkRole($roles) {
    checkLogin();

    $allowed = is_array($roles) ? $roles : [$roles];

    if (!in_array($_SESSION['user']['role'], $allowed, true)) {
        // User is logged in but doesn't have permission — send to their own dashboard
        redirectToDashboard();
    }
}

/**
 * Redirect an already-logged-in user away from guest-only pages
 * (e.g. index.php, login.php, register.php).
 * Call this at the top of those pages.
 */
function redirectIfLoggedIn() {
    if (isset($_SESSION['user'])) {
        redirectToDashboard();
    }
}

/**
 * Send the current user to their role-specific dashboard.
 */
function redirectToDashboard() {
    $role = $_SESSION['user']['role'] ?? '';

    $dashboards = [
        'student' => '../../student/dashboard.php',
        'teacher' => '../../teacher/dashboard.php',
        'admin'   => '../../admin/dashboard.php',
    ];

    $destination = $dashboards[$role] ?? '../../login.php';
    header("Location: " . $destination);
    exit;
}

/**
 * Return the current logged-in user array, or null if not logged in.
 */
function getCurrentUser() {
    return $_SESSION['user'] ?? null;
}

/**
 * Return the role of the current user, or null if not logged in.
 */
function getCurrentRole() {
    return $_SESSION['user']['role'] ?? null;
}
?>