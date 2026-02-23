<?php
require '../../backend/helpers.php';
require_role('student');

$labs = get_labs();
$success = $error = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $lab_id = $_POST['lab_id'];
    $equipment_ids = $_POST['equipment'] ?? [];
    $start_time = $_POST['start_time'];
    $end_time = $_POST['end_time'];

    // Check availability
    $available = true;
    foreach($equipment_ids as $eid){
        if(!check_equipment_availability($eid, $start_time, $end_time)){
            $available = false;
            break;
        }
    }

    if($available && create_booking($_SESSION['user']['id'], $lab_id, $equipment_ids, $start_time, $end_time)){
        $success = "Equipment reservation requested successfully!";
    } else {
        $error = "Equipment not available or reservation failed.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reserve Equipment</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header style="background:#2a4d2a; color:white; padding:1rem;">
    <h1>Reserve Equipment</h1>
</header>
<nav style="background:#3a7d3a; padding:1rem;">
    <a href="dashboard.php" style="color:white; margin-right:1rem;">Dashboard</a>
    <a href="reserve_equipment.php" style="color:white;">Reserve Equipment</a>
</nav>
<div style="padding:2rem; background:#eaf4ea;">
    <?php if($error) echo "<p style='color:red;'>$error</p>"; ?>
    <?php if($success) echo "<p style='color:green;'>$success</p>"; ?>

    <form method="POST">
        Lab:
        <select name="lab_id" id="lab_select" required onchange="fetchEquipment(this.value)">
            <option value="">Select Lab</option>
            <?php foreach($labs as $lab): ?>
            <option value="<?php echo $lab['id']; ?>"><?php echo $lab['name']; ?></option>
            <?php endforeach; ?>
        </select><br><br>
        Equipment:<br>
        <div id="equipment_list">Select a lab to load equipment</div><br>
        Start Time: <input type="datetime-local" name="start_time" required><br><br>
        End Time: <input type="datetime-local" name="end_time" required><br><br>
        <button type="submit">Reserve Equipment</button>
    </form>
</div>
<script>
function fetchEquipment(labId){
    const equipmentDiv = document.getElementById('equipment_list');
    fetch('../../backend/get_equipment.php?lab_id='+labId)
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(e => {
                html += `<input type="checkbox" name="equipment[]" value="${e.id}">${e.name} (${e.type})<br>`;
            });
            equipmentDiv.innerHTML = html;
        });
}
</script>
</body>
</html>