<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");
requireRole('admin');

$totalReservations = $conn->query("SELECT COUNT(*) as total FROM reservations")->fetch_assoc()['total'];
$totalApproved = $conn->query("SELECT COUNT(*) as total FROM reservations WHERE status='Approved'")->fetch_assoc()['total'];
$totalIssues = $conn->query("SELECT COUNT(*) as total FROM issues")->fetch_assoc()['total'];
?>

<!DOCTYPE html>
<html>
<head>
<title>Reports & Analytics</title>
<style>
body{font-family:Arial;background:#f4f6f9;padding:20px;}
.card{
background:white;padding:20px;margin:10px 0;
border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.1);
}
</style>
</head>
<body>

<h2>System Reports</h2>

<div class="card">
<h3>Total Reservations</h3>
<?=$totalReservations;?>
</div>

<div class="card">
<h3>Approved Reservations</h3>
<?=$totalApproved;?>
</div>

<div class="card">
<h3>Total Issues Reported</h3>
<?=$totalIssues;?>
</div>

</body>
</html>