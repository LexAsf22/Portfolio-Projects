<?php
include("../includes/header.php");
checkRole('teacher');

// Quick stats
$total_issues = $conn->query("SELECT * FROM issues WHERE user_id=".$_SESSION['user']['id']." AND status='Pending'")->num_rows;
$recent_reservations = $conn->query("SELECT r.*, l.lab_name FROM reservations r JOIN laboratories l ON r.lab_id=l.id ORDER BY r.date DESC LIMIT 5");
?>

<h2>Teacher Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px;">
    <div style="background:#4caf50;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Pending Issues</h3>
        <p><?php echo $total_issues; ?></p>
    </div>
    <div style="background:#f39c12;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Recent Reservations</h3>
        <p><?php echo $recent_reservations->num_rows; ?></p>
    </div>
</div>

<h3 style="margin-top:30px;">Recent Lab Reservations</h3>
<input type="text" id="searchRes" placeholder="Search by student or lab..." style="padding:10px;margin:10px 0;width:50%;">
<table id="recentTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Student</th>
<th>Lab</th>
<th>Date</th>
<th>Time Slot</th>
<th>Status</th>
</tr>
<?php while($r = $recent_reservations->fetch_assoc()){ 
    $student = $conn->query("SELECT name FROM users WHERE id=".$r['user_id'])->fetch_assoc();
?>
<tr>
    <td><?php echo $student['name']; ?></td>
    <td><?php echo $r['lab_name']; ?></td>
    <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
    <td><?php echo $r['time_slot']; ?></td>
    <td><?php echo $r['status']; ?></td>
</tr>
<?php } ?>
</table>

<script>
// Table search/filter
document.getElementById('searchRes').addEventListener('keyup', function(){
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#recentTable tr:not(:first-child)');
    rows.forEach(row=>{
        row.style.display = row.textContent.toLowerCase().includes(filter)? '':'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>