<?php
include("../includes/header.php");
checkRole('admin');

if (isset($_POST['add'])) {
    $lab_id = (int)  $_POST['lab'];
    $name   = trim(  $_POST['equipment_name'] ?? '');
    $qty    = (int)  $_POST['quantity'];

    if ($name === '' || $lab_id === 0 || $qty < 0) {
        setFlash("Please fill in all fields correctly.", "error");
    } else {
        $stmt = $conn->prepare("
            INSERT INTO equipment (equipment_name, lab_id, quantity, status)
            VALUES (?, ?, ?, 'Available')
        ");
        $stmt->bind_param("sii", $name, $lab_id, $qty);
        $stmt->execute();
        setFlash("Equipment added successfully!", "success");
    }
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

if (isset($_GET['delete'])) {
    $id   = (int) $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM equipment WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setFlash("Equipment deleted.", "error");
    $qs = http_build_query([
        'page'       => $_GET['page']       ?? 1,
        'search'     => $_GET['search']     ?? '',
        'lab_filter' => $_GET['lab_filter'] ?? 0,
    ]);
    header("Location: " . $_SERVER['PHP_SELF'] . '?' . $qs);
    exit;
}

$per_page    = 10;
$page        = max(1, (int) ($_GET['page']       ?? 1));
$search      = trim(         $_GET['search']     ?? '');
$filter_lab  = (int)         ($_GET['lab_filter'] ?? 0);
$search_like = '%' . $search . '%';

$where  = "WHERE 1=1";
$params = [];
$types  = "";

if ($search !== '') {
    $where   .= " AND (e.equipment_name LIKE ? OR l.lab_name LIKE ? OR e.status LIKE ?)";
    $params[] = $search_like;
    $params[] = $search_like;
    $params[] = $search_like;
    $types   .= "sss";
}
if ($filter_lab > 0) {
    $where   .= " AND e.lab_id = ?";
    $params[] = $filter_lab;
    $types   .= "i";
}

$count_stmt = $conn->prepare("
    SELECT COUNT(*) AS total 
    FROM equipment e 
    JOIN laboratories l ON e.lab_id = l.id 
    $where
");
if ($types !== '') $count_stmt->bind_param($types, ...$params);
$count_stmt->execute();
$total_rows  = $count_stmt->get_result()->fetch_assoc()['total'];
$total_pages = max(1, ceil($total_rows / $per_page));
$page        = min($page, $total_pages);
$offset      = ($page - 1) * $per_page;

$data_stmt = $conn->prepare("
    SELECT e.*, l.lab_name
    FROM   equipment e
    JOIN   laboratories l ON e.lab_id = l.id
    $where
    ORDER  BY l.lab_name, e.equipment_name
    LIMIT  ? OFFSET ?
");
$data_stmt->bind_param($types . "ii", ...array_merge($params, [$per_page, $offset]));
$data_stmt->execute();
$equipment = $data_stmt->get_result();

$labs = $conn->query("SELECT * FROM laboratories ORDER BY campus, lab_name");

function pageUrl(int $p): string {
    $q = $_GET;
    $q['page'] = $p;
    unset($q['delete']);
    return '?' . http_build_query($q);
}
?>

<style>
    .inv-wrap            { max-width: 860px; font-size: .9rem; }
    .inv-form            { background:#f9f9f9; border:1px solid #ddd; border-radius:6px; padding:14px 16px; margin-bottom:16px; }
    .inv-form h3         { margin:0 0 10px; font-size:.93rem; color:#2c5f2e; }
    .inv-grid            { display:grid; grid-template-columns:1fr 1fr 100px; gap:10px; align-items:end; }
    .inv-field label     { display:block; font-size:.72rem; font-weight:700; color:#555; margin-bottom:3px; text-transform:uppercase; letter-spacing:.04em; }
    .inv-field select,
    .inv-field input     { width:100%; padding:7px 9px; border:1px solid #ccc; border-radius:4px; font-size:.88rem; box-sizing:border-box; }

    .filter-bar          { display:flex; gap:7px; align-items:center; flex-wrap:wrap; margin-bottom:10px; }
    .filter-bar input    { padding:7px 10px; border:1px solid #ccc; border-radius:4px; font-size:.85rem; width:200px; }
    .filter-bar select   { padding:7px 10px; border:1px solid #ccc; border-radius:4px; font-size:.85rem; }

    .btn-green           { padding:7px 16px; background:#2c5f2e; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:.85rem; }
    .btn-green:hover     { background:#1e3d1a; }
    .btn-search          { padding:7px 14px; background:#2c5f2e; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:.85rem; }
    .btn-clear           { padding:7px 11px; background:#e74c3c; color:#fff; border-radius:4px; text-decoration:none; font-size:.82rem; }
    .summary             { margin-left:auto; font-size:.8rem; color:#777; }

    .inv-table           { width:100%; border-collapse:collapse; font-size:.85rem; margin-bottom:10px; }
    .inv-table thead th  { background:#2c5f2e; color:#fff; padding:8px 10px; text-align:left; font-size:.75rem; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; }
    .inv-table tbody td  { padding:7px 10px; border-bottom:1px solid #eee; vertical-align:middle; }
    .inv-table tbody tr:hover { background:#f7f7f7; }

    .badge               { padding:2px 8px; border-radius:10px; font-size:.74rem; font-weight:600; display:inline-block; white-space:nowrap; }
    .badge-green         { background:#d4edda; color:#155724; }
    .badge-yellow        { background:#fff3cd; color:#856404; }
    .badge-red           { background:#f8d7da; color:#721c24; }
    .badge-gray          { background:#e2e3e5; color:#383d41; }

    .btn-delete          { display:inline-block; padding:3px 9px; background:#e74c3c; color:#fff; border-radius:3px; text-decoration:none; font-size:.76rem; }
    .btn-delete:hover    { background:#c0392b; color:#fff; }

    /* Pagination */
    .pagination          { display:flex; gap:4px; align-items:center; flex-wrap:wrap; margin-top:4px; }
    .pagination a        { padding:5px 10px; border:1px solid #ccc; border-radius:4px; text-decoration:none; color:#333; font-size:.82rem; }
    .pagination a:hover  { background:#f0f0f0; }
    .pagination a.active { background:#2c5f2e; color:#fff; border-color:#2c5f2e; font-weight:700; }
    /* Disabled arrow style */
    .pagination .pg-disabled {
        padding:5px 10px;
        border:1px solid #eee;
        border-radius:4px;
        color:#ccc;
        font-size:.82rem;
        cursor:default;
        user-select:none;
    }
    .pg-info             { font-size:.8rem; color:#777; margin-left:4px; }
</style>

<div class="inv-wrap">

<h2 style="margin:0 0 14px; font-size:1.2rem;">Inventory Management</h2>
<?php echo getFlash(); ?>

<!-- ADD FORM -->
<div class="inv-form">
    <h3>+ Add Equipment</h3>
    <form method="POST">
        <div class="inv-grid">
            <div class="inv-field">
                <label>Lab</label>
                <select name="lab" required>
                    <option value="">-- Select Lab --</option>
                    <?php
                    $cg = '';
                    while ($lab = $labs->fetch_assoc()):
                        if ($lab['campus'] !== $cg):
                            if ($cg !== '') echo '</optgroup>';
                            $cg = $lab['campus'];
                            echo '<optgroup label="' . htmlspecialchars($cg) . '">';
                        endif;
                    ?>
                        <option value="<?php echo $lab['id']; ?>">
                            <?php echo htmlspecialchars($lab['lab_name']); ?>
                        </option>
                    <?php endwhile;
                    if ($cg !== '') echo '</optgroup>'; ?>
                </select>
            </div>
            <div class="inv-field">
                <label>Equipment Name</label>
                <input type="text" name="equipment_name" placeholder="e.g. Microscope" required>
            </div>
            <div class="inv-field">
                <label>Quantity</label>
                <input type="number" name="quantity" placeholder="0" min="1" required>
            </div>
        </div>
        <div style="margin-top:10px;">
            <button name="add" class="btn-green">Add Equipment</button>
        </div>
    </form>
</div>

<!-- SEARCH & FILTER -->
<form method="GET" class="filter-bar">
    <input
        type="text"
        name="search"
        value="<?php echo htmlspecialchars($search); ?>"
        placeholder="Search name, lab, status..."
    >
    <select name="lab_filter">
        <option value="">All Labs</option>
        <?php
        $labs2 = $conn->query("SELECT * FROM laboratories ORDER BY campus, lab_name");
        $cg2   = '';
        while ($lab = $labs2->fetch_assoc()):
            if ($lab['campus'] !== $cg2):
                if ($cg2 !== '') echo '</optgroup>';
                $cg2 = $lab['campus'];
                echo '<optgroup label="' . htmlspecialchars($cg2) . '">';
            endif;
            $sel = ($filter_lab === (int)$lab['id']) ? 'selected' : '';
        ?>
            <option value="<?php echo $lab['id']; ?>" <?php echo $sel; ?>>
                <?php echo htmlspecialchars($lab['lab_name']); ?>
            </option>
        <?php endwhile;
        if ($cg2 !== '') echo '</optgroup>'; ?>
    </select>
    <button type="submit" class="btn-search">Search</button>
    <?php if ($search !== '' || $filter_lab > 0): ?>
        <a href="?" class="btn-clear">✕ Clear</a>
    <?php endif; ?>
    <span class="summary">
        Showing <?php echo min($offset+1, $total_rows); ?>–<?php echo min($offset+$per_page, $total_rows); ?>
        of <?php echo $total_rows; ?> items
    </span>
</form>

<!-- TABLE -->
<table class="inv-table">
    <thead>
        <tr>
            <th style="width:36px; text-align:center;">#</th>
            <th>Equipment</th>
            <th>Lab</th>
            <th style="width:55px; text-align:center;">Qty</th>
            <th style="width:110px; text-align:center;">Status</th>
            <th style="width:65px; text-align:center;">Action</th>
        </tr>
    </thead>
    <tbody>
    <?php if ($equipment->num_rows === 0): ?>
        <tr>
            <td colspan="6" style="text-align:center; color:#888; padding:18px; font-style:italic;">
                <?php echo $search !== '' ? 'No results found.' : 'No equipment on record.'; ?>
            </td>
        </tr>
    <?php else: ?>
        <?php
        $n = $offset + 1;
        while ($e = $equipment->fetch_assoc()):
            $status = $e['status'] ?? 'Available';
            $badge  = match($status) {
                'Available'         => 'badge-green',
                'Under Maintenance' => 'badge-yellow',
                'Unavailable'       => 'badge-red',
                default             => 'badge-gray',
            };
            $delete_url = '?' . http_build_query([
                'delete'     => $e['id'],
                'page'       => $page,
                'search'     => $search,
                'lab_filter' => $filter_lab,
            ]);
        ?>
        <tr>
            <td style="text-align:center; color:#aaa;"><?php echo $n++; ?></td>
            <td><?php echo htmlspecialchars($e['equipment_name']); ?></td>
            <td><?php echo htmlspecialchars($e['lab_name']);       ?></td>
            <td style="text-align:center;"><?php echo (int)$e['quantity']; ?></td>
            <td style="text-align:center;">
                <span class="badge <?php echo $badge; ?>">
                    <?php echo htmlspecialchars($status); ?>
                </span>
            </td>
            <td style="text-align:center;">
                <a href="<?php echo $delete_url; ?>" class="btn-delete deleteBtn">Delete</a>
            </td>
        </tr>
        <?php endwhile; ?>
    <?php endif; ?>
    </tbody>
</table>

<!-- PAGINATION -->
<div class="pagination">

    <!-- First & Prev — disabled on page 1 -->
    <?php if ($page > 1): ?>
        <a href="<?php echo pageUrl(1); ?>">«</a>
        <a href="<?php echo pageUrl($page - 1); ?>">‹</a>
    <?php else: ?>
        <span class="pg-disabled">«</span>
        <span class="pg-disabled">‹</span>
    <?php endif; ?>

    <!-- Page numbers -->
    <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
        <a href="<?php echo pageUrl($i); ?>" <?php echo $i === $page ? 'class="active"' : ''; ?>>
            <?php echo $i; ?>
        </a>
    <?php endfor; ?>

    <!-- Next & Last — disabled on last page -->
    <?php if ($page < $total_pages): ?>
        <a href="<?php echo pageUrl($page + 1); ?>">›</a>
        <a href="<?php echo pageUrl($total_pages); ?>">»</a>
    <?php else: ?>
        <span class="pg-disabled">›</span>
        <span class="pg-disabled">»</span>
    <?php endif; ?>

    <span class="pg-info">Page <?php echo $page; ?> of <?php echo $total_pages; ?></span>

</div>

</div>

<script>
document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (!confirm("Delete this equipment? This cannot be undone.")) e.preventDefault();
    });
});
</script>

<?php include("../includes/footer.php"); ?>