<?php
require 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email=? AND role=?");
    $stmt->execute([$email, $role]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user;
        redirect_dashboard($user['role']);
    } else {
        $_SESSION['login_error'] = "Invalid credentials!";
        header("Location: ../../frontend/login.php?role=$role");
        exit();
    }
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: ../../frontend/index.php");
    exit();
}
?>