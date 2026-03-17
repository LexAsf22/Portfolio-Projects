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
        $check = $conn->prepare("
            SELECT id FROM reservations
            WHERE equipment_id = ? AND date = ? AND status != 'Rejected'
        ");
        $check->bind_param("is", $equipment_id, $date);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            setFlash("That equipment is already reserved on this date.", "error");
        } else {
            $stmt = $conn->prepare("
                INSERT INTO reservations (user_id, equipment_id, date, status)
                VALUES (?, ?, ?, 'Pending')
            ");
            $stmt->bind_param("iis", $user_id, $equipment_id, $date);
            if ($stmt->execute()) {
                setFlash("Equipment reservation submitted! Waiting for admin approval.", "success");
            } else {
                setFlash("Something went wrong. Please try again.", "error");
            }
        }
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}
?>

<h2>Reserve Equipment</h2>
<?php echo getFlash(); ?>

<div style="max-width:520px; background:#f9f9f9; padding:24px; border-radius:8px; border:1px solid #ddd;">
    <form method="POST" id="reserveEqForm">

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">
                Select Equipment
            </label>
            <select name="equipment" required style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                <option value="">-- Choose Equipment --</option>
                <?php
                $campuses = ['Campus A', 'Campus B'];
                foreach ($campuses as $campus):
                    $equipment = $conn->query("
                        SELECT e.*, l.lab_name
                        FROM   equipment e
                        JOIN   laboratories l ON e.lab_id = l.id
                        WHERE  l.campus = '$campus'
                        AND    e.quantity > 0
                        AND    e.status = 'Available'
                        ORDER  BY l.lab_name, e.equipment_name
                    ");
                    if ($equipment->num_rows === 0) continue;
                ?>
                    <optgroup label="── <?php echo $campus; ?> ──">
                        <?php while ($e = $equipment->fetch_assoc()): ?>
                            <option value="<?php echo $e['id']; ?>">
                                <?php echo htmlspecialchars($e['equipment_name']); ?>
                                — <?php echo htmlspecialchars($e['lab_name']); ?>
                                (<?php echo (int)$e['quantity']; ?> available)
                            </option>
                        <?php endwhile; ?>
                    </optgroup>
                <?php endforeach; ?>
            </select>
        </div>

        <div style="margin-bottom:20px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">
                Date Needed
            </label>
            <input
                type="date"
                name="date"
                min="<?php echo date('Y-m-d'); ?>"
                required
                style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;"
            >
        </div>

        <button
            name="reserve"
            type="submit"
            style="
                width:100%; padding:12px;
                background:#2c5f2e; color:white;
                border:none; border-radius:5px;
                font-size:1rem; cursor:pointer;
                transition: background .2s;
            "
            onmouseover="this.style.background='#1e3d1a'"
            onmouseout="this.style.background='#2c5f2e'"
        >
            Submit Reservation
        </button>

    </form>
</div>

<!-- Recent equipment reservations -->
<div style="margin-top:36px;">
    <h3 style="margin-bottom:12px;">Your Recent Equipment Reservations</h3>

    <?php
    $user_id = (int) $_SESSION['user']['id'];
    $recent  = $conn->prepare("
        SELECT r.*, e.equipment_name, l.lab_name
        FROM   reservations r
        JOIN   equipment    e ON r.equipment_id = e.id
        JOIN   laboratories l ON e.lab_id       = l.id
        WHERE  r.user_id = ? AND r.equipment_id IS NOT NULL
        ORDER  BY r.created_at DESC
        LIMIT  5
    ");
    $recent->bind_param("i", $user_id);
    $recent->execute();
    $recent_result = $recent->get_result();
    ?>

    <?php if ($recent_result->num_rows === 0): ?>
        <p style="color:#888; font-style:italic;">No equipment reservations yet.</p>
    <?php else: ?>
        <table border="1" cellpadding="10" cellspacing="0"
               style="border-collapse:collapse; width:100%; max-width:700px;">
            <thead style="background:#2c5f2e; color:white;">
                <tr>
                    <th>Equipment</th>
                    <th>Lab</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            <?php while ($r = $recent_result->fetch_assoc()):
                $status = $r['status'];
                $badge  = match($status) {
                    'Approved' => 'background:#d4edda; color:#155724;',
                    'Rejected' => 'background:#f8d7da; color:#721c24;',
                    default    => 'background:#fff3cd; color:#856404;',
                };
            ?>
                <tr>
                    <td><?php echo htmlspecialchars($r['equipment_name']); ?></td>
                    <td><?php echo htmlspecialchars($r['lab_name']);       ?></td>
                    <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
                    <td>
                        <span style="padding:3px 10px; border-radius:12px; font-size:.82rem; <?php echo $badge; ?>">
                            <?php echo htmlspecialchars($status); ?>
                        </span>
                    </td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<script>
document.getElementById('reserveEqForm').addEventListener('submit', function(e) {
    if (!confirm("Submit this equipment reservation?")) e.preventDefault();
});
</script>

<?php include("../includes/footer.php"); ?> 