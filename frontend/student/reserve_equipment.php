<?php
include("../includes/header.php");
checkRole('student');

if (isset($_POST['reserve'])) {
    $equipment_id = (int) $_POST['equipment'];
    $date         = $_POST['date'];
    $user_id      = (int) $_SESSION['user']['id'];

    if ($date < date('Y-m-d')) {
        setFlash("Please select a future date.", "error");
    } else {
        // Check availability — prepared statement
        $check = $conn->prepare("
            SELECT id FROM reservations 
            WHERE equipment_id = ? AND date = ? AND status != 'Rejected'
        ");
        $check->bind_param("is", $equipment_id, $date);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            setFlash("Equipment already reserved on that date!", "error");
        } else {
            $stmt = $conn->prepare("
                INSERT INTO reservations (user_id, equipment_id, date, status) 
                VALUES (?, ?, ?, 'Pending')
            ");
            $stmt->bind_param("iis", $user_id, $equipment_id, $date);
            $stmt->execute();
            setFlash("Equipment reservation submitted!", "success");
        }
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

$equipment = $conn->query("
    SELECT e.*, l.lab_name 
    FROM equipment e 
    JOIN laboratories l ON e.lab_id = l.id 
    ORDER BY l.lab_name, e.equipment_name
");
?>

<h2>Reserve Equipment</h2>
<?php echo getFlash(); ?>

<form method="POST" id="reserveEqForm">
    <select name="equipment" required>
        <option value="">Select Equipment</option>
        <?php while ($e = $equipment->fetch_assoc()): ?>
            <option value="<?php echo $e['id']; ?>">
                <?php echo htmlspecialchars($e['equipment_name'] . ' (' . $e['lab_name'] . ')'); ?>
            </option>
        <?php endwhile; ?>
    </select>

    <input type="date" name="date" min="<?php echo date('Y-m-d'); ?>" required>

    <button name="reserve" type="submit">Reserve</button>
</form>

<script>
document.getElementById('reserveEqForm').addEventListener('submit', function(e) {
    if (!confirm("Submit equipment reservation?")) e.preventDefault();
});
</script>

<?php include("../includes/footer.php"); ?>