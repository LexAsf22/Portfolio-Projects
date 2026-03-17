<?php
include("../includes/header.php");
checkRole('teacher');

$user_id = (int) $_SESSION['user']['id'];

// Use a prepared statement — never interpolate session data directly into a query
$stmt = $conn->prepare("
    SELECT * FROM issues
    WHERE  user_id = ?
    ORDER  BY created_at DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$issues = $stmt->get_result();
?>

<h2>My Reported Issues</h2>

<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin:10px 0;">
    <input
        type="text"
        id="searchIssues"
        placeholder="Search issues..."
        style="padding:10px; width:220px; border:1px solid #ccc; border-radius:5px;"
    >
    <!-- Filter by status -->
    <select id="filterStatus" style="padding:10px; border:1px solid #ccc; border-radius:5px;">
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
    </select>
    <!-- Filter by priority -->
    <select id="filterPriority" style="padding:10px; border:1px solid #ccc; border-radius:5px;">
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
    </select>
    <span id="visibleCount" style="font-size:.8rem; color:#888; margin-left:4px;"></span>
</div>

<?php if ($issues->num_rows === 0): ?>
    <p style="color:#888; font-style:italic; margin-top:16px;">
        You have not reported any issues yet.
    </p>
<?php else: ?>

<table id="issueTable" border="1" cellpadding="10" cellspacing="0"
       style="border-collapse:collapse; width:100%; margin-top:4px;">
    <thead style="background:#2c5f2e; color:white;">
        <tr>
            <th>#</th>
            <th>Campus</th>
            <th>Room</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reported At</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($i = $issues->fetch_assoc()):
        $statusStyle = match($i['status']) {
            'Done'        => 'background:#d4edda; color:#155724;',
            'In Progress' => 'background:#cce5ff; color:#004085;',
            default       => 'background:#fff3cd; color:#856404;',
        };
        $priorityStyle = match($i['priority']) {
            'High'   => 'color:#e74c3c; font-weight:700;',
            'Medium' => 'color:#f39c12; font-weight:700;',
            default  => 'color:#28a745; font-weight:700;',
        };
    ?>
        <tr data-status="<?php echo htmlspecialchars($i['status']); ?>"
            data-priority="<?php echo htmlspecialchars($i['priority']); ?>">
            <td><?php echo $i['id']; ?></td>
            <td><?php echo htmlspecialchars($i['campus']);   ?></td>
            <td><?php echo htmlspecialchars($i['room']);     ?></td>
            <td><?php echo htmlspecialchars($i['category']); ?></td>
            <td>
                <span style="<?php echo $priorityStyle; ?>">
                    <?php echo htmlspecialchars($i['priority']); ?>
                </span>
            </td>
            <td>
                <span style="padding:3px 10px; border-radius:12px; font-size:.82rem; <?php echo $statusStyle; ?>">
                    <?php echo htmlspecialchars($i['status']); ?>
                </span>
            </td>
            <td><?php echo date("F d, Y H:i", strtotime($i['created_at'])); ?></td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<div id="noResults" style="display:none; color:#888; font-style:italic; margin-top:8px;">
    No issues match your search.
</div>

<?php endif; ?>

<script>
(function () {

    var debounceTimer;

    function applyFilters() {
        var search   = document.getElementById('searchIssues').value.toLowerCase();
        var status   = document.getElementById('filterStatus').value;
        var priority = document.getElementById('filterPriority').value;
        var rows     = document.querySelectorAll('#issueTable tbody tr');
        var visible  = 0;

        rows.forEach(function (row) {
            var text        = row.textContent.toLowerCase();
            var rowStatus   = row.dataset.status   || '';
            var rowPriority = row.dataset.priority || '';

            // All three conditions must match for the row to show
            var matchSearch   = search   === '' || text.includes(search);
            var matchStatus   = status   === '' || rowStatus   === status;
            var matchPriority = priority === '' || rowPriority === priority;

            if (matchSearch && matchStatus && matchPriority) {
                row.style.display = '';
                visible++;
            } else {
                row.style.display = 'none';
            }
        });

        var countEl = document.getElementById('visibleCount');
        if (countEl) {
            countEl.textContent = visible + ' issue' + (visible !== 1 ? 's' : '') + ' shown';
        }

        var noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }
    }

    // Debounce the text search so it doesn't run on every single keystroke
    document.getElementById('searchIssues').addEventListener('keyup', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 200);
    });

    // Dropdowns apply immediately on change
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);

    // Set initial count on page load
    applyFilters();

}());
</script>

<?php include("../includes/footer.php"); ?>