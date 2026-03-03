<?php
session_start();
include("backend/config/database.php");

$role = isset($_GET['role']) ? $_GET['role'] : '';

if(isset($_POST['login'])){
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();

    if($res->num_rows > 0){
        $user = $res->fetch_assoc();
        if(password_verify($password, $user['password'])){
            if($role && $user['role'] != $role){
                $error = "Role mismatch!";
            } else {
                $_SESSION['user'] = $user;
                switch($user['role']) {
                    case 'admin':   header("Location: frontend/admin/dashboard.php"); break;
                    case 'teacher': header("Location: frontend/teacher/dashboard.php"); break;
                    case 'student': header("Location: frontend/student/dashboard.php"); break;
                    default:        header("Location: index.php");
                }
                exit;
            }
        } else {
            $error = "Incorrect password!";
        }
    } else {
        $error = "Email not found!";
    }
}

$validRoles = ['student', 'teacher', 'admin'];
if (!in_array($role, $validRoles)) $role = 'user';
$roleLabel  = ucfirst($role);
$roleEmojis = ['student' => '🎓', 'teacher' => '📋', 'admin' => '🔧', 'user' => '👤'];
$roleEmoji  = $roleEmojis[$role] ?? '👤';
$roleDescs  = [
    'student' => 'Access your reservations and lab bookings',
    'teacher' => 'Monitor lab usage and manage your classes',
    'admin'   => 'Full access to system management and reports',
    'user'    => 'Sign in to continue',
];
$roleDesc = $roleDescs[$role] ?? 'Sign in to continue';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPACIO — Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>

<div class="container">

    <!-- LEFT PANEL -->
    <div class="left-panel">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>

        <h1>Welcome to <span>SPACIO</span></h1>

        <div class="image-grid">
            <div class="card">
                <img src="images/classroom.jpg" alt="Classroom">
                <p>Classroom <span class="plus"></span></p>
            </div>
            <div class="card">
                <img src="images/comp-lab2.webp" alt="Computer Lab">
                <p>Computer Laboratory <span class="plus"></span></p>
            </div>
            <div class="card">
                <img src="images/sci-lab.jpg" alt="Science Lab">
                <p>Science Laboratory <span class="plus"></span></p>
            </div>
        </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
        <img src="images/logo.png" alt="SPACIO Logo" class="app-logo">

        <a href="index.php" class="back-btn">← Back</a>

        <div class="login-box">

            <?php if($role !== 'user'): ?>
            <div class="role-pill">
                <div class="role-dot"></div>
                <?php echo $roleEmoji . ' ' . $roleLabel . ' Portal'; ?>
            </div>
            <?php endif; ?>

            <h2>Login</h2>
            <p class="subtitle"><?php echo htmlspecialchars($roleDesc); ?></p>

            <?php if(isset($error)): ?>
            <div class="error-box">
                <span class="error-icon">⚠</span>
                <span><?php echo htmlspecialchars($error); ?></span>
            </div>
            <?php endif; ?>

            <form id="loginForm" method="POST" novalidate>
                <input type="hidden" name="role" value="<?php echo htmlspecialchars($role); ?>">

                <label for="email">Email</label>
                <input type="email" id="email" name="email"
                    placeholder="Enter your email"
                    value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                    autocomplete="email" required>
                <div class="field-hint">Please enter a valid email address.</div>

                <label for="password">Password</label>
                <div class="pw-wrap">
                    <input type="password" id="password" name="password"
                        placeholder="Enter Password"
                        autocomplete="current-password" required>
                    <button type="button" class="pw-toggle" id="pwToggle">Show</button>
                </div>
                <div class="field-hint">Password cannot be empty.</div>

                <div class="options">
                    <label class="remember">
                        <input type="checkbox"> Remember for 30 days
                    </label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit" name="login" id="loginBtn">
                    Log in as <?php echo $roleLabel; ?>
                </button>
            </form>

            <p class="signup">
                Don't have an account? <a href="register.php">Sign up</a>
            </p>
        </div>
    </div>

</div>

<script src="js/login.js"></script>
</body>
</html>