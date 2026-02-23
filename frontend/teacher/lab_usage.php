<?php
require '../../backend/helpers.php';
require_role('teacher');

// Example: Lab usage stats
$lab_usage = $pdo->query("SELECT l.name as lab_name, COUNT(b.id) as total_bookings 
                          FROM labs l LEFT JOIN bookings b ON l.id=b.lab_id AND b.status='approved'
                          GROUP BY l.id")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Lab Usage Monitoring</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Lab Usage Monitoring</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="lab_usage.php" style="color:white;">Lab Usage</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>Lab</th>
            <th>Total Approved Bookings</th>
        </tr>
        <?php foreach($lab_usage as $l): ?>
        <tr>
            <td><?php echo $l['lab_name']; ?></td>
            <td><?php echo $l['total_bookings']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>