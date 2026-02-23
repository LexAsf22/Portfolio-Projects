<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('student');
include("../includes/header.php");

$message="";

if(isset($_POST['reserve'])){
    $lab=$_POST['lab_id'];
    $date=$_POST['date'];
    $userId=user()['id'];

    $stmt=$conn->prepare("INSERT INTO reservations(user_id,lab_id,date) VALUES(?,?,?)");
    $stmt->bind_param("iis",$userId,$lab,$date);

    if($stmt->execute()){
        $message=alert("Reservation submitted successfully!","success");
    }
}
?>

<style>
form{
    background:white;
    padding:20px;
    border-radius:10px;
    max-width:400px;
}
input,select{
    width:100%;
    padding:8px;
    margin:8px 0;
}
button{
    padding:10px;
    background:#27ae60;
    color:white;
    border:none;
}
</style>

<h2>Reserve Lab Time</h2>

<?=$message?>

<form method="POST">

<select name="lab_id" required>
<option value="">Select Lab</option>
<?php
$labs=$conn->query("SELECT * FROM labs");
while($lab=$labs->fetch_assoc()){
echo "<option value='{$lab['id']}'>{$lab['lab_name']} - {$lab['campus']}</option>";
}
?>
</select>

<input type="date" name="date" required>

<button name="reserve">Submit Reservation</button>

</form>

<?php include("../includes/footer.php"); ?>