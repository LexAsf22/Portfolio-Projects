<?php
include("../includes/header.php");
checkRole('teacher');

// Handle issue submission
if(isset($_POST['report'])){
    $campus = $_POST['campus'];
    $room = $_POST['room'];
    $category = $_POST['category'];
    $priority = $_POST['priority'];
    $user_id = $_SESSION['user']['id'];

    $conn->query("INSERT INTO issues(user_id,campus,room,category,priority,status,created_at) 
        VALUES($user_id,'$campus','$room','$category','$priority','Pending',NOW())");
    setFlash("Issue reported successfully!", "success");
}
?>

<h2>Report Classroom / Lab Issue</h2>
<?php echo getFlash(); ?>

<form method="POST" id="issueForm">
    <select name="campus" required>
        <option value="">Select Campus</option>
        <option value="Campus A">Campus A</option>
        <option value="Campus B">Campus B</option>
    </select>
    <input type="text" name="room" placeholder="Room / Lab" required>
    <select name="category" required>
        <option value="">Select Category</option>
        <option value="Equipment">Equipment</option>
        <option value="Facility">Facility</option>
        <option value="Software">Software</option>
    </select>
    <select name="priority" required>
        <option value="">Select Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
    </select>
    <button name="report" type="submit">Report Issue</button>
</form>

<script>
// JS confirm submission
document.getElementById('issueForm').addEventListener('submit', function(e){
    if(!confirm("Submit issue report?")) e.preventDefault();
});
</script>

<?php include("../includes/footer.php"); ?>