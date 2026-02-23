<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('teacher');
include("../includes/header.php");
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

<h2>Lab Usage Monitoring</h2>

<table>
<tr>
<th>Lab</th>
<th>Total Reservations</th>
</tr>

<?php
$sql="SELECT l.lab_name, COUNT(r.id) as total
      FROM labs l
      LEFT JOIN reservations r ON l.id=r.lab_id
      GROUP BY l.id";

$result=$conn->query($sql);

while($row=$result->fetch_assoc()){
echo "<tr>
<td>".e($row['lab_name'])."</td>
<td>".$row['total']."</td>
</tr>";
}
?>
</table>

<?php include("../includes/footer.php"); ?>