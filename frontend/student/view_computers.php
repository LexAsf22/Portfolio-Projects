<?php
require '../../backend/helpers.php';
require_role('student');

$computers = $pdo->query("SELECT * FROM equipment WHERE type='computer'")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Available Computers</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Available Computers</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="view_computers.php" style="color:white;">View Computers</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Name</th>
            <th>Lab</th>
            <th>Status</th>
        </tr>
        <?php foreach($computers as $c): ?>
        <tr>
            <td><?php echo $c['id']; ?></td>
            <td><?php echo $c['name']; ?></td>
            <td><?php 
                $lab = $pdo->prepare("SELECT name FROM labs WHERE id=?"); 
                $lab->execute([$c['lab_id']]); 
                echo $lab->fetchColumn();
            ?></td>
            <td><?php echo $c['status']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>