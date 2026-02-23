<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('teacher');
include("../includes/header.php");

$userId = user()['id'];

$totalIssues = $conn->query("SELECT COUNT(*) as total FROM issues WHERE user_id='$userId'")
                     ->fetch_assoc()['total'];

$pendingIssues = $conn->query("SELECT COUNT(*) as total FROM issues WHERE user_id='$userId' AND status='Pending'")
                       ->fetch_assoc()['total'];

$totalReservations = $conn->query("SELECT COUNT(*) as total FROM reservations")
                           ->fetch_assoc()['total'];
?>

<style>
.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:15px;
}
.card{
    background:white;
    padding:20px;
    border-radius:10px;
    box-shadow:0 3px 8px rgba(0,0,0,0.08);
}
</style>

<h2>Teacher Dashboard</h2>

<div class="grid">

<div class="card">
<h3><?=$totalIssues?></h3>
<p>Total Issues Reported</p>
</div>

<div class="card">
<h3><?=$pendingIssues?></h3>
<p>Pending Issues</p>
</div>

<div class="card">
<h3><?=$totalReservations?></h3>
<p>Total Lab Reservations</p>
</div>

</div>

<?php include("../includes/footer.php"); ?>