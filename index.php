<?php
session_start();
// If already logged in, redirect based on role
if(isset($_SESSION['user'])){
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
    <title>College Laboratory & Classroom Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #eaf4ea;
            margin: 0;
            padding: 0;
        }
        .header {
            background: #2a4d2a;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
            gap: 2rem;
            flex-wrap: wrap;
        }
        .role-box {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            width: 200px;
            text-align: center;
            transition: transform 0.2s;
        }
        .role-box:hover {
            transform: scale(1.05);
        }
        .role-box h2 {
            color: #2a4d2a;
            margin-bottom: 1rem;
        }
        .role-box a {
            text-decoration: none;
            background: #3a7d3a;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            display: inline-block;
            margin-top: 1rem;
            font-weight: bold;
        }
        footer {
            text-align: center;
            padding: 1rem;
            background: #d5ecd5;
            color: #2a4d2a;
        }
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

    <footer>
        &copy; <?php echo date("Y"); ?> College Laboratory & Classroom Management System
    </footer>
</body>
</html>