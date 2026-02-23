<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('student');
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

<h2>Available Computers</h2>

<table>
<tr>
<th>Lab</th>
<th>Equipment</th>
<th>Quantity</th>
</tr>

<?php
$sql="SELECT e.*, l.lab_name
      FROM equipment e
      JOIN labs l ON e.lab_id=l.id
      WHERE e.name LIKE '%Computer%' AND e.quantity > 0";

$result=$conn->query($sql);

while($row=$result->fetch_assoc()){
echo "<tr>
<td>{$row['lab_name']}</td>
<td>{$row['name']}</td>
<td>{$row['quantity']}</td>
</tr>";
}
?>
</table>

<?php include("../includes/footer.php"); ?>