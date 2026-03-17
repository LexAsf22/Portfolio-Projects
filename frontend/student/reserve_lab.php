<?php
include("../includes/header.php");
checkRole('student');

if (isset($_POST['reserve'])) {
    $lab_id    = (int) $_POST['lab'];
    $date      = $_POST['date'];
    $time_slot = $_POST['time_slot'];
    $user_id   = (int) $_SESSION['user']['id'];

    if ($date < date('Y-m-d')) {
        setFlash("Please select a future date.", "error");
    } else {
        $check = $conn->prepare("
            SELECT id FROM reservations 
            WHERE lab_id = ? AND date = ? AND time_slot = ? AND status != 'Rejected'
        ");
        $check->bind_param("iss", $lab_id, $date, $time_slot);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            setFlash("That slot is already booked. Please choose another.", "error");
        } else {
            $stmt = $conn->prepare("
                INSERT INTO reservations (user_id, lab_id, date, time_slot, status) 
                VALUES (?, ?, ?, ?, 'Pending')
            ");
            $stmt->bind_param("iiss", $user_id, $lab_id, $date, $time_slot);
            if ($stmt->execute()) {
                setFlash("Reservation submitted! Waiting for admin approval.", "success");
            } else {
                setFlash("Something went wrong. Please try again.", "error");
            }
        }
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}
?>

<h2>Reserve a Lab</h2>
<?php echo getFlash(); ?>

<div style="max-width:520px; background:#f9f9f9; padding:24px; border-radius:8px; border:1px solid #ddd;">
    <form method="POST" id="reserveLabForm">

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">
                Select Lab
            </label>
            <select name="lab" required style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                <option value="">-- Choose a Lab --</option>
                <?php
                $campuses = ['Campus A', 'Campus B'];
                foreach ($campuses as $campus):
                    $labs = $conn->query("
                        SELECT * FROM laboratories 
                        WHERE campus = '$campus' 
                        ORDER BY lab_name
                    ");
                ?>
                    <optgroup label="── <?php echo $campus; ?> ──">
                        <?php while ($lab = $labs->fetch_assoc()): ?>
                            <option value="<?php echo $lab['id']; ?>">
                                <?php echo htmlspecialchars($lab['lab_name']); ?>
                                <?php echo $lab['total_computers'] > 0
                                    ? ' (' . $lab['total_computers'] . ' computers)'
                                    : ''; ?>
                            </option>
                        <?php endwhile; ?>
                    </optgroup>
                <?php endforeach; ?>
            </select>
        </div>

        <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">
                Date
            </label>
            <input
                type="date"
                name="date"
                min="<?php echo date('Y-m-d'); ?>"
                required
                style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;"
            >
        </div>

        <div style="margin-bottom:20px;">
            <label style="display:block; font-weight:bold; margin-bottom:6px;">
                Time Slot
            </label>
            <select name="time_slot" required style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                <option value="">-- Choose a Time Slot --</option>
                <option value="7:30-9:00">7:30 AM – 9:00 AM</option>
                <option value="9:00-10:30">9:00 AM – 10:30 AM</option>
                <option value="10:30-12:00">10:30 AM – 12:00 PM</option>
                <option value="13:00-14:30">1:00 PM – 2:30 PM</option>
                <option value="14:30-16:00">2:30 PM – 4:00 PM</option>
            </select>
        </div>

        <!-- Availability checker display -->
        <div id="availabilityMsg" style="
            display:none;
            padding:10px 14px;
            border-radius:5px;
            margin-bottom:16px;
            font-size:.9rem;
        "></div>

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

<!-- Recent reservations for this student -->
<div style="margin-top:36px;">
    <h3 style="margin-bottom:12px;">Your Recent Lab Reservations</h3>

    <?php
    $user_id = (int) $_SESSION['user']['id'];
    $recent  = $conn->prepare("
        SELECT r.*, l.lab_name
        FROM   reservations r
        JOIN   laboratories l ON r.lab_id = l.id
        WHERE  r.user_id = ? AND r.lab_id IS NOT NULL
        ORDER  BY r.created_at DESC
        LIMIT  5
    ");
    $recent->bind_param("i", $user_id);
    $recent->execute();
    $recent_result = $recent->get_result();
    ?>

    <?php if ($recent_result->num_rows === 0): ?>
        <p style="color:#888; font-style:italic;">No lab reservations yet.</p>
    <?php else: ?>
        <table border="1" cellpadding="10" cellspacing="0"
               style="border-collapse:collapse; width:100%; max-width:700px;">
            <thead style="background:#2c5f2e; color:white;">
                <tr>
                    <th>Lab</th>
                    <th>Date</th>
                    <th>Time Slot</th>
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
                    <td><?php echo htmlspecialchars($r['lab_name']); ?></td>
                    <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
                    <td><?php echo htmlspecialchars($r['time_slot']); ?></td>
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
document.getElementById('reserveLabForm').addEventListener('submit', function(e) {
    if (!confirm("Submit this lab reservation request?")) e.preventDefault();
});

// Live availability check when lab + date + time are all selected
const labSelect  = document.querySelector('select[name="lab"]');
const dateInput  = document.querySelector('input[name="date"]');
const slotSelect = document.querySelector('select[name="time_slot"]');
const msg        = document.getElementById('availabilityMsg');

function checkAvailability() {
    const lab  = labSelect.value;
    const date = dateInput.value;
    const slot = slotSelect.value;

    if (!lab || !date || !slot) {
        msg.style.display = 'none';
        return;
    }

    fetch(`/spacio/backend/api/check_availability.php?lab_id=${lab}&date=${date}&time_slot=${encodeURIComponent(slot)}`)
        .then(res => res.json())
        .then(data => {
            msg.style.display = 'block';
            if (data.available) {
                msg.style.background = '#d4edda';
                msg.style.color      = '#155724';
                msg.style.border     = '1px solid #c3e6cb';
                msg.textContent      = '✓ This slot is available!';
            } else {
                msg.style.background = '#f8d7da';
                msg.style.color      = '#721c24';
                msg.style.border     = '1px solid #f5c6cb';
                msg.textContent      = '✗ This slot is already booked. Please choose another.';
            }
        })
        .catch(() => { msg.style.display = 'none'; });
}

labSelect.addEventListener('change', checkAvailability);
dateInput.addEventListener('change', checkAvailability);
slotSelect.addEventListener('change', checkAvailability);
</script>

<?php include("../includes/footer.php"); ?>