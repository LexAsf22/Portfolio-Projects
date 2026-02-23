<?php
require '../../backend/helpers.php';
require_role('teacher');

$issues = $pdo->prepare("SELECT i.*, l.name as lab_name FROM issues i JOIN labs l ON i.lab_id=l.id WHERE reporter_id=? ORDER BY reported_at DESC");
$issues->execute([$_SESSION['user']['id']]);
$issues = $issues->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>My Reported Issues</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>My Reported Issues</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="issue_status.php" style="color:white;">Issue Status</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Lab</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reported At</th>
        </tr>
        <?php foreach($issues as $i): ?>
        <tr>
            <td><?php echo $i['id']; ?></td>
            <td><?php echo $i['lab_name']; ?></td>
            <td><?php echo $i['category']; ?></td>
            <td><?php echo $i['priority']; ?></td>
            <td><?php echo $i['status']; ?></td>
            <td><?php echo $i['reported_at']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>