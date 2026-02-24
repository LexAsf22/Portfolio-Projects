<?php
include("../includes/header.php");
checkRole('teacher');

$issues = $conn->query("SELECT * FROM issues WHERE user_id=".$_SESSION['user']['id']." ORDER BY created_at DESC");
?>

<h2>My Reported Issues</h2>

<input type="text" id="searchIssues" placeholder="Search issues..." style="padding:10px;margin:10px 0;width:50%;">
<table id="issueTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>ID</th>
<th>Campus</th>
<th>Room</th>
<th>Category</th>
<th>Priority</th>
<th>Status</th>
<th>Reported At</th>
</tr>
<?php while($i = $issues->fetch_assoc()){ ?>
<tr>
    <td><?php echo $i['id']; ?></td>
    <td><?php echo $i['campus']; ?></td>
    <td><?php echo $i['room']; ?></td>
    <td><?php echo $i['category']; ?></td>
    <td><?php echo $i['priority']; ?></td>
    <td><?php echo $i['status']; ?></td>
    <td><?php echo date("F d, Y H:i", strtotime($i['created_at'])); ?></td>
</tr>
<?php } ?>
</table>

<script>
// JS search/filter
document.getElementById('searchIssues').addEventListener('keyup', function(){
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#issueTable tr:not(:first-child)');
    rows.forEach(row=>{
        row.style.display = row.textContent.toLowerCase().includes(filter)? '':'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>