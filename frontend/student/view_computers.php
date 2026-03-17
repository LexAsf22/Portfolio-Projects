<?php
include("../includes/header.php");
checkRole('student');

// FIX: JOIN with laboratories instead of querying inside the loop
$computers = $conn->query("
    SELECT c.*, l.lab_name
    FROM   computers c
    JOIN   laboratories l ON c.lab_id = l.id
    ORDER  BY l.lab_name, c.computer_name
");
?>

<h2>Available Computers</h2>

<input type="text" id="searchComp" placeholder="Search by lab or computer..."
       style="padding:10px; margin:10px 0; width:50%;">

<table id="compTable" border="1" cellpadding="10" cellspacing="0"
       style="border-collapse:collapse; width:100%;">
    <thead>
        <tr>
            <th>Lab</th>
            <th>Computer Name / ID</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
    <?php if ($computers->num_rows === 0): ?>
        <tr>
            <td colspan="3" style="text-align:center; color:#888; font-style:italic;">
                No computers on record.
            </td>
        </tr>
    <?php else: ?>
        <?php while ($c = $computers->fetch_assoc()): ?>
        <tr>
            <td><?php echo htmlspecialchars($c['lab_name']);      ?></td>
            <td><?php echo htmlspecialchars($c['computer_name']); ?></td>
            <td><?php echo htmlspecialchars($c['status']);        ?></td>
        </tr>
        <?php endwhile; ?>
    <?php endif; ?>
    </tbody>
    <div id="compHint" style="display:none; color:#888; font-style:italic; margin-top:8px;">
            No computers match your search.
    </div>  
</table>

<script>
document.getElementById('searchComp').addEventListener('keyup', function() {
    var filter  = this.value.toLowerCase();
    var rows    = document.querySelectorAll('#compTable tbody tr');
    var visible = 0;

    rows.forEach(function(row) {
        // Skip the "no computers on record" empty-state row
        if (row.cells.length < 3) return;

        if (row.textContent.toLowerCase().includes(filter)) {
            row.style.display = '';
            visible++;
        } else {
            row.style.display = 'none';
        }
    });

    var hint = document.getElementById('compHint');
    if (hint) {
        hint.style.display = visible === 0 ? 'block' : 'none';
    }
});
</script>

<?php include("../includes/footer.php"); ?>