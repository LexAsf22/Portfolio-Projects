<?php
include("../includes/header.php");
checkRole('student');

if (isset($_POST['reserve'])) {
    $lab_id    = (int) $_POST['lab'];
    $date      = $_POST['date'];
    $time_slot = $_POST['time_slot'];
    $user_id   = (int) $_SESSION['user']['id'];

    // Validate date is not in the past
    if ($date < date('Y-m-d')) {
        setFlash("Please select a future date.", "error");
    } else {
        // Check conflict — use prepared statement
        $check = $conn->prepare("
            SELECT id FROM reservations 
            WHERE lab_id = ? AND date = ? AND time_slot = ?
        ");
        $check->bind_param("iss", $lab_id, $date, $time_slot);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            setFlash("Selected slot is already booked!", "error");
        } else {
            $stmt = $conn->prepare("
                INSERT INTO reservations (user_id, lab_id, date, time_slot, status) 
                VALUES (?, ?, ?, ?, 'Pending')
            ");
            $stmt->bind_param("iiss", $user_id, $lab_id, $date, $time_slot);
            $stmt->execute();
            setFlash("Reservation request submitted!", "success");
        }
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

$labs = $conn->query("SELECT * FROM laboratories ORDER BY lab_name");
?>

<h2>Reserve Lab</h2>
<?php echo getFlash(); ?>

<form method="POST" id="reserveLabForm">
    <select name="lab" required>
        <option value="">Select Lab</option>
        <?php while ($lab = $labs->fetch_assoc()): ?>
            <option value="<?php echo $lab['id']; ?>">
                <?php echo htmlspecialchars($lab['lab_name']); ?>
            </option>
        <?php endwhile; ?>
    </select>

    <input type="date" name="date" min="<?php echo date('Y-m-d'); ?>" required>

    <select name="time_slot" required>
        <option value="">Select Time Slot</option>
        <option value="7:30-9:00">7:30 - 9:00</option>
        <option value="9:00-10:30">9:00 - 10:30</option>
        <option value="10:30-12:00">10:30 - 12:00</option>
        <option value="13:00-14:30">13:00 - 14:30</option>
        <option value="14:30-16:00">14:30 - 16:00</option>
    </select>

    <button name="reserve" type="submit">Reserve</button>
</form>

<script>
document.getElementById('reserveLabForm').addEventListener('submit', function(e) {
    if (!confirm("Submit reservation request?")) e.preventDefault();
});
</script>

<?php include("../includes/footer.php"); ?>