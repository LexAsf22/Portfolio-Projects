<?php
// backend/config/database.php
// DATABASE CONNECTION ONLY

$servername = "localhost";
$username = "root";
$password = ""; // default XAMPP password
$dbname = "campus_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>