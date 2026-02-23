<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");
requireRole('admin');

if(isset($_POST['add'])){
    $lab=$_POST['lab_id'];
    $name=$_POST['name'];
    $qty=$_POST['quantity'];

    $stmt=$conn->prepare("INSERT INTO equipment(lab_id,name,quantity) VALUES(?,?,?)");
    $stmt->bind_param("isi",$lab,$name,$qty);
    $stmt->execute();
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Inventory Management</title>
<style>
body{font-family:Arial;background:#f4f6f9;padding:20px;}
table{width:100%;background:white;border-collapse:collapse;}
th,td{border:1px solid #ddd;padding:8px;text-align:center;}
input,select{padding:6px;margin:5px;}
button{padding:6px 10px;background:#2980b9;color:white;border:none;}
</style>
</head>
<body>

<h2>Inventory Management</h2>

<form method="POST">
<select name="lab_id" required>
<?php
$labs=$conn->query("SELECT * FROM labs");
while($lab=$labs->fetch_assoc()){
echo "<option value='{$lab['id']}'>{$lab['lab_name']} - {$lab['campus']}</option>";
}
?>
</select>

<input type="text" name="name" placeholder="Equipment Name" required>
<input type="number" name="quantity" placeholder="Quantity" required>
<button name="add">Add Equipment</button>
</form>

<hr>

<table>
<tr><th>Lab</th><th>Equipment</th><th>Quantity</th></tr>
<?php
$sql="SELECT e.*, l.lab_name 
      FROM equipment e
      JOIN labs l ON e.lab_id=l.id";
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

</body>
</html>