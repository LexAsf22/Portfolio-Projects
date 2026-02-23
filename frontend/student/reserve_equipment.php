<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('student');
include("../includes/header.php");

$message="";

if(isset($_POST['reserve'])){
    $equipment=$_POST['equipment_id'];
    $userId=user()['id'];
    $date=$_POST['date'];

    $stmt=$conn->prepare("INSERT INTO reservations(user_id,lab_id,date) VALUES(?,?,?)");
    $stmt->bind_param("iis",$userId,$equipment,$date);
    $stmt->execute();

    $message=alert("Equipment reservation submitted!","success");
}
?>

<style>
form{
    background:white;
    padding:20px;
    border-radius:10px;
    max-width:400px;
}
</style>

<h2>Reserve Equipment</h2>

<?=$message?>

<form method="POST">

<select name="equipment_id" required>
<option value="">Select Equipment</option>
<?php
$equip=$conn->query("SELECT e.*, l.lab_name 
                     FROM equipment e
                     JOIN labs l ON e.lab_id=l.id");

while($row=$equip->fetch_assoc()){
echo "<option value='{$row['lab_id']}'>
{$row['name']} ({$row['lab_name']})
</option>";
}
?>
</select>

<input type="date" name="date" required>

<button name="reserve">Reserve</button>

</form>

<?php include("../includes/footer.php"); ?>