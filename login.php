<?php
session_start();
include("backend/config/database.php");
include("backend/config/helpers.php");

$role = isset($_GET['role']) ? $_GET['role'] : '';

if(isset($_POST['login'])){
    $email = $_POST['email'];
    $password = md5($_POST['password']); // demo only

    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password' AND role='$role'";
    $res = $conn->query($sql);

    if($res->num_rows > 0){
        $_SESSION['user'] = $res->fetch_assoc();
        redirect("dashboard.php");
    } else {
        $error = "Invalid credentials!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login - <?php echo ucfirst($role); ?></title>
    <style>
        body {font-family: Arial; background:#ecf0f1;}
        form {width:300px; margin:100px auto; background:white; padding:20px; border-radius:5px;}
        input {width:100%; padding:10px; margin:10px 0;}
        button {width:100%; padding:10px; background:#4caf50; color:white; border:none; cursor:pointer;}
        button:hover {background:#3e8e41;}
        .error {color:red; margin-bottom:10px;}
    </style>
</head>
<body>

<form id="loginForm" method="POST">
    <h2><?php echo ucfirst($role); ?> Login</h2>
    <?php if(isset($error)) echo "<div class='error'>$error</div>"; ?>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <button name="login" type="submit">Login</button>
</form>

<script>
// JS: Simple form validation (extra)
document.getElementById('loginForm').addEventListener('submit', function(e){
    const email = this.email.value.trim();
    const pass = this.password.value.trim();
    if(email=='' || pass==''){
        alert('Please fill in all fields');
        e.preventDefault();
    }
});
</script>

</body>
</html>