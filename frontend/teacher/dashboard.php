<?php
include("../includes/header.php");
checkRole('teacher');

$user_id = $_SESSION['user']['id'];

// AJAX handler
if(isset($_GET['fetch_stats'])){

    $total_issues = $conn->query("SELECT * FROM issues WHERE user_id=$user_id AND status='Pending'")->num_rows;

    $recent_reservations = $conn->query("
        SELECT r.*, l.lab_name, u.name as student_name
        FROM reservations r
        JOIN laboratories l ON r.lab_id = l.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.date DESC
        LIMIT 5
    ");

    $rows = [];

    while($r = $recent_reservations->fetch_assoc()){
        $rows[] = [
            "student"=>$r['student_name'],
            "lab"=>$r['lab_name'],
            "date"=>date("F d, Y", strtotime($r['date'])),
            "time"=>$r['time_slot'],
            "status"=>$r['status']
        ];
    }

    echo json_encode([
        "issues"=>$total_issues,
        "recent_count"=>count($rows),
        "rows"=>$rows
    ]);

    exit;
}

// Normal load
$total_issues = $conn->query("SELECT * FROM issues WHERE user_id=$user_id AND status='Pending'")->num_rows;

$recent_reservations = $conn->query("
    SELECT r.*, l.lab_name, u.name as student_name
    FROM reservations r
    JOIN laboratories l ON r.lab_id = l.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.date DESC
    LIMIT 5
");
?>

<h2>Teacher Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px;">

<div style="background:#4caf50;color:white;padding:20px;flex:1;border-radius:5px;">
<h3>Pending Issues</h3>
<p id="pendingIssues"><?php echo $total_issues; ?></p>
</div>

<div style="background:#f39c12;color:white;padding:20px;flex:1;border-radius:5px;">
<h3>Recent Reservations</h3>
<p id="recentCount"><?php echo $recent_reservations->num_rows; ?></p>
</div>

</div>

<h3 style="margin-top:30px;">Recent Lab Reservations</h3>

<input 
type="text" 
id="searchRes" 
placeholder="Search by student or lab..." 
style="padding:10px;margin:10px 0;width:50%;"
>

<table id="recentTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Student</th>
<th>Lab</th>
<th>Date</th>
<th>Time Slot</th>
<th>Status</th>
</tr>

<?php while($r = $recent_reservations->fetch_assoc()){ ?>
<tr>
<td><?php echo $r['student_name']; ?></td>
<td><?php echo $r['lab_name']; ?></td>
<td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
<td><?php echo $r['time_slot']; ?></td>
<td><?php echo $r['status']; ?></td>
</tr>
<?php } ?>

</table>

<script>

// Dashboard refresh
function refreshDashboard(){

fetch(window.location.pathname + "?fetch_stats=1")
.then(res => res.json())
.then(data => {

document.getElementById("pendingIssues").textContent = data.issues;
document.getElementById("recentCount").textContent = data.recent_count;

const table = document.getElementById("recentTable");
const rows = table.querySelectorAll("tr:not(:first-child)");
rows.forEach(r => r.remove());

data.rows.forEach(r => {

const tr = document.createElement("tr");

tr.innerHTML = `
<td>${r.student}</td>
<td>${r.lab}</td>
<td>${r.date}</td>
<td>${r.time}</td>
<td>${r.status}</td>
`;

table.appendChild(tr);

});

});

}

// Auto refresh every 60 seconds
setInterval(refreshDashboard, 60000);


// Search with debounce
let debounce;

document.getElementById("searchRes").addEventListener("keyup", function(){

clearTimeout(debounce);

debounce = setTimeout(()=>{

const filter = this.value.toLowerCase();
const rows = document.querySelectorAll("#recentTable tr:not(:first-child)");

rows.forEach(row=>{
row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
});

},200);

});

</script>

<?php include("../includes/footer.php"); ?>