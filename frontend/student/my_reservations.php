<?php
include("../includes/header.php");
checkRole('student');

$user_id = (int) $_SESSION['user']['id'];

// FIX: Use prepared statement, equipment_id column now exists after SQL migration
$stmt = $conn->prepare("
    SELECT r.*, 
           l.lab_name, 
           e.equipment_name
    FROM   reservations r
    LEFT JOIN laboratories l ON r.lab_id      = l.id
    LEFT JOIN equipment    e ON r.equipment_id = e.id
    WHERE  r.user_id = ?
    ORDER  BY r.date DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$reservations = $stmt->get_result();
?>

<h2>My Reservations</h2>

<?php if ($reservations->num_rows === 0): ?>
    <p style="color:#888; font-style:italic;">You have no reservations yet.</p>
<?php else: ?>

<input type="text" id="searchRes" placeholder="Search..."
       style="padding:10px; margin:10px 0; width:50%;">

<table id="myResTable" border="1" cellpadding="10" cellspacing="0"
       style="border-collapse:collapse; width:100%;">
    <thead>
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
    <tr>
        <td><?php echo $r['lab_id'] ? 'Lab' : 'Equipment'; ?></td>
        <td><?php echo htmlspecialchars($r['lab_id'] ? $r['lab_name'] : $r['equipment_name']); ?></td>
        <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
        <td><?php echo htmlspecialchars($r['time_slot'] ?? '—'); ?></td>
        <td><?php echo htmlspecialchars($r['status']); ?></td>
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