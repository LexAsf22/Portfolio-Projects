<?php
require '../../backend/helpers.php';
require_role('student');

$reservations = $pdo->prepare("SELECT b.*, l.name as lab_name FROM bookings b JOIN labs l ON b.lab_id=l.id WHERE b.user_id=? ORDER BY start_time DESC");
$reservations->execute([$_SESSION['user']['id']]);
$reservations = $reservations->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>My Reservations</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>My Reservations</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="my_reservations.php" style="color:white;">My Reservations</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Lab</th>
            <th>Equipment IDs</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
        </tr>
        <?php foreach($reservations as $r): ?>
        <tr>
            <td><?php echo $r['id']; ?></td>
            <td><?php echo $r['lab_name']; ?></td>
            <td><?php echo $r['equipment_ids']; ?></td>
            <td><?php echo $r['start_time']; ?></td>
            <td><?php echo $r['end_time']; ?></td>
            <td><?php echo $r['status']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>