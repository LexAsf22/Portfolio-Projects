<?php
session_start();
include("backend/config/database.php");
include("backend/config/helpers.php");

if(isset($_POST['register'])){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = md5($_POST['password']);
    $role = $_POST['role'];
    $campus = $_POST['campus'];

    $check = $conn->query("SELECT * FROM users WHERE email='$email'");
    if($check->num_rows > 0){
        $error = "Email already registered!";
    } else {
        $conn->query("INSERT INTO users(name,email,password,role,campus) VALUES('$name','$email','$password','$role','$campus')");
        $success = "Registration successful! <a href='login.php?role=$role'>Login now</a>";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <style>
        body {font-family: Arial; background:#ecf0f1;}
        form {width:350px; margin:50px auto; background:white; padding:20px; border-radius:5px;}
        input, select {width:100%; padding:10px; margin:10px 0;}
        button {width:100%; padding:10px; background:#4caf50; color:white; border:none; cursor:pointer;}
        button:hover {background:#3e8e41;}
        .error {color:red;}
        .success {color:green;}
    </style>
</head>
<body>

<form id="regForm" method="POST">
    <h2>Register</h2>
    <?php if(isset($error)) echo "<div class='error'>$error</div>"; ?>
    <?php if(isset($success)) echo "<div class='success'>$success</div>"; ?>
    <input type="text" name="name" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <select name="role" required>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
    </select>
    <select name="campus" required>
        <option value="">Select Campus</option>
        <option value="Campus A">Campus A</option>
        <option value="Campus B">Campus B</option>
    </select>
    <button name="register" type="submit">Register</button>
</form>

<script>
// JS: Simple validation
document.getElementById('regForm').addEventListener('submit', function(e){
    const email = this.email.value.trim();
    const pass = this.password.value.trim();
    const name = this.name.value.trim();
    if(email=='' || pass=='' || name==''){
        alert('Please fill in all required fields');
        e.preventDefault();
    }
});
</script>

</body>
</html>