<?php
include("../includes/header.php");
checkRole('student');

// Fetch computers
$computers = $conn->query("SELECT * FROM computers ORDER BY lab_id");
?>

<h2>Available Computers</h2>

<input type="text" id="searchComp" placeholder="Search by lab or computer..." style="padding:10px;margin:10px 0;width:50%;">
<table id="compTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Lab</th>
<th>Computer Name/ID</th>
<th>Status</th>
</tr>
<?php while($c = $computers->fetch_assoc()){ 
    $lab = $conn->query("SELECT lab_name FROM laboratories WHERE id=".$c['lab_id'])->fetch_assoc();
?>
<tr>
    <td><?php echo $lab['lab_name']; ?></td>
    <td><?php echo $c['computer_name']; ?></td>
    <td><?php echo $c['status']; ?></td>
</tr>
<?php } ?>
</table>

<script>
// JS search
document.getElementById('searchComp').addEventListener('keyup', function(){
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#compTable tr:not(:first-child)');
    rows.forEach(row=>{
        row.style.display = row.textContent.toLowerCase().includes(filter)? '':'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>