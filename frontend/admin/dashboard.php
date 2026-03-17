<?php
include("../includes/header.php");
checkRole('admin');

// ── AJAX: return stats as JSON ────────────────────────────────────────────────
if (isset($_GET['fetch_stats'])) {
    // COUNT(*) is far more efficient than SELECT * for counting
    $total = $conn->query("SELECT COUNT(*) AS n FROM reservations")->fetch_assoc()['n'];
    $pend  = $conn->query("SELECT COUNT(*) AS n FROM reservations WHERE status='Pending'")->fetch_assoc()['n'];
    $iss   = $conn->query("SELECT COUNT(*) AS n FROM issues")->fetch_assoc()['n'];

    header('Content-Type: application/json');
    echo json_encode([
        'total_reservations' => (int) $total,
        'total_pending'      => (int) $pend,
        'total_issues'       => (int) $iss,
    ]);
    exit;
}

// ── Normal page load ──────────────────────────────────────────────────────────
$total = $conn->query("SELECT COUNT(*) AS n FROM reservations")->fetch_assoc()['n'];
$pend  = $conn->query("SELECT COUNT(*) AS n FROM reservations WHERE status='Pending'")->fetch_assoc()['n'];
$iss   = $conn->query("SELECT COUNT(*) AS n FROM issues")->fetch_assoc()['n'];
?>

<h2>Admin Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px; flex-wrap:wrap;">

    <div style="background:#4caf50; color:white; padding:20px; flex:1; border-radius:5px; min-width:160px;">
        <h3 style="margin:0 0 8px; font-size:.95rem;">Total Reservations</h3>
        <p id="totalReservations" style="font-size:2rem; margin:0; font-weight:700;">
            <?php echo $total; ?>
        </p>
    </div>

    <div style="background:#f39c12; color:white; padding:20px; flex:1; border-radius:5px; min-width:160px;">
        <h3 style="margin:0 0 8px; font-size:.95rem;">Pending Approvals</h3>
        <p id="pendingReservations" style="font-size:2rem; margin:0; font-weight:700;">
            <?php echo $pend; ?>
        </p>
    </div>

    <div style="background:#e74c3c; color:white; padding:20px; flex:1; border-radius:5px; min-width:160px;">
        <h3 style="margin:0 0 8px; font-size:.95rem;">Reported Issues</h3>
        <p id="reportedIssues" style="font-size:2rem; margin:0; font-weight:700;">
            <?php echo $iss; ?>
        </p>
    </div>

</div>

<!-- Status bar: shows last refreshed time and any error -->
<p id="refreshStatus" style="
    margin-top: 10px;
    font-size: .78rem;
    color: #888;
    font-style: italic;
"></p>

<script>
(function () {

    // The three stat elements we update
    const els = {
        total:   document.getElementById('totalReservations'),
        pending: document.getElementById('pendingReservations'),
        issues:  document.getElementById('reportedIssues'),
    };

    const statusBar = document.getElementById('refreshStatus');

    /**
     * Briefly flash a card's background to signal it just updated.
     * Only fires when the value actually changed — no pointless flicker.
     */
    function flashCard(el, newValue) {
        const oldValue = el.textContent.trim();
        if (oldValue === String(newValue)) return; // nothing changed, skip

        el.textContent = newValue;

        const card = el.closest('div');
        if (!card) return;

        const original = card.style.filter;
        card.style.transition = 'filter .3s';
        card.style.filter     = 'brightness(1.25)';
        setTimeout(() => {
            card.style.filter = original || '';
        }, 350);
    }

    /**
     * Fetch fresh stats from the server and update the three cards.
     * Uses textContent (never innerHTML) to prevent XSS.
     */
    function loadDashboardStats() {
        fetch(window.location.pathname + '?fetch_stats=1')
            .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(data => {
                flashCard(els.total,   data.total_reservations);
                flashCard(els.pending, data.total_pending);
                flashCard(els.issues,  data.total_issues);

                // Show a small "last updated" timestamp
                const now = new Date();
                const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                statusBar.style.color = '#888';
                statusBar.textContent = 'Last updated at ' + time;
            })
            .catch(err => {
                // Don't crash silently — tell the admin something went wrong
                statusBar.style.color = '#e74c3c';
                statusBar.textContent = '⚠ Could not refresh stats. Will retry shortly.';
                console.error('Dashboard refresh failed:', err);
            });
    }

    // Auto-refresh every 60 seconds
    setInterval(loadDashboardStats, 60_000);

})();
</script>

<?php include("../includes/footer.php"); ?>