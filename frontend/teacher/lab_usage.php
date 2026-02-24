<?php
include("../includes/header.php");
checkRole('teacher');

// Fetch lab usage
$usage = $conn->query("SELECT r.*, u.name as student_name, l.lab_name 
    FROM reservations r 
    JOIN users u ON r.user_id=u.id 
    JOIN laboratories l ON r.lab_id=l.id 
    WHERE r.status='Approved' 
    ORDER BY r.date DESC LIMIT 50");
?>

<h2>Lab Usage Monitoring</h2>

<input type="text" id="searchLab" placeholder="Search by lab or student..." style="padding:10px;margin:10px 0;width:50%;">
<table id="usageTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Student</th>
<th>Lab</th>
<th>Date</th>
<th>Time Slot</th>
</tr>
<?php while($u = $usage->fetch_assoc()){ ?>
<tr>
    <td><?php echo $u['student_name']; ?></td>
    <td><?php echo $u['lab_name']; ?></td>
    <td><?php echo date("F d, Y", strtotime($u['date'])); ?></td>
    <td><?php echo $u['time_slot']; ?></td>
</tr>
<?php } ?>
</table>

<script>
// JS table search
document.getElementById('searchLab').addEventListener('keyup', function(){
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#usageTable tr:not(:first-child)');
    rows.forEach(row=>{
        row.style.display = row.textContent.toLowerCase().includes(filter)? '':'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>