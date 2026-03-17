<?php
include("../includes/header.php");
checkRole('student');

$user_id = (int) $_SESSION['user']['id'];

$stmt = $conn->prepare("
    SELECT r.*, 
           l.lab_name, 
           e.equipment_name
    FROM   reservations r
    LEFT JOIN laboratories l ON r.lab_id       = l.id
    LEFT JOIN equipment    e ON r.equipment_id  = e.id
    WHERE  r.user_id = ?
    ORDER  BY r.date DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$reservations = $stmt->get_result();
?>

<h2>My Reservations</h2>

<?php if ($reservations->num_rows === 0): ?>
    <p style="color:#888; font-style:italic; margin-top:20px;">
        You have no reservations yet. 
        <a href="/spacio/frontend/student/reserve_lab.php">Reserve a lab</a> or 
        <a href="/spacio/frontend/student/reserve_equipment.php">reserve equipment</a>.
    </p>
<?php else: ?>

    <input 
        type="text" 
        id="searchRes" 
        placeholder="Search reservations..." 
        style="padding:10px; margin:10px 0; width:50%; border:1px solid #ccc; border-radius:5px;"
    >

    <table id="myResTable" border="1" cellpadding="10" cellspacing="0"
           style="border-collapse:collapse; width:100%; margin-top:10px;">
        <thead style="background:#2c5f2e; color:white;">
            <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
        <?php while ($r = $reservations->fetch_assoc()): ?>
            <?php
                $isLab   = !empty($r['lab_id']);
                $type    = $isLab ? 'Lab' : 'Equipment';
                $name    = $isLab ? $r['lab_name'] : $r['equipment_name'];
                $status  = $r['status'];
                $badge   = match($status) {
                    'Approved' => 'background:#d4edda; color:#155724;',
                    'Rejected' => 'background:#f8d7da; color:#721c24;',
                    default    => 'background:#fff3cd; color:#856404;',
                };
            ?>
            <tr>
                <td><?php echo $type; ?></td>
                <td><?php echo htmlspecialchars($name ?? '—'); ?></td>
                <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
                <td><?php echo htmlspecialchars($r['time_slot'] ?? '—'); ?></td>
                <td>
                    <span style="padding:4px 10px; border-radius:12px; font-size:.85rem; <?php echo $badge; ?>">
                        <?php echo htmlspecialchars($status); ?>
                    </span>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>

<?php endif; ?>

<script>
document.getElementById('searchRes')?.addEventListener('keyup', function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll('#myResTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});
</script>

<?php include("../includes/footer.php"); ?>