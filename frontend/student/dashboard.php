<?php
include("../includes/header.php");
checkRole('student');

$user_id = $_SESSION['user']['id'];

// AJAX request handler
if(isset($_GET['fetch_stats'])){

    $available_labs = $conn->query("SELECT * FROM laboratories")->num_rows;
    $active_reservations = $conn->query("SELECT * FROM reservations WHERE user_id=$user_id AND status='Approved'")->num_rows;

    $upcoming = $conn->query("SELECT r.*, l.lab_name 
        FROM reservations r 
        JOIN laboratories l ON r.lab_id = l.id
        WHERE r.user_id=$user_id AND r.date >= CURDATE()
        ORDER BY r.date ASC LIMIT 5");

    $rows = [];

    while($r = $upcoming->fetch_assoc()){
        $rows[] = [
            "lab"=>$r['lab_name'],
            "date"=>date("F d, Y", strtotime($r['date'])),
            "time"=>$r['time_slot'],
            "status"=>$r['status']
        ];
    }

    echo json_encode([
        "labs"=>$available_labs,
        "active"=>$active_reservations,
        "rows"=>$rows
    ]);

    exit;
}

// Normal page load
$available_labs = $conn->query("SELECT * FROM laboratories")->num_rows;
$active_reservations = $conn->query("SELECT * FROM reservations WHERE user_id=$user_id AND status='Approved'")->num_rows;

$upcoming = $conn->query("SELECT r.*, l.lab_name 
    FROM reservations r 
    JOIN laboratories l ON r.lab_id = l.id
    WHERE r.user_id=$user_id AND r.date >= CURDATE()
    ORDER BY r.date ASC LIMIT 5");
?>

<h2>Student Dashboard</h2>

<div style="display:flex; gap:20px; margin-top:20px;">
    
<div style="background:#4caf50;color:white;padding:20px;flex:1;border-radius:5px;">
<h3>Available Labs</h3>
<p id="availableLabs"><?php echo $available_labs; ?></p>
</div>

<div style="background:#f39c12;color:white;padding:20px;flex:1;border-radius:5px;">
<h3>Active Reservations</h3>
<p id="activeReservations"><?php echo $active_reservations; ?></p>
</div>

</div>

<h3 style="margin-top:30px;">Upcoming Reservations</h3>

<input 
id="searchReservations"
placeholder="Search reservations..."
style="padding:10px;margin:10px 0;width:50%;"
>

<table id="upcomingTable" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr>
<th>Lab</th>
<th>Date</th>
<th>Time Slot</th>
<th>Status</th>
</tr>

<?php while($r = $upcoming->fetch_assoc()){ ?>
<tr>
<td><?php echo $r['lab_name']; ?></td>
<td><?php echo date("F d, Y", strtotime($r['date'])); ?></td>
<td><?php echo $r['time_slot']; ?></td>
<td><?php echo $r['status']; ?></td>
</tr>
<?php } ?>

</table>

<script>

// Refresh dashboard data
function refreshDashboard(){

fetch(window.location.pathname + "?fetch_stats=1")
.then(res => res.json())
.then(data => {

document.getElementById("availableLabs").textContent = data.labs;
document.getElementById("activeReservations").textContent = data.active;

const table = document.getElementById("upcomingTable");
const rows = table.querySelectorAll("tr:not(:first-child)");
rows.forEach(r => r.remove());

data.rows.forEach(r => {

const tr = document.createElement("tr");

tr.innerHTML = `
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


// Search filter with debounce
let debounce;

document.getElementById("searchReservations").addEventListener("keyup", function(){

clearTimeout(debounce);

debounce = setTimeout(()=>{

const filter = this.value.toLowerCase();
const rows = document.querySelectorAll("#upcomingTable tr:not(:first-child)");

rows.forEach(row=>{
row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
});

},200);

});

</script>

<?php include("../includes/footer.php"); ?>