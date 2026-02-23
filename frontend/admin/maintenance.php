<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");
requireRole('admin');

if(isset($_GET['update'])){
    $conn->query("UPDATE issues SET status='In Progress' WHERE id=".$_GET['update']);
}
if(isset($_GET['done'])){
    $conn->query("UPDATE issues SET status='Done' WHERE id=".$_GET['done']);
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Maintenance Requests</title>
<style>
body{font-family:Arial;background:#f4f6f9;padding:20px;}
table{width:100%;background:white;border-collapse:collapse;}
th,td{border:1px solid #ddd;padding:8px;text-align:center;}
a{padding:5px 8px;color:white;border-radius:5px;text-decoration:none;}
.progress{background:#3498db;}
.done{background:#27ae60;}
</style>
</head>
<body>

<h2>Maintenance Requests</h2>

<table>
<tr>
<th>Campus</th>
<th>Room</th>
<th>Category</th>
<th>Priority</th>
<th>Status</th>
<th>Action</th>
</tr>

<?php
$result=$conn->query("SELECT * FROM issues");

while($row=$result->fetch_assoc()){
echo "<tr>
<td>{$row['campus']}</td>
<td>{$row['room']}</td>
<td>{$row['category']}</td>
<td>{$row['priority']}</td>
<td>".statusBadge($row['status'])."</td>
<td>
<a class='progress' href='?update={$row['id']}'>In Progress</a>
<a class='done' href='?done={$row['id']}'>Done</a>
</td>
</tr>";
}
?>
</table>

</body>
</html>