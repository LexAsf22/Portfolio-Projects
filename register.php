<?php
include("backend/config/database.php");
include("backend/config/helpers.php");

$message = "";

if(isset($_POST['register'])){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];
    $campus = $_POST['campus'] ?? '';

    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $message = "<div style='padding:10px; background:#f8d7da; color:#721c24; border-radius:5px; margin-bottom:10px;'>Email already registered!</div>";
    } else {
        $stmt = $conn->prepare("INSERT INTO users(name,email,password,role,campus) VALUES(?,?,?,?,?)");
        $stmt->bind_param("sssss", $name, $email, $password, $role, $campus);

        if($stmt->execute()){
            // Success message with redirect to login
            echo '<script>alert("Registration successful! You can now login."); window.location.href="login.php";</script>';
            exit;
        } else {
            $message = "<div style='padding:10px; background:#f8d7da; color:#721c24; border-radius:5px; margin-bottom:10px;'>Error occurred: ".$stmt->error."</div>";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <style>
        body{font-family:Arial;background:#f4f6f9;text-align:center;}
        .container{max-width:400px;margin:50px auto;padding:30px;background:white;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,0.1);}
        input,select{width:100%;padding:10px;margin:10px 0;}
        button{padding:10px 20px;background:#27ae60;color:white;border:none;border-radius:5px;cursor:pointer;}
        button:hover{background:#219150;}
    </style>
</head>
<body>

<div class="container">
    <h2>Register</h2>
    <?= $message ?>
    <form method="POST">
        <input type="text" name="name" placeholder="Full Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <select name="role" required>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
        </select>
        <select name="campus" required>
            <option value="">Select Campus</option>
            <option value="Campus A">Campus A</option>
            <option value="Campus B">Campus B</option>
        </select>
        <button name="register">Register</button>
    </form>
</div>

</body>
</html>