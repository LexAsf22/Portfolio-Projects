<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('teacher');
include("../includes/header.php");

$message="";

if(isset($_POST['submit'])){
    $userId=user()['id'];
    $campus=$_POST['campus'];
    $room=$_POST['room'];
    $category=$_POST['category'];
    $priority=$_POST['priority'];

    $stmt=$conn->prepare("INSERT INTO issues(user_id,campus,room,category,priority)
                          VALUES(?,?,?,?,?)");
    $stmt->bind_param("issss",$userId,$campus,$room,$category,$priority);

    if($stmt->execute()){
        $message=alert("Issue reported successfully!","success");
    }
}
?>

<style>
form{
    background:white;
    padding:20px;
    border-radius:10px;
    max-width:450px;
}
input,select{
    width:100%;
    padding:8px;
    margin:8px 0;
}
button{
    padding:10px;
    background:#e67e22;
    color:white;
    border:none;
}
</style>

<h2>Report Classroom / Lab Issue</h2>

<?=$message?>

<form method="POST">

<select name="campus" required>
<option value="">Select Campus</option>
<option value="Campus A">Campus A</option>
<option value="Campus B">Campus B</option>
</select>

<input type="text" name="room" placeholder="Room Name" required>

<select name="category" required>
<option value="Electrical">Electrical</option>
<option value="Computer">Computer</option>
<option value="Furniture">Furniture</option>
<option value="Network">Network</option>
</select>

<select name="priority" required>
<option value="Low">Low</option>
<option value="Medium">Medium</option>
<option value="High">High</option>
</select>

<button name="submit">Submit Issue</button>

</form>

<?php include("../includes/footer.php"); ?>