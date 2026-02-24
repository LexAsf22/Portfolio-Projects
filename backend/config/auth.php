<?php
// backend/config/auth.php
session_start();

// Check if user is logged in
function checkLogin() {
    if(!isset($_SESSION['user'])) {
        header("Location: ../../login.php");
        exit;
    }
}

// Check user role
function checkRole($role) {
    if($_SESSION['user']['role'] != $role) {
        header("Location: ../../dashboard.php");
        exit;
    }
}

// Logout function
function logout() {
    session_destroy();
    header("Location: ../../index.php");
    exit;
}
?>