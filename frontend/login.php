<?php
session_start();
require 'backend/config/database.php';

$role = $_GET['role'] ?? '';
$error = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = $_POST['role'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username=? AND role=?");
    $stmt->execute([$username, $role]);
    $user = $stmt->fetch();

    if($user && password_verify($password, $user['password'])){
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'campus' => $user['campus']
        ];

        // Redirect based on role
        switch($user['role']){
            case 'student': header("Location: student/dashboard.php"); break;
            case 'teacher': header("Location: teacher/dashboard.php"); break;
            case 'admin': header("Location: admin/dashboard.php"); break;
        }
        exit();
    } else {
        $error = "Invalid username/password.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?php echo ucfirst($role); ?> Login</title>
    <style>
        body { font-family: Arial; background:#eaf4ea; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
        .login-box { background:white; padding:2rem; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); width:300px; }
        h2 { text-align:center; color:#2a4d2a; }
        input[type=text], input[type=password], select { width:100%; padding:0.5rem; margin:0.5rem 0; border-radius:5px; border:1px solid #ccc; }
        button { width:100%; padding:0.5rem; background:#3a7d3a; color:white; border:none; border-radius:5px; margin-top:1rem; }
        .error { color:red; text-align:center; }
    </style>
</head>
<body>
<div class="login-box">
    <h2><?php echo ucfirst($role); ?> Login</h2>
    <?php if($error) echo "<p class='error'>$error</p>"; ?>
    <form method="POST">
        <input type="hidden" name="role" value="<?php echo $role; ?>">
        Username:<br>
        <input type="text" name="username" required><br>
        Password:<br>
        <input type="password" name="password" required><br>
        <button type="submit">Login</button>
    </form>
</div>
</body>
</html>