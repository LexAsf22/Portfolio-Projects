<?php
include("../includes/header.php");
checkRole('teacher');

$usage = $conn->query("
    SELECT r.*, u.name AS student_name, l.lab_name
    FROM   reservations r
    JOIN   users        u ON r.user_id = u.id
    JOIN   laboratories l ON r.lab_id  = l.id
    WHERE  r.status = 'Approved'
    ORDER  BY r.date DESC
    LIMIT  50
");
?>

<h2>Lab Usage Monitoring</h2>

<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin:10px 0;">
    <input
        type="text"
        id="searchLab"
        placeholder="Search by lab or student..."
        style="padding:10px; width:220px; border:1px solid #ccc; border-radius:5px;"
    >
    <!-- Campus filter -->
    <select id="filterCampus" style="padding:10px; border:1px solid #ccc; border-radius:5px;">
        <option value="">All Campuses</option>
        <?php
        // Build campus options from distinct values already in the result
        // We re-query here so the select is populated from real data
        $campusResult = $conn->query("SELECT DISTINCT l.campus FROM laboratories l ORDER BY l.campus");
        while ($c = $campusResult->fetch_assoc()):
        ?>
            <option value="<?php echo htmlspecialchars($c['campus']); ?>">
                <?php echo htmlspecialchars($c['campus']); ?>
            </option>
        <?php endwhile; ?>
    </select>
    <span id="visibleCount" style="font-size:.8rem; color:#888;"></span>
</div>

<?php if ($usage->num_rows === 0): ?>
    <p style="color:#888; font-style:italic; margin-top:16px;">
        No approved lab usage on record.
    </p>
<?php else: ?>

<table id="usageTable" border="1" cellpadding="10" cellspacing="0"
       style="border-collapse:collapse; width:100%; margin-top:4px;">
    <thead style="background:#2c5f2e; color:white;">
        <tr>
            <th>Student</th>
            <th>Lab</th>
            <th>Campus</th>
            <th>Date</th>
            <th>Time Slot</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($u = $usage->fetch_assoc()): ?>
        <tr data-campus="<?php echo htmlspecialchars($u['campus'] ?? ''); ?>">
            <td><?php echo htmlspecialchars($u['student_name']); ?></td>
            <td><?php echo htmlspecialchars($u['lab_name']);     ?></td>
            <td><?php echo htmlspecialchars($u['campus'] ?? '—'); ?></td>
            <td><?php echo date("F d, Y", strtotime($u['date'])); ?></td>
            <td><?php echo htmlspecialchars($u['time_slot']);    ?></td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<div id="noResults" style="display:none; color:#888; font-style:italic; margin-top:8px;">
    No records match your search.
</div>

<?php endif; ?>

<script>
(function () {

    var debounceTimer;

    function applyFilters() {
        var search = document.getElementById('searchLab').value.toLowerCase();
        var campus = document.getElementById('filterCampus').value;
        var rows   = document.querySelectorAll('#usageTable tbody tr');
        var visible = 0;

        rows.forEach(function (row) {
            var text      = row.textContent.toLowerCase();
            var rowCampus = row.dataset.campus || '';

            var matchSearch = search === '' || text.includes(search);
            var matchCampus = campus === '' || rowCampus === campus;

            if (matchSearch && matchCampus) {
                row.style.display = '';
                visible++;
            } else {
                row.style.display = 'none';
            }
        });

        var countEl = document.getElementById('visibleCount');
        if (countEl) {
            countEl.textContent = visible + ' record' + (visible !== 1 ? 's' : '') + ' shown';
        }

        var noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }
    }

    // Debounced text search
    document.getElementById('searchLab').addEventListener('keyup', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 200);
    });

    // Campus filter applies immediately
    document.getElementById('filterCampus').addEventListener('change', applyFilters);

    // Set initial count on page load
    applyFilters();

}());
</script>

<?php include("../includes/footer.php"); ?>