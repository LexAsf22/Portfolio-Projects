<?php
require '../../backend/helpers.php';
require_role('admin');

// Add/Edit/Delete equipment
if(isset($_POST['add_equipment'])) {
    $stmt = $pdo->prepare("INSERT INTO equipment (name,type,lab_id,status) VALUES (?, ?, ?, 'available')");
    $stmt->execute([$_POST['name'], $_POST['type'], $_POST['lab_id']]);
    header("Location: inventory.php"); exit();
}

if(isset($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM equipment WHERE id=?");
    $stmt->execute([$_GET['delete']]);
    header("Location: inventory.php"); exit();
}

$equipment_list = $pdo->query("SELECT e.*, l.name as lab_name FROM equipment e JOIN labs l ON e.lab_id=l.id")->fetchAll();
$labs = $pdo->query("SELECT * FROM labs")->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Inventory Management</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Inventory Management</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="inventory.php" style="color:white;">Inventory</a>
</nav>
<div style="padding:2rem;">
    <h3>Add Equipment</h3>
    <form method="POST">
        Name: <input type="text" name="name" required>
        Type:
        <select name="type">
            <option value="computer">Computer</option>
            <option value="chemical">Chemical</option>
            <option value="furniture">Furniture</option>
        </select>
        Lab:
        <select name="lab_id">
            <?php foreach($labs as $lab): ?>
            <option value="<?php echo $lab['id']; ?>"><?php echo $lab['name']; ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit" name="add_equipment">Add</button>
    </form>
    <h3>Equipment List</h3>
    <table border="1" cellpadding="10" style="width:100%; background:white; border-collapse:collapse;">
        <tr style="background:#d5ecd5;">
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Lab</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        <?php foreach($equipment_list as $e): ?>
        <tr>
            <td><?php echo $e['id']; ?></td>
            <td><?php echo $e['name']; ?></td>
            <td><?php echo $e['type']; ?></td>
            <td><?php echo $e['lab_name']; ?></td>
            <td><?php echo $e['status']; ?></td>
            <td><a href="?delete=<?php echo $e['id']; ?>">Delete</a></td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>