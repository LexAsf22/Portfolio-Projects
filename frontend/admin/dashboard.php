<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('admin');

// Campus filter
$selectedCampus = $_GET['campus'] ?? 'All';

// Build campus condition (not used directly here but you can extend queries with it)
$campusCondition = "";
if ($selectedCampus !== "All") {
    $campusCondition = " WHERE campus='".$conn->real_escape_string($selectedCampus)."'";
}

// Statistics
$totalReservations = $conn->query("SELECT COUNT(*) as total FROM reservations")->fetch_assoc()['total'];
$pendingReservations = $conn->query("SELECT COUNT(*) as total FROM reservations WHERE status='Pending'")->fetch_assoc()['total'];
$totalIssues = $conn->query("SELECT COUNT(*) as total FROM issues")->fetch_assoc()['total'];
$equipmentCount = $conn->query("SELECT COUNT(*) as total FROM equipment")->fetch_assoc()['total'];

include("../includes/header.php");
?>

<style>
.dashboard-grid {
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(220px,1fr));
    gap:15px;
}

.stat-card {
    background:white;
    padding:20px;
    border-radius:10px;
    box-shadow:0 3px 8px rgba(0,0,0,0.08);
}

.stat-card h3 {
    margin:0;
    font-size:28px;
}

.stat-card p {
    margin:5px 0 0;
    color:#777;
}

.campus-filter {
    margin-bottom:20px;
}

select {
    padding:6px;
}

/* Tabs styling */
.tabs {
  margin-bottom: 20px;
}

.tab-btn {
  background: #eee;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  color: #333;
}

.tab-btn.active {
  background: white;
  border-bottom: 2px solid #3498db;
  color: #3498db;
}

.tab-content {
  background: white;
  padding: 20px;
  border-radius: 0 6px 6px 6px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}

/* Table styling */
table {
    width:100%;
    border-collapse:collapse;
}

th, td {
    padding:10px;
    border-bottom:1px solid #ddd;
    text-align:left;
}
</style>

<h2>Admin Dashboard</h2>

<div class="campus-filter">
<form method="GET">
<select name="campus">
    <option value="All" <?= ($selectedCampus=='All') ? 'selected' : '' ?>>All Campuses</option>
    <option value="Campus A" <?= ($selectedCampus=='Campus A') ? 'selected' : '' ?>>Campus A</option>
    <option value="Campus B" <?= ($selectedCampus=='Campus B') ? 'selected' : '' ?>>Campus B</option>
</select>
<button type="submit">Filter</button>
</form>
</div>

<div class="dashboard-grid">
  <div class="stat-card">
    <h3><?= $totalReservations ?></h3>
    <p>Total Reservations</p>
  </div>

  <div class="stat-card">
    <h3><?= $pendingReservations ?></h3>
    <p>Pending Approvals</p>
  </div>

  <div class="stat-card">
    <h3><?= $totalIssues ?></h3>
    <p>Maintenance Issues</p>
  </div>

  <div class="stat-card">
    <h3><?= $equipmentCount ?></h3>
    <p>Total Equipment</p>
  </div>
</div>

<!-- Tabs -->
<div class="tabs">
  <button class="tab-btn active" data-tab="reservations">Recent Reservations</button>
  <button class="tab-btn" data-tab="issues">Recent Maintenance Issues</button>
</div>

<!-- Tab contents -->

<div id="reservations" class="tab-content">
  <h3>Recent Reservations</h3>
  <table>
    <tr>
      <th>User</th>
      <th>Lab</th>
      <th>Date</th>
      <th>Status</th>
    </tr>

    <?php
    $sql = "SELECT r.*, u.name, l.lab_name
            FROM reservations r
            JOIN users u ON r.user_id=u.id
            JOIN labs l ON r.lab_id=l.id
            ORDER BY r.id DESC LIMIT 5";

    $result = $conn->query($sql);

    while($row = $result->fetch_assoc()){
      echo "<tr>
      <td>".e($row['name'])."</td>
      <td>".e($row['lab_name'])."</td>
      <td>".formatDate($row['date'])."</td>
      <td>".statusBadge($row['status'])."</td>
      </tr>";
    }
    ?>
  </table>
</div>

<div id="issues" class="tab-content" style="display:none;">
  <h3>Recent Maintenance Issues</h3>
  <table>
    <tr>
      <th>Campus</th>
      <th>Room</th>
      <th>Category</th>
      <th>Status</th>
    </tr>

    <?php
    $sql = "SELECT * FROM issues ORDER BY id DESC LIMIT 5";
    $result = $conn->query($sql);

    while($row = $result->fetch_assoc()){
      echo "<tr>
      <td>".e($row['campus'])."</td>
      <td>".e($row['room'])."</td>
      <td>".e($row['category'])."</td>
      <td>".statusBadge($row['status'])."</td>
      </tr>";
    }
    ?>
  </table>
</div>

<script>
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active classes
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');

      // Activate current tab and show content
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).style.display = 'block';
    });
  });
</script>

<?php include("../includes/footer.php"); ?>