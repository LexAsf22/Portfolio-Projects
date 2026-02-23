<?php
session_start();
if(isset($_SESSION['user'])){
    // Redirect based on role
    switch($_SESSION['user']['role']){
        case 'student': header("Location: student/dashboard.php"); break;
        case 'teacher': header("Location: teacher/dashboard.php"); break;
        case 'admin': header("Location: admin/dashboard.php"); break;
    }
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>College Lab & Classroom Management System</title>
    <style>
        body { font-family: Arial; background:#eaf4ea; margin:0; padding:0;}
        .header { background:#2a4d2a; color:white; padding:2rem; text-align:center; }
        .container { display:flex; justify-content:center; align-items:center; height:70vh; gap:2rem; }
        .role-box { background:white; padding:2rem; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); width:200px; text-align:center;}
        .role-box a { text-decoration:none; background:#3a7d3a; color:white; padding:0.5rem 1rem; border-radius:5px; display:inline-block; margin-top:1rem;}
    </style>
</head>
<body>
<div class="header">
    <h1>College Laboratory & Classroom Management System</h1>
    <p>Manage lab reservations, classroom issues, and campus resources efficiently.</p>
    <p>Campus Coverage: Campus A / Campus B</p>
</div>
<div class="container">
    <div class="role-box">
        <h2>Student</h2>
        <a href="login.php?role=student">Login</a>
    </div>
    <div class="role-box">
        <h2>Teacher</h2>
        <a href="login.php?role=teacher">Login</a>
    </div>
    <div class="role-box">
        <h2>Admin</h2>
        <a href="login.php?role=admin">Login</a>
    </div>
</div>
</body>
</html>