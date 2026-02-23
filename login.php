<?php
// index.php
include("backend/config/database.php");
include("backend/config/auth.php");

// Redirect logged-in users
if(isLoggedIn()){
    $role = $_SESSION['role'] ?? '';
    if($role=="student") {
        header("Location: frontend/student/dashboard.php");
        exit;
    } elseif($role=="teacher") {
        header("Location: frontend/teacher/dashboard.php");
        exit;
    } elseif($role=="admin") {
        header("Location: frontend/admin/dashboard.php");
        exit;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Campus Laboratory System</title>
    <style>
        body { font-family: Arial; background: #f4f6f9; text-align: center; }
        .container { max-width: 500px; margin: 80px auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);}
        h1 { margin-bottom: 20px; }
        .buttons a {
            display: block;
            margin: 10px 0;
            padding: 12px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .buttons a:hover { background: #2980b9; }
    </style>
</head>
<body>

<div class="container">
    <h1>Welcome to the Campus Laboratory System</h1>
    <p>Manage lab reservations, equipment, and maintenance efficiently.</p>

    <div class="buttons">
        <a href="login.php">Login</a>
        <a href="register.php">Register</a>
    </div>
</div>

</body>
</html>