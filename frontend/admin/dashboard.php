<?php
require '../../backend/helpers.php';
require_role('admin');

// Fetch stats
$total_labs = $pdo->query("SELECT COUNT(*) FROM labs")->fetchColumn();
$pending_bookings = $pdo->query("SELECT COUNT(*) FROM bookings WHERE status='pending'")->fetchColumn();
$pending_issues = $pdo->query("SELECT COUNT(*) FROM issues WHERE status='pending'")->fetchColumn();
$equipment_alerts = $pdo->query("SELECT COUNT(*) FROM equipment WHERE status='maintenance' OR status='reserved'")->fetchColumn();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../assets/style.css">
    <style>
        body { font-family: Arial; background-color: #eaf4ea; color: #2a4d2a; margin:0; padding:0; }
        header { background: #2a4d2a; color: white; padding: 1rem; text-align:center; }
        nav { background: #3a7d3a; padding: 1rem; }
        nav a { color: white; margin-right: 1rem; text-decoration:none; font-weight:bold; }
        .container { padding: 2rem; }
        .card { background: white; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
        .card h3 { margin:0 0 0.5rem 0;}
    </style>
</head>
<body>
<header>
    <h1>Admin Dashboard</h1>
</header>
<nav>
    <a href="dashboard.php">Dashboard</a>
    <a href="approvals.php">Approve Bookings</a>
    <a href="inventory.php">Inventory</a>
    <a href="maintenance.php">Maintenance</a>
    <a href="reports.php">Reports</a>
    <a href="../../backend/auth.php?logout=1">Logout</a>
</nav>
<div class="container">
    <div class="card">
        <h3>Total Labs</h3>
        <p><?php echo $total_labs; ?></p>
    </div>
    <div class="card">
        <h3>Pending Bookings</h3>
        <p><?php echo $pending_bookings; ?></p>
    </div>
    <div class="card">
        <h3>Pending Maintenance Requests</h3>
        <p><?php echo $pending_issues; ?></p>
    </div>
    <div class="card">
        <h3>Equipment Alerts (Reserved/Maintenance)</h3>
        <p><?php echo $equipment_alerts; ?></p>
    </div>
</div>
</body>
</html>