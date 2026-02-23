<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('student');

$user = user();
if (!$user) {
    header("Location: ../../index.php");
    exit;
}
$userId = $user['id'];

include("../includes/header.php");

$availableLabsToday = 5; // Replace with your logic to get available labs count
$activeReservations = countReservations($conn, $userId, 'Approved');
$pendingReservations = countReservations($conn, $userId, 'Pending');
?>

<style>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
}
.card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}
</style>

<h2>Student Dashboard</h2>

<div class="grid">
    <div class="card">
        <h3><?= $availableLabsToday ?></h3>
        <p>Available Labs Today</p>
    </div>

    <div class="card">
        <h3><?= $activeReservations ?></h3>
        <p>Active Reservations</p>
    </div>

    <div class="card">
        <h3><?= $pendingReservations ?></h3>
        <p>Pending Reservations</p>
    </div>
</div>

<?php include("../includes/footer.php"); ?>