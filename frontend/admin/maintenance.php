<?php
require '../../backend/helpers.php';
require_role('admin');

$pending_issues = get_pending_issues();

// Update status
if(isset($_GET['action'], $_GET['id'])) {
    $status = $_GET['action']; // pending, in_progress, done
    update_issue_status($_GET['id'], $status);
    header("Location: maintenance.php"); exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance Requests</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Maintenance Requests</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="maintenance.php" style="color:white;">Maintenance</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Lab</th>
            <th>Reporter</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        <?php foreach($pending_issues as $i): ?>
        <tr>
            <td><?php echo $i['id']; ?></td>
            <td><?php echo $i['lab_name']; ?></td>
            <td><?php echo $i['reporter_name']; ?></td>
            <td><?php echo $i['category']; ?></td>
            <td><?php echo $i['priority']; ?></td>
            <td><?php echo $i['status']; ?></td>
            <td>
                <a href="?action=in_progress&id=<?php echo $i['id']; ?>">In Progress</a> |
                <a href="?action=done&id=<?php echo $i['id']; ?>">Done</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>