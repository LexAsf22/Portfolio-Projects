<?php
include("../includes/header.php");
checkRole('teacher');

$user_id = (int) $_SESSION['user']['id'];

// ── AJAX handler ──────────────────────────────────────────────────────────────
if (isset($_GET['fetch_stats'])) {

    // COUNT(*) is faster than SELECT * for counting rows
    $total_issues = $conn->query("
        SELECT COUNT(*) AS n FROM issues
        WHERE user_id = $user_id AND status = 'Pending'
    ")->fetch_assoc()['n'];

    $recent_reservations = $conn->query("
        SELECT r.*, l.lab_name, u.name AS student_name
        FROM   reservations r
        JOIN   laboratories l ON r.lab_id  = l.id
        JOIN   users        u ON r.user_id = u.id
        ORDER  BY r.date DESC
        LIMIT  5
    ");

    $rows = [];
    while ($r = $recent_reservations->fetch_assoc()) {
        $rows[] = [
            'student' => $r['student_name'],
            'lab'     => $r['lab_name'],
            'date'    => date("F d, Y", strtotime($r['date'])),
            'time'    => $r['time_slot'],
            'status'  => $r['status'],
        ];
    }

    header('Content-Type: application/json');
    echo json_encode([
        'issues'       => (int) $total_issues,
        'recent_count' => count($rows),
        'rows'         => $rows,
    ]);
    exit;
}

// ── Normal page load ──────────────────────────────────────────────────────────
$total_issues = $conn->query("
    SELECT COUNT(*) AS n FROM issues
    WHERE user_id = $user_id AND status = 'Pending'
")->fetch_assoc()['n'];

$recent_reservations = $conn->query("
    SELECT r.*, l.lab_name, u.name AS student_name
    FROM   reservations r
    JOIN   laboratories l ON r.lab_id  = l.id
    JOIN   users        u ON r.user_id = u.id
    ORDER  BY r.date DESC
    LIMIT  5
");
?>

<h2>Teacher Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px; flex-wrap:wrap;">

    <div style="background:#4caf50; color:white; padding:20px; flex:1; border-radius:5px; min-width:160px;">
        <h3 style="margin:0 0 8px; font-size:.95rem;">Pending Issues</h3>
        <p id="pendingIssues" style="font-size:2rem; margin:0; font-weight:700;">
            <?php echo $total_issues; ?>
        </p>
    </div>

    <div style="background:#f39c12; color:white; padding:20px; flex:1; border-radius:5px; min-width:160px;">
        <h3 style="margin:0 0 8px; font-size:.95rem;">Recent Reservations</h3>
        <p id="recentCount" style="font-size:2rem; margin:0; font-weight:700;">
            <?php echo $recent_reservations->num_rows; ?>
        </p>
    </div>

</div>

<!-- Last updated timestamp -->
<p id="refreshStatus" style="margin-top:8px; font-size:.78rem; color:#888; font-style:italic;"></p>

<h3 style="margin-top:24px;">Recent Lab Reservations</h3>

<input
    type="text"
    id="searchRes"
    placeholder="Search by student or lab..."
    style="padding:10px; margin:10px 0; width:50%; border:1px solid #ccc; border-radius:5px;"
>

<table id="recentTable" border="1" cellpadding="10" cellspacing="0"
       style="border-collapse:collapse; width:100%;">
    <thead style="background:#2c5f2e; color:white;">
        <tr>
            <th>Student</th>
            <th>Lab</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
    <?php while ($r = $recent_reservations->fetch_assoc()): ?>
        <tr>
            <td><?php echo htmlspecialchars($r['student_name']); ?></td>
            <td><?php echo htmlspecialchars($r['lab_name']);      ?></td>
            <td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
            <td><?php echo htmlspecialchars($r['time_slot']);     ?></td>
            <td><?php echo htmlspecialchars($r['status']);        ?></td>
        </tr>
    <?php endwhile; ?>
    </tbody>
</table>

<div id="noResults" style="display:none; color:#888; font-style:italic; margin-top:8px;">
    No reservations match your search.
</div>

<script>
(function () {

    // ── AJAX refresh ──────────────────────────────────────────────
    function refreshDashboard() {
        fetch(window.location.pathname + '?fetch_stats=1')
            .then(function (res) {
                if (!res.ok) throw new Error('Server error: ' + res.status);
                return res.json();
            })
            .then(function (data) {
                // textContent is XSS-safe — never use innerHTML for server data
                document.getElementById('pendingIssues').textContent = data.issues;
                document.getElementById('recentCount').textContent   = data.recent_count;

                var tbody = document.querySelector('#recentTable tbody');

                // Clear existing rows
                tbody.innerHTML = '';

                // Show empty state if no rows returned
                if (data.rows.length === 0) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.colSpan     = 5;
                    td.textContent = 'No recent reservations.';
                    td.style.cssText = 'text-align:center; color:#888; font-style:italic;';
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                    return;
                }

                // Build rows safely using createElement, not innerHTML
                data.rows.forEach(function (r) {
                    var tr     = document.createElement('tr');
                    var cells  = [r.student, r.lab, r.date, r.time, r.status];
                    cells.forEach(function (val) {
                        var td = document.createElement('td');
                        td.textContent = val; // textContent escapes HTML automatically
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                // Show last updated time
                var now  = new Date();
                var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                document.getElementById('refreshStatus').textContent = 'Last updated at ' + time;
            })
            .catch(function (err) {
                document.getElementById('refreshStatus').style.color = '#e74c3c';
                document.getElementById('refreshStatus').textContent = '⚠ Could not refresh. Will retry shortly.';
                console.error('Dashboard refresh failed:', err);
            });
    }

    // Auto-refresh every 60 seconds
    setInterval(refreshDashboard, 60000);

    // ── Search with debounce ──────────────────────────────────────
    var debounceTimer;

    document.getElementById('searchRes').addEventListener('keyup', function () {
        clearTimeout(debounceTimer);
        var searchValue = this.value;

        debounceTimer = setTimeout(function () {
            var filter  = searchValue.toLowerCase();
            var rows    = document.querySelectorAll('#recentTable tbody tr');
            var visible = 0;

            rows.forEach(function (row) {
                if (row.textContent.toLowerCase().includes(filter)) {
                    row.style.display = '';
                    visible++;
                } else {
                    row.style.display = 'none';
                }
            });

            document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
        }, 200);
    });

}());
</script>

<?php include("../includes/footer.php"); ?>