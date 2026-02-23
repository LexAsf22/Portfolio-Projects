<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('teacher');
include("../includes/header.php");

$userId=user()['id'];
?>

<style>
table{
    width:100%;
    background:white;
    border-collapse:collapse;
}
th,td{
    padding:10px;
    border-bottom:1px solid #ddd;
}
</style>

<h2>My Issue Status</h2>

<table>
<tr>
<th>Campus</th>
<th>Room</th>
<th>Category</th>
<th>Priority</th>
<th>Status</th>
</tr>

<?php
$result=$conn->query("SELECT * FROM issues WHERE user_id='$userId' ORDER BY id DESC");

while($row=$result->fetch_assoc()){
echo "<tr>
<td>".e($row['campus'])."</td>
<td>".e($row['room'])."</td>
<td>".e($row['category'])."</td>
<td>".e($row['priority'])."</td>
<td>".statusBadge($row['status'])."</td>
</tr>";
}
?>
</table>

<?php include("../includes/footer.php"); ?>