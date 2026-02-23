<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");
requireRole('admin');

if(isset($_GET['approve'])){
    $conn->query("UPDATE reservations SET status='Approved' WHERE id=".$_GET['approve']);
    header("Location: approvals.php");
}
if(isset($_GET['reject'])){
    $conn->query("UPDATE reservations SET status='Rejected' WHERE id=".$_GET['reject']);
    header("Location: approvals.php");
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Approve Lab Bookings</title>
<style>
body{font-family:Arial;background:#f4f6f9;margin:0;}
.content{padding:20px;}
table{width:100%;border-collapse:collapse;background:white;}
th,td{padding:10px;border:1px solid #ddd;text-align:center;}
a{padding:5px 10px;text-decoration:none;border-radius:5px;color:white;}
.approve{background:#27ae60;}
.reject{background:#e74c3c;}
</style>
</head>
<body>

<div class="content">
<h2>Pending Reservations</h2>

<table>
<tr>
<th>Student</th>
<th>Lab</th>
<th>Date</th>
<th>Status</th>
<th>Action</th>
</tr>

<?php
$sql="SELECT r.*, u.name, l.lab_name 
      FROM reservations r
      JOIN users u ON r.user_id=u.id
      JOIN labs l ON r.lab_id=l.id
      WHERE r.status='Pending'";

$result=$conn->query($sql);

while($row=$result->fetch_assoc()){
echo "<tr>
<td>".e($row['name'])."</td>
<td>".e($row['lab_name'])."</td>
<td>".formatDate($row['date'])."</td>
<td>".statusBadge($row['status'])."</td>
<td>
<a class='approve' href='?approve={$row['id']}'>Approve</a>
<a class='reject' href='?reject={$row['id']}'>Reject</a>
</td>
</tr>";
}
?>
</table>

</div>
</body>
</html>