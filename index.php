<?php
session_start();
include("backend/config/database.php");
include("backend/config/auth.php");
include("backend/config/helpers.php");

// Custom alert function
function alert($text, $type = 'info') {
    $color = $type === 'error' ? 'red' : ($type === 'success' ? 'green' : 'blue');
    return "<div style='color: $color; margin-bottom: 15px;'>$text</div>";
}

$message = "";

// Super admin creation ONLY runs when URL has ?create_superadmin=1
if (isset($_GET['create_superadmin']) && $_GET['create_superadmin'] == '1') {
    // Super Admin details
    $name = "Super Admin";
    $email = "superadmin@domain.com";
    $password_plain = "SuperAdmin123!"; // the password you want
    $role = "admin";
    $campus = "Campus A";

    // Check if super admin already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        // Hash the password
        $password_hashed = password_hash($password_plain, PASSWORD_DEFAULT);

        // Insert super admin
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, campus) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $password_hashed, $role, $campus);
        if ($stmt->execute()) {
            echo "<div style='color: green; text-align:center; margin: 20px;'>Super Admin account created successfully!</div>";
        } else {
            echo "<div style='color: red; text-align:center; margin: 20px;'>Error creating Super Admin: " . htmlspecialchars($stmt->error) . "</div>";
        }
    } else {
        echo "<div style='color: orange; text-align:center; margin: 20px;'>Super Admin already exists!</div>";
    }
    exit; // stop loading rest of the login page when creating super admin
}

if (isset($_POST['login'])) {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['campus'] = $user['campus'] ?? '';

            // Redirect based on role
            if ($user['role'] == "student") {
                header("Location: frontend/student/dashboard.php");
            } elseif ($user['role'] == "teacher") {
                header("Location: frontend/teacher/dashboard.php");
            } elseif ($user['role'] == "admin") {
                header("Location: frontend/admin/dashboard.php");
            } else {
                header("Location: index.php");
            }
            exit;
        } else {
            $message = alert("Incorrect password", "error");
        }
    } else {
        $message = alert("User not found", "error");
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Campus Laboratory System - Login</title>
<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f4f6f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .login-container {
        background: white;
        padding: 40px 50px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        width: 360px;
        text-align: center;
    }
    h1 {
        margin-bottom: 24px;
        font-weight: 700;
        color: #333;
    }
    p.subtitle {
        color: #666;
        margin-bottom: 30px;
        font-size: 14px;
    }
    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 14px 12px;
        margin: 10px 0 20px 0;
        border: 1.8px solid #ccc;
        border-radius: 8px;
        font-size: 15px;
        transition: border-color 0.3s ease;
    }
    input[type="email"]:focus,
    input[type="password"]:focus {
        border-color: #3498db;
        outline: none;
    }
    button {
        width: 100%;
        padding: 14px 0;
        background-color: #3498db;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.3s ease;
    }
    button:hover {
        background-color: #2980b9;
    }
    .register-link {
        margin-top: 18px;
        font-size: 14px;
        color: #555;
    }
    .register-link a {
        color: #3498db;
        text-decoration: none;
        font-weight: 600;
    }
    .register-link a:hover {
        text-decoration: underline;
    }
</style>
</head>
<body>

<div class="login-container">
    <h1>Campus Laboratory System</h1>
    <p class="subtitle">Login to manage your lab reservations and equipment</p>

    <?= $message ?>

    <form method="POST" autocomplete="off" novalidate>
        <input type="email" name="email" placeholder="Email address" required autofocus />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" name="login">Log In</button>
    </form>

    <p class="register-link">
        Don't have an account? <a href="register.php">Register here</a>
    </p>
</div>

</body>
</html>