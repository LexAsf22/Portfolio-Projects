<?php
include("../includes/header.php");
checkRole('admin');

// ── AJAX: return chart data filtered by campus ────────────────────────────────
if (isset($_GET['fetch_chart'])) {
    $campus = $_GET['campus'] ?? '';

    // Build WHERE clause for campus filter
    $campusWhere = '';
    $campusParam = null;
    if ($campus !== '' && $campus !== 'all') {
        $campusWhere = " AND l.campus = ?";
        $campusParam = $campus;
    }

    // Reservation counts by status
    $statuses = ['Approved', 'Rejected', 'Pending'];
    $counts   = [];
    foreach ($statuses as $s) {
        if ($campusParam !== null) {
            $stmt = $conn->prepare("
                SELECT COUNT(*) AS n FROM reservations r
                LEFT JOIN laboratories l ON r.lab_id = l.id
                WHERE r.status = ? $campusWhere
            ");
            $stmt->bind_param("ss", $s, $campusParam);
        } else {
            $stmt = $conn->prepare("
                SELECT COUNT(*) AS n FROM reservations WHERE status = ?
            ");
            $stmt->bind_param("s", $s);
        }
        $stmt->execute();
        $counts[] = (int) $stmt->get_result()->fetch_assoc()['n'];
    }

    // Issue counts by category (not filtered by campus — issues are campus-wide)
    $cats      = ['Equipment', 'Facility', 'Software'];
    $issCounts = [];
    foreach ($cats as $c) {
        $stmt = $conn->prepare("SELECT COUNT(*) AS n FROM issues WHERE category = ?");
        $stmt->bind_param("s", $c);
        $stmt->execute();
        $issCounts[] = (int) $stmt->get_result()->fetch_assoc()['n'];
    }

    header('Content-Type: application/json');
    echo json_encode([
        'reservation_counts' => $counts,
        'issue_counts'       => $issCounts,
    ]);
    exit;
}

// ── Normal page load — initial data ──────────────────────────────────────────
$approved = (int) $conn->query("SELECT COUNT(*) AS n FROM reservations WHERE status='Approved'")->fetch_assoc()['n'];
$rejected = (int) $conn->query("SELECT COUNT(*) AS n FROM reservations WHERE status='Rejected'")->fetch_assoc()['n'];
$pending  = (int) $conn->query("SELECT COUNT(*) AS n FROM reservations WHERE status='Pending'")->fetch_assoc()['n'];

$issEquip    = (int) $conn->query("SELECT COUNT(*) AS n FROM issues WHERE category='Equipment'")->fetch_assoc()['n'];
$issFacility = (int) $conn->query("SELECT COUNT(*) AS n FROM issues WHERE category='Facility'")->fetch_assoc()['n'];
$issSoftware = (int) $conn->query("SELECT COUNT(*) AS n FROM issues WHERE category='Software'")->fetch_assoc()['n'];

// Distinct campuses for filter
$campusResult = $conn->query("SELECT DISTINCT campus FROM laboratories ORDER BY campus");
$campuses     = [];
while ($row = $campusResult->fetch_assoc()) {
    $campuses[] = $row['campus'];
}
?>

<h2>Reports &amp; Analytics</h2>

<!-- ── Campus filter ── -->
<div style="display:flex; align-items:center; gap:10px; margin:16px 0 24px; flex-wrap:wrap;">
    <label style="font-weight:700; font-size:.85rem;">Filter by Campus:</label>

    <button class="campus-btn active" data-campus="all"
        style="padding:7px 16px; border-radius:4px; border:1px solid #2c5f2e;
               background:#2c5f2e; color:white; cursor:pointer; font-size:.83rem;
               transition:all .2s;">
        All Campuses
    </button>

    <?php foreach ($campuses as $c): ?>
    <button class="campus-btn" data-campus="<?php echo htmlspecialchars($c); ?>"
        style="padding:7px 16px; border-radius:4px; border:1px solid #2c5f2e;
               background:white; color:#2c5f2e; cursor:pointer; font-size:.83rem;
               transition:all .2s;">
        <?php echo htmlspecialchars($c); ?>
    </button>
    <?php endforeach; ?>

    <!-- Loading spinner (hidden by default) -->
    <span id="chartLoader" style="display:none; font-size:.8rem; color:#888; font-style:italic;">
        Updating...
    </span>
</div>

<!-- ── Charts side by side ── -->
<div style="display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start;">

    <div style="flex:1; min-width:280px; background:#f9f9f9; border:1px solid #eee; border-radius:6px; padding:16px;">
        <h3 style="margin:0 0 12px; font-size:.9rem; color:#2c5f2e;">Reservations by Status</h3>
        <canvas id="reservationChart"></canvas>
    </div>

    <div style="flex:1; min-width:280px; background:#f9f9f9; border:1px solid #eee; border-radius:6px; padding:16px;">
        <h3 style="margin:0 0 12px; font-size:.9rem; color:#2c5f2e;">Issues by Category</h3>
        <canvas id="issueChart"></canvas>
    </div>

</div>

<!-- Summary text updated by JS -->
<p id="chartSummary" style="margin-top:16px; font-size:.82rem; color:#666; font-style:italic;"></p>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
(function () {

    // ── Initial data from PHP (avoids first AJAX call on load) ──
    const initData = {
        reservation_counts: [
            <?php echo $approved; ?>,
            <?php echo $rejected; ?>,
            <?php echo $pending; ?>
        ],
        issue_counts: [
            <?php echo $issEquip; ?>,
            <?php echo $issFacility; ?>,
            <?php echo $issSoftware; ?>
        ],
    };

    // ── Build reservation bar chart ──────────────────────────────
    const resCtx = document.getElementById('reservationChart').getContext('2d');
    const resChart = new Chart(resCtx, {
        type: 'bar',
        data: {
            labels: ['Approved', 'Rejected', 'Pending'],
            datasets: [{
                label: 'Reservations',
                data: initData.reservation_counts,
                backgroundColor: ['#2ecc71', '#e74c3c', '#f39c12'],
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        // Show percentage in tooltip
                        label: function (ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct   = total > 0
                                ? ' (' + Math.round(ctx.raw / total * 100) + '%)'
                                : '';
                            return ' ' + ctx.raw + pct;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });

    // ── Build issue doughnut chart ───────────────────────────────
    const issCtx = document.getElementById('issueChart').getContext('2d');
    const issChart = new Chart(issCtx, {
        type: 'doughnut',
        data: {
            labels: ['Equipment', 'Facility', 'Software'],
            datasets: [{
                data: initData.issue_counts,
                backgroundColor: ['#3498db', '#9b59b6', '#1abc9c'],
                hoverOffset: 6,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct   = total > 0
                                ? ' (' + Math.round(ctx.raw / total * 100) + '%)'
                                : '';
                            return ' ' + ctx.label + ': ' + ctx.raw + pct;
                        }
                    }
                }
            }
        }
    });

    // ── Update summary text ──────────────────────────────────────
    function updateSummary(data) {
        const total = data.reservation_counts.reduce((a, b) => a + b, 0);
        const totalIss = data.issue_counts.reduce((a, b) => a + b, 0);
        document.getElementById('chartSummary').textContent =
            total + ' total reservations · ' + totalIss + ' total issues reported';
    }

    updateSummary(initData);

    // ── Campus filter: fetch filtered data and redraw ────────────
    const loader = document.getElementById('chartLoader');

    document.querySelectorAll('.campus-btn').forEach(btn => {
        btn.addEventListener('click', function () {

            // Update active button style
            document.querySelectorAll('.campus-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color      = '#2c5f2e';
            });
            this.style.background = '#2c5f2e';
            this.style.color      = 'white';

            const campus = this.dataset.campus;
            loader.style.display = 'inline';

            fetch(window.location.pathname + '?fetch_chart=1&campus=' + encodeURIComponent(campus))
                .then(res => {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(data => {
                    // Update both charts with new data — Chart.js animates the change
                    resChart.data.datasets[0].data = data.reservation_counts;
                    resChart.update();

                    issChart.data.datasets[0].data = data.issue_counts;
                    issChart.update();

                    updateSummary(data);
                    loader.style.display = 'none';
                })
                .catch(err => {
                    loader.style.display = 'none';
                    loader.style.color   = '#e74c3c';
                    loader.textContent   = '⚠ Could not load data.';
                    loader.style.display = 'inline';
                    console.error('Chart fetch failed:', err);
                });
        });
    });

})();
</script>

<?php include("../includes/footer.php"); ?>