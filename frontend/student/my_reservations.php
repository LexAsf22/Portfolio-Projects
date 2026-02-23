<?php
include("../../backend/config/database.php");
include("../../backend/config/auth.php");
include("../../backend/config/helpers.php");

requireRole('student');

$user = user();
$userId = $user['id'] ?? 0;

include("../includes/header.php");
?>

<h2>My Reservations</h2>

<table style="width:100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th>Lab</th>
            <th>Date</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $stmt = $conn->prepare("
            SELECT l.lab_name AS lab_name, r.date AS reservation_date, r.status
            FROM reservations r
            JOIN labs l ON r.lab_id = l.id
            WHERE r.user_id = ?
            ORDER BY r.date DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo "<tr><td colspan='3' style='text-align:center;'>No reservations found.</td></tr>";
        } else {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . e($row['lab_name']) . "</td>";
                echo "<td>" . e($row['reservation_date']) . "</td>";
                echo "<td>" . statusBadge($row['status']) . "</td>";
                echo "</tr>";
            }
        }
        $stmt->close();
        ?>
    </tbody>
</table>

<?php include("../includes/footer.php"); ?>