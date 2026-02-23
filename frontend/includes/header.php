<?php
if(!isset($role)) $role = $_SESSION['user']['role'] ?? '';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?php echo ucfirst($role) ?: 'College Lab System'; ?></title>
    <style>
        body { font-family: Arial; background:#eaf4ea; color:#2a4d2a; margin:0; padding:0;}
        header { background:#2a4d2a; color:white; padding:1rem; text-align:center; }
        nav { background:#3a7d3a; padding:1rem; }
        nav a { color:white; margin-right:1rem; text-decoration:none; font-weight:bold; }
        .container { padding:2rem; }
        .card { background:white; padding:1rem; margin-bottom:1rem; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);}
        table { width:100%; border-collapse:collapse; background:white; }
        th, td { padding:10px; border:1px solid #ccc; text-align:left; }
        th { background:#d5ecd5; }
        button { padding:0.5rem 1rem; background:#3a7d3a; color:white; border:none; border-radius:5px; cursor:pointer; }
    </style>
</head>
<body>
<header>
    <h1>College Laboratory & Classroom Management System</h1>
</header>
<nav>
<?php if(isset($_SESSION['user'])): ?>
    <?php if($_SESSION['user']['role'] == 'student'): ?>
        <a href="student/dashboard.php">Dashboard</a>
        <a href="student/reserve_lab.php">Reserve Lab</a>
        <a href="student/reserve_equipment.php">Reserve Equipment</a>
        <a href="student/view_computers.php">View Computers</a>
        <a href="student/my_reservations.php">My Reservations</a>
    <?php elseif($_SESSION['user']['role'] == 'teacher'): ?>
        <a href="teacher/dashboard.php">Dashboard</a>
        <a href="teacher/lab_usage.php">Lab Usage</a>
        <a href="teacher/report_issue.php">Report Issue</a>
        <a href="teacher/issue_status.php">Issue Status</a>
    <?php elseif($_SESSION['user']['role'] == 'admin'): ?>
        <a href="admin/dashboard.php">Dashboard</a>
        <a href="admin/approvals.php">Approve Bookings</a>
        <a href="admin/inventory.php">Inventory</a>
        <a href="admin/maintenance.php">Maintenance</a>
        <a href="admin/reports.php">Reports</a>
    <?php endif; ?>
    <a href="backend/auth.php?logout=1">Logout</a>
<?php else: ?>
    <a href="index.php">Home</a>
<?php endif; ?>
</nav>
<div class="container">