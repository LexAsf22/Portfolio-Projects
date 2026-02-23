<?php
require '../../backend/helpers.php';
require_role('student');

// Quick stats
$user_id = $_SESSION['user']['id'];
$today = date('Y-m-d');

$available_labs_today = $pdo->prepare("SELECT COUNT(*) FROM labs WHERE id NOT IN 
    (SELECT lab_id FROM bookings WHERE start_time <= ? AND end_time >= ? AND status='approved')");
$available_labs_today->execute([$today, $today]);
$available_labs_today = $available_labs_today->fetchColumn();

$active_reservations = $pdo->prepare("SELECT COUNT(*) FROM bookings WHERE user_id=? AND status='approved'");
$active_reservations->execute([$user_id]);
$active_reservations = $active_reservations->fetchColumn();

$upcoming_reservations = $pdo->prepare("SELECT b.*, l.name as lab_name FROM bookings b
    JOIN labs l ON b.lab_id=l.id
    WHERE b.user_id=? AND b.start_time >= ? ORDER BY b.start_time ASC");
$upcoming_reservations->execute([$user_id, $today]);
$upcoming_reservations = $upcoming_reservations->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Student Dashboard</title>
    <link rel="stylesheet" href="../assets/style.css">
    <style>
        body { font-family: Arial; background:#eaf4ea; color:#2a4d2a; margin:0; padding:0;}
        header { background:#2a4d2a; color:white; padding:1rem; text-align:center; }
        nav { background:#3a7d3a; padding:1rem; }
        nav a { color:white; margin-right:1rem; text-decoration:none; font-weight:bold; }
        .container { padding:2rem; }
        .card { background:white; padding:1rem; margin-bottom:1rem; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);}
        .card h3 { margin:0 0 0.5rem 0;}
        table { width:100%; border-collapse:collapse; background:white; }
        th, td { padding:10px; border:1px solid #ccc; text-align:left; }
        th { background:#d5ecd5; }
    </style>
</head>
<body>
<header>
    <h1>Student Dashboard</h1>
</header>
<nav>
    <a href="dashboard.php">Dashboard</a>
    <a href="reserve_lab.php">Reserve Lab</a>
    <a href="reserve_equipment.php">Reserve Equipment</a>
    <a href="view_computers.php">View Computers</a>
    <a href="my_reservations.php">My Reservations</a>
    <a href="../../backend/auth.php?logout=1">Logout</a>
</nav>
<div class="container">
    <div class="card">
        <h3>Available Labs Today</h3>
        <p><?php echo $available_labs_today; ?></p>
    </div>
    <div class="card">
        <h3>Active Reservations</h3>
        <p><?php echo $active_reservations; ?></p>
    </div>
    <div class="card">
        <h3>Upcoming Reservations</h3>
        <table>
            <tr>
                <th>Lab</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
            </tr>
            <?php foreach($upcoming_reservations as $r): ?>
            <tr>
                <td><?php echo $r['lab_name']; ?></td>
                <td><?php echo $r['start_time']; ?></td>
                <td><?php echo $r['end_time']; ?></td>
                <td><?php echo $r['status']; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>
</div>
</body>
</html>