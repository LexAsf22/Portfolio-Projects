<?php
require '../../backend/helpers.php';
require_role('teacher');

// Fetch lab usage and pending issues
$total_labs = $pdo->query("SELECT COUNT(*) FROM labs")->fetchColumn();
$pending_issues = $pdo->query("SELECT COUNT(*) FROM issues WHERE status='pending'")->fetchColumn();
$recent_issues = $pdo->query("SELECT i.*, l.name as lab_name FROM issues i JOIN labs l ON i.lab_id=l.id ORDER BY i.reported_at DESC LIMIT 5")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Teacher Dashboard</title>
    <link rel="stylesheet" href="../assets/style.css">
    <style>
        body { font-family: Arial; background-color: #eaf4ea; color: #2a4d2a; margin:0; padding:0;}
        header { background: #2a4d2a; color: white; padding:1rem; text-align:center; }
        nav { background: #3a7d3a; padding:1rem; }
        nav a { color: white; margin-right:1rem; text-decoration:none; font-weight:bold; }
        .container { padding:2rem; }
        .card { background:white; padding:1rem; margin-bottom:1rem; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);}
        .card h3 { margin:0 0 0.5rem 0; }
        table { width:100%; border-collapse:collapse; background:white; }
        th, td { padding:10px; border:1px solid #ccc; text-align:left; }
        th { background:#d5ecd5; }
    </style>
</head>
<body>
<header>
    <h1>Teacher Dashboard</h1>
</header>
<nav>
    <a href="dashboard.php">Dashboard</a>
    <a href="lab_usage.php">Lab Usage</a>
    <a href="report_issue.php">Report Issue</a>
    <a href="issue_status.php">Issue Status</a>
    <a href="../../backend/auth.php?logout=1">Logout</a>
</nav>
<div class="container">
    <div class="card">
        <h3>Total Labs</h3>
        <p><?php echo $total_labs; ?></p>
    </div>
    <div class="card">
        <h3>Pending Issues</h3>
        <p><?php echo $pending_issues; ?></p>
    </div>
    <div class="card">
        <h3>Recent Issues Reported</h3>
        <table>
            <tr>
                <th>ID</th>
                <th>Lab</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
            </tr>
            <?php foreach($recent_issues as $i): ?>
            <tr>
                <td><?php echo $i['id']; ?></td>
                <td><?php echo $i['lab_name']; ?></td>
                <td><?php echo $i['category']; ?></td>
                <td><?php echo $i['priority']; ?></td>
                <td><?php echo $i['status']; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>
</div>
</body>
</html>