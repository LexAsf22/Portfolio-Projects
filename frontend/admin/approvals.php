<?php
include("../includes/header.php");
checkRole('admin');

// Approve
if (isset($_GET['approve'])) {
    $id   = (int) $_GET['approve'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Approved' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setFlash("Reservation approved successfully!", "success");
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Reject
if (isset($_GET['reject'])) {
    $id   = (int) $_GET['reject'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Rejected' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setFlash("Reservation rejected.", "error");
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Fetch all pending — LEFT JOIN equipment too
$reservations = $conn->query("
    SELECT 
        r.*,
        u.name        AS student_name,
        l.lab_name,
        e.equipment_name
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN laboratories l ON r.lab_id       = l.id
    LEFT JOIN equipment    e ON r.equipment_id  = e.id
    WHERE r.status = 'Pending'
    ORDER BY r.date ASC, r.time_slot ASC
");

$pending_count = $reservations->num_rows;
?>

<h2>Pending Reservations 
    <span style="
        background:#f39c12; color:white;
        padding:3px 10px; border-radius:12px;
        font-size:.85rem; vertical-align:middle;
    ">
        <?php echo $pending_count; ?> pending
    </span>
</h2>

<?php echo getFlash(); ?>

<?php if ($pending_count === 0): ?>
    <div style="
        background:#d4edda; color:#155724;
        border:1px solid #c3e6cb;
        padding:16px; border-radius:8px; margin-top:20px;
    ">
        ✓ No pending reservations. All caught up!
    </div>
<?php else: ?>

    <input 
        type="text" 
        id="searchInput" 
        placeholder="Search by student, lab, or equipment..." 
        style="padding:10px; margin:10px 0; width:50%; border:1px solid #ccc; border-radius:5px;"
    >

    <table id="approvalTable" border="1" cellpadding="10" cellspacing="0"
           style="border-collapse:collapse; width:100%; margin-top:10px;">
        <thead style="background:#2c5f2e; color:white;">
            <tr>
                <th>#</th>
                <th>Student</th>
                <th>Type</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
        <?php while ($row = $reservations->fetch_assoc()):
            $isLab = !empty($row['lab_id']);
            $type  = $isLab ? 'Lab' : 'Equipment';
            $name  = $isLab ? $row['lab_name'] : $row['equipment_name'];
        ?>
            <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo htmlspecialchars($row['student_name']); ?></td>
                <td><?php echo $type; ?></td>
                <td><?php echo htmlspecialchars($name ?? '—'); ?></td>
                <td><?php echo date("F d, Y", strtotime($row['date'])); ?></td>
                <td><?php echo htmlspecialchars($row['time_slot'] ?? '—'); ?></td>
                <td style="white-space:nowrap;">
                    <a 
                        href="?approve=<?php echo $row['id']; ?>" 
                        class="approveBtn"
                        style="
                            background:#28a745; color:white;
                            padding:6px 14px; border-radius:4px;
                            text-decoration:none; font-size:.85rem;
                            margin-right:6px;
                        "
                    >✓ Approve</a>
                    <a 
                        href="?reject=<?php echo $row['id']; ?>" 
                        class="rejectBtn"
                        style="
                            background:#e74c3c; color:white;
                            padding:6px 14px; border-radius:4px;
                            text-decoration:none; font-size:.85rem;
                        "
                    >✗ Reject</a>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>

<?php endif; ?>

<script>
document.querySelectorAll('.approveBtn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (!confirm("Approve this reservation?")) e.preventDefault();
    });
});

document.querySelectorAll('.rejectBtn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (!confirm("Reject this reservation?")) e.preventDefault();
    });
});

document.getElementById('searchInput')?.addEventListener('keyup', function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll('#approvalTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>