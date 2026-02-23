<?php
require '../../backend/helpers.php';
require_role('admin');

$pending_bookings = get_pending_bookings();

// Approve/Reject handler
if(isset($_GET['action'], $_GET['id'])) {
    $status = ($_GET['action'] === 'approve') ? 'approved' : 'rejected';
    update_booking_status($_GET['id'], $status);
    header("Location: approvals.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Approve Lab Bookings</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Approve Lab Bookings</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="approvals.php" style="color:white;">Approve Bookings</a>
</nav>
<div style="padding:2rem;">
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Student</th>
            <th>Lab</th>
            <th>Equipment IDs</th>
            <th>Start</th>
            <th>End</th>
            <th>Action</th>
        </tr>
        <?php foreach($pending_bookings as $b): ?>
        <tr>
            <td><?php echo $b['id']; ?></td>
            <td><?php echo $b['student_name']; ?></td>
            <td><?php echo $b['lab_name']; ?></td>
            <td><?php echo $b['equipment_ids']; ?></td>
            <td><?php echo $b['start_time']; ?></td>
            <td><?php echo $b['end_time']; ?></td>
            <td>
                <a href="?action=approve&id=<?php echo $b['id']; ?>">Approve</a> |
                <a href="?action=reject&id=<?php echo $b['id']; ?>">Reject</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>