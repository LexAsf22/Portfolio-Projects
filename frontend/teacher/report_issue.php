<?php
require '../../backend/helpers.php';
require_role('teacher');

$labs = $pdo->query("SELECT * FROM labs")->fetchAll();
$error = '';
$success = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $lab_id = $_POST['lab_id'];
    $category = $_POST['category'];
    $priority = $_POST['priority'];
    $description = $_POST['description'];

    if(create_issue($lab_id, $_SESSION['user']['id'], $category, $priority, $description)){
        $success = "Issue reported successfully!";
    } else {
        $error = "Failed to report issue.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Report Issue</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Report Classroom/Lab Issue</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="report_issue.php" style="color:white;">Report Issue</a>
</nav>
<div style="padding:2rem; background:#eaf4ea;">
    <?php if($error) echo "<p style='color:red;'>$error</p>"; ?>
    <?php if($success) echo "<p style='color:green;'>$success</p>"; ?>
    <form method="POST">
        Lab: 
        <select name="lab_id" required>
            <?php foreach($labs as $lab): ?>
            <option value="<?php echo $lab['id']; ?>"><?php echo $lab['name']; ?></option>
            <?php endforeach; ?>
        </select><br><br>
        Category: 
        <select name="category" required>
            <option value="equipment">Equipment</option>
            <option value="furniture">Furniture</option>
            <option value="AC">AC</option>
            <option value="internet">Internet</option>
        </select><br><br>
        Priority:
        <select name="priority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select><br><br>
        Description:<br>
        <textarea name="description" rows="4" cols="50" required></textarea><br><br>
        <button type="submit">Report Issue</button>
    </form>
</div>
</body>
</html>