<?php
require '../../backend/helpers.php';
require_role('admin');

// Example: Daily booking counts
$daily_bookings = $pdo->query("SELECT DATE(start_time) as day, COUNT(*) as total FROM bookings GROUP BY DATE(start_time)")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reports & Analytics</title>
    <link rel="stylesheet" href="../assets/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Reports & Analytics</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="reports.php" style="color:white;">Reports</a>
</nav>
<div style="padding:2rem; background:#eaf4ea;">
    <canvas id="dailyBookingsChart" width="600" height="300"></canvas>
</div>
<script>
const ctx = document.getElementById('dailyBookingsChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [<?php foreach($daily_bookings as $d){ echo "'".$d['day']."',"; } ?>],
        datasets: [{
            label: 'Bookings per Day',
            data: [<?php foreach($daily_bookings as $d){ echo $d['total'].','; } ?>],
            backgroundColor: 'rgba(42,77,42,0.7)'
        }]
    },
    options: { responsive: true }
});
</script>
</body>
</html>