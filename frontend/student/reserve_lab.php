<?php
require '../../backend/helpers.php';
require_role('student');

$labs = $pdo->query("SELECT * FROM labs")->fetchAll();
$success = $error = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $lab_id = $_POST['lab_id'];
    $start_time = $_POST['start_time'];
    $end_time = $_POST['end_time'];

    // Example: reserve the lab without specifying equipment yet
    if(create_booking($_SESSION['user']['id'], $lab_id, [], $start_time, $end_time)){
        $success = "Lab reservation requested successfully!";
    } else {
        $error = "Failed to create reservation.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reserve Lab</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Reserve Lab Time</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="reserve_lab.php" style="color:white;">Reserve Lab</a>
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
        Start Time: <input type="datetime-local" name="start_time" required><br><br>
        End Time: <input type="datetime-local" name="end_time" required><br><br>
        <button type="submit">Reserve Lab</button>
    </form>
</div>
</body>
</html>