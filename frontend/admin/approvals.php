<?php
include("../includes/header.php");
checkRole('admin');

// ── AJAX: Approve ──
if (isset($_GET['approve']) && isset($_GET['ajax'])) {
    $id   = (int) $_GET['approve'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Approved' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    header('Content-Type: application/json');
    echo json_encode(['success' => $success]);
    exit;
}

// ── AJAX: Reject ──
if (isset($_GET['reject']) && isset($_GET['ajax'])) {
    $id   = (int) $_GET['reject'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Rejected' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    header('Content-Type: application/json');
    echo json_encode(['success' => $success]);
    exit;
}

// ── Normal page load (non-AJAX) fallback ──
if (isset($_GET['approve'])) {
    $id   = (int) $_GET['approve'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Approved' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setFlash("Reservation approved successfully!", "success");
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

if (isset($_GET['reject'])) {
    $id   = (int) $_GET['reject'];
    $stmt = $conn->prepare("UPDATE reservations SET status='Rejected' WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setFlash("Reservation rejected.", "error");
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// ── Fetch all pending ──
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
    <span id="pendingBadge" style="
        background:#f39c12; color:white;
        padding:3px 10px; border-radius:12px;
        font-size:.85rem; vertical-align:middle;
        transition: background .4s;
    ">
        <?php echo $pending_count; ?> pending
    </span>
</h2>

<?php echo getFlash(); ?>

<?php if ($pending_count === 0): ?>
    <div id="emptyState" style="
        background:#d4edda; color:#155724;
        border:1px solid #c3e6cb;
        padding:16px; border-radius:8px; margin-top:20px;
    ">
        ✓ No pending reservations. All caught up!
    </div>
<?php else: ?>

    <!-- ── Toolbar: Search + Filter ── -->
    <div style="display:flex; gap:10px; align-items:center; margin:14px 0 10px; flex-wrap:wrap;">
        <input
            type="text"
            id="searchInput"
            placeholder="Search by student, lab, or equipment..."
            style="padding:10px; flex:1; min-width:220px; border:1px solid #ccc; border-radius:5px;"
        >

        <!-- Type filter buttons -->
        <div id="typeFilter" style="display:flex; gap:6px;">
            <button class="filter-btn active" data-type="all"
                style="padding:8px 16px; border-radius:5px; border:1px solid #2c5f2e;
                       background:#2c5f2e; color:white; cursor:pointer; font-size:.85rem;
                       transition: all .2s;">
                All
            </button>
            <button class="filter-btn" data-type="Lab"
                style="padding:8px 16px; border-radius:5px; border:1px solid #2c5f2e;
                       background:white; color:#2c5f2e; cursor:pointer; font-size:.85rem;
                       transition: all .2s;">
                Labs
            </button>
            <button class="filter-btn" data-type="Equipment"
                style="padding:8px 16px; border-radius:5px; border:1px solid #2c5f2e;
                       background:white; color:#2c5f2e; cursor:pointer; font-size:.85rem;
                       transition: all .2s;">
                Equipment
            </button>
        </div>
    </div>

    <!-- ── Flash message area for AJAX feedback ── -->
    <div id="ajaxFlash" style="
        display:none;
        padding:12px 16px;
        border-radius:6px;
        margin-bottom:12px;
        font-size:.9rem;
        transition: opacity .3s;
    "></div>

    <!-- ── No results message (shown by JS when search finds nothing) ── -->
    <div id="noResults" style="
        display:none;
        color:#888;
        font-style:italic;
        padding:16px 0;
    ">No reservations match your search.</div>

    <table id="approvalTable" border="1" cellpadding="10" cellspacing="0"
           style="border-collapse:collapse; width:100%; margin-top:4px;">
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
        <tbody id="approvalBody">
        <?php while ($row = $reservations->fetch_assoc()):
            $isLab = !empty($row['lab_id']);
            $type  = $isLab ? 'Lab' : 'Equipment';
            $name  = $isLab ? $row['lab_name'] : $row['equipment_name'];
        ?>
            <tr data-id="<?php echo $row['id']; ?>" data-type="<?php echo $type; ?>">
                <td><?php echo $row['id']; ?></td>
                <td><?php echo htmlspecialchars($row['student_name']); ?></td>
                <td><?php echo $type; ?></td>
                <td><?php echo htmlspecialchars($name ?? '—'); ?></td>
                <td><?php echo date("F d, Y", strtotime($row['date'])); ?></td>
                <td><?php echo htmlspecialchars($row['time_slot'] ?? '—'); ?></td>
                <td style="white-space:nowrap;">
                    <button
                        class="approveBtn action-btn"
                        data-id="<?php echo $row['id']; ?>"
                        data-action="approve"
                        style="
                            background:#28a745; color:white;
                            padding:6px 14px; border-radius:4px;
                            border:none; font-size:.85rem;
                            cursor:pointer; margin-right:6px;
                            transition: opacity .2s;
                        "
                    >✓ Approve</button>
                    <button
                        class="rejectBtn action-btn"
                        data-id="<?php echo $row['id']; ?>"
                        data-action="reject"
                        style="
                            background:#e74c3c; color:white;
                            padding:6px 14px; border-radius:4px;
                            border:none; font-size:.85rem;
                            cursor:pointer;
                            transition: opacity .2s;
                        "
                    >✗ Reject</button>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>

<?php endif; ?>

<script>
(function () {

    // ── Helpers ──────────────────────────────────────────────

    /**
     * Show a temporary flash message in the #ajaxFlash div.
     * type: 'success' | 'error'
     */
    function showFlash(message, type) {
        const flash = document.getElementById('ajaxFlash');
        if (!flash) return;

        flash.textContent = message;
        flash.style.display = 'block';
        flash.style.opacity = '1';
        flash.style.background = type === 'success' ? '#d4edda' : '#f8d7da';
        flash.style.color       = type === 'success' ? '#155724' : '#721c24';
        flash.style.border      = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => { flash.style.display = 'none'; }, 300);
        }, 3000);
    }

    /**
     * Disable both action buttons on a row while a request is in flight.
     * Prevents double-clicking.
     */
    function setRowLoading(row, isLoading) {
        row.querySelectorAll('.action-btn').forEach(btn => {
            btn.disabled = isLoading;
            btn.style.opacity = isLoading ? '0.5' : '1';
            btn.style.cursor  = isLoading ? 'not-allowed' : 'pointer';
        });
    }

    /**
     * Smoothly fade a table row out then remove it from the DOM.
     */
    function fadeOutRow(row, onDone) {
        row.style.transition  = 'opacity .4s, background .4s';
        row.style.background  = '#f0fff4';   // brief green flash for approve
        row.style.opacity     = '0';
        setTimeout(() => {
            row.remove();
            if (typeof onDone === 'function') onDone();
        }, 450);
    }

    /**
     * Update the pending badge count. Turns badge red when zero.
     */
    function updateBadge() {
        const badge = document.getElementById('pendingBadge');
        const body  = document.getElementById('approvalBody');
        if (!badge || !body) return;

        // Count only visible rows (not hidden by filter/search)
        const remaining = body.querySelectorAll('tr').length;
        badge.textContent = remaining + ' pending';

        if (remaining === 0) {
            badge.style.background = '#6c757d';

            // Show the "all caught up" message and hide the table
            const table = document.getElementById('approvalTable');
            const empty = document.getElementById('emptyState') ||
                          (() => {
                              const d = document.createElement('div');
                              d.id = 'emptyState';
                              d.style.cssText = 'background:#d4edda;color:#155724;border:1px solid #c3e6cb;padding:16px;border-radius:8px;margin-top:20px;';
                              d.textContent   = '✓ No pending reservations. All caught up!';
                              table.insertAdjacentElement('afterend', d);
                              return d;
                          })();

            if (table) table.style.display = 'none';
            empty.style.display = 'block';
        }
    }

    // ── AJAX Approve / Reject ─────────────────────────────────

    document.getElementById('approvalBody')?.addEventListener('click', function (e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const action = btn.dataset.action;           // 'approve' or 'reject'
        const id     = btn.dataset.id;
        const row    = btn.closest('tr');

        const label  = action === 'approve' ? 'Approve' : 'Reject';
        const msg    = action === 'approve'
            ? 'Approve this reservation?'
            : 'Reject this reservation?';

        if (!confirm(msg)) return;

        // Disable buttons immediately to prevent double-click
        setRowLoading(row, true);

        fetch(`${window.location.pathname}?${action}=${id}&ajax=1`)
            .then(res => {
                if (!res.ok) throw new Error('Server error: ' + res.status);
                return res.json();
            })
            .then(data => {
                if (!data.success) throw new Error('Action failed');

                // If rejecting, briefly flash the row red before removing
                if (action === 'reject') {
                    row.style.background = '#fff0f0';
                }

                fadeOutRow(row, updateBadge);
                showFlash(
                    action === 'approve'
                        ? '✓ Reservation approved successfully!'
                        : '✗ Reservation rejected.',
                    action === 'approve' ? 'success' : 'error'
                );
            })
            .catch(err => {
                // Re-enable buttons so admin can try again
                setRowLoading(row, false);
                showFlash('Something went wrong. Please try again.', 'error');
                console.error('Approval action failed:', err);
            });
    });

    // ── Search Filter ─────────────────────────────────────────

    let searchTimeout = null;

    document.getElementById('searchInput')?.addEventListener('keyup', function () {
        clearTimeout(searchTimeout);

        // Debounce: wait 200ms after typing stops before filtering
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 200);
    });

    // ── Type Filter Buttons (All / Lab / Equipment) ───────────

    document.getElementById('typeFilter')?.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        // Update active button style
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.style.background = 'white';
            b.style.color      = '#2c5f2e';
        });
        btn.style.background = '#2c5f2e';
        btn.style.color      = 'white';

        // Store active filter on the container for applyFilters() to read
        this.dataset.active = btn.dataset.type;
        applyFilters();
    });

    /**
     * Apply both search text and type filter simultaneously.
     * Runs on every keyup and every filter button click.
     */
    function applyFilters() {
        const searchText   = (document.getElementById('searchInput')?.value || '').toLowerCase();
        const activeType   = document.getElementById('typeFilter')?.dataset.active || 'all';
        const rows         = document.querySelectorAll('#approvalBody tr');
        let   visibleCount = 0;

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const rowType = row.dataset.type;   // 'Lab' or 'Equipment'

            const matchesSearch = !searchText || rowText.includes(searchText);
            const matchesType   = activeType === 'all' || rowType === activeType;

            if (matchesSearch && matchesType) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Show "no results" message if nothing matched
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Set default filter state
    document.getElementById('typeFilter').dataset.active = 'all';

})(); // End IIFE — keeps all variables out of global scope
</script>

<?php include("../includes/footer.php"); ?>