<?php
session_start();
if(isset($_SESSION['user'])){
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Campus System</title>
    <style>
        body {font-family: Arial; margin:0; background:#ecf0f1;}
        header {background:#2c5f2e; color:white; padding:30px; text-align:center;}
        .container {padding:50px; text-align:center;}
        .btn {
            padding:15px 30px;
            margin:10px;
            background:#4caf50;
            color:white;
            border:none;
            text-decoration:none;
            font-size:16px;
            border-radius:5px;
            cursor:pointer;
        }
        .btn:hover {background:#3e8e41;}
        footer {background:#2c5f2e; color:white; text-align:center; padding:10px;}
    </style>
</head>
<body>

<header>
    <h1>Campus Laboratory & Classroom Management System</h1>
    <p>Manage labs, equipment, and reservations efficiently</p>
</header>

<div class="container">
    <h2>Login As</h2>
    <button class="btn" onclick="goLogin('student')">Student</button>
    <button class="btn" onclick="goLogin('teacher')">Teacher</button>
    <button class="btn" onclick="goLogin('admin')">Admin</button>
</div>

<footer>&copy; 2026 Campus System</footer>

<script>
// JS redirect
function goLogin(role){
    window.location.href = "login.php?role=" + role;
}
</script>

</body>
</html>