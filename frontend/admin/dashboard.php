<?php
include("../includes/header.php");
checkRole('admin');

// Stats
$total_reservations = $conn->query("SELECT * FROM reservations")->num_rows;
$total_pending = $conn->query("SELECT * FROM reservations WHERE status='Pending'")->num_rows;
$total_issues = $conn->query("SELECT * FROM issues")->num_rows;
?>

<h2>Admin Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px;">
    <div style="background:#4caf50;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Total Reservations</h3>
        <p><?php echo $total_reservations; ?></p>
    </div>
    <div style="background:#f39c12;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Pending Approvals</h3>
        <p><?php echo $total_pending; ?></p>
    </div>
    <div style="background:#e74c3c;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Reported Issues</h3>
        <p><?php echo $total_issues; ?></p>
    </div>
</div>

<script>
// Example JS: auto refresh stats every 60 seconds
setInterval(() => {
    location.reload();
}, 60000);
</script>

<?php
include("../includes/footer.php");
?>