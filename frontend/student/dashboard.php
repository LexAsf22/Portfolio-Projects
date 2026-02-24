<?php
include("../includes/header.php");
checkRole('student');

// Quick stats
$available_labs = $conn->query("SELECT * FROM laboratories")->num_rows;
$active_reservations = $conn->query("SELECT * FROM reservations WHERE user_id=".$_SESSION['user']['id']." AND status='Approved'")->num_rows;
$upcoming = $conn->query("SELECT * FROM reservations WHERE user_id=".$_SESSION['user']['id']." AND date >= CURDATE() ORDER BY date ASC LIMIT 5");
?>

<h2>Student Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px;">
    <div style="background:#4caf50;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Available Labs</h3>
        <p><?php echo $available_labs; ?></p>
    </div>
    <div style="background:#f39c12;color:white;padding:20px;flex:1;border-radius:5px;">
        <h3>Active Reservations</h3>
        <p><?php echo $active_reservations; ?></p>
    </div>
</div>

<h3 style="margin-top:30px;">Upcoming Reservations</h3>
<table id="upcomingTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Lab</th>
<th>Date</th>
<th>Time Slot</th>
<th>Status</th>
</tr>
<?php while($r = $upcoming->fetch_assoc()){ 
    $lab = $conn->query("SELECT lab_name FROM laboratories WHERE id=".$r['lab_id'])->fetch_assoc();
?>
<tr>
    <td><?php echo $lab['lab_name']; ?></td>
    <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
    <td><?php echo $r['time_slot']; ?></td>
    <td><?php echo $r['status']; ?></td>
</tr>
<?php } ?>
</table>

<script>
// Simple search/filter for upcoming reservations
const searchInput = document.createElement('input');
searchInput.placeholder = "Search reservations...";
searchInput.style = "padding:10px;margin:10px 0;width:50%;";
document.querySelector('h3').after(searchInput);

searchInput.addEventListener('keyup', function(){
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#upcomingTable tr:not(:first-child)');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>