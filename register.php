<?php
session_start();
include("backend/config/database.php"); // Your DB connection

$errorFields = [];
$success = null;

if(isset($_POST['register'])){
    // Collect & sanitize
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $role = $_POST['role'];
    $campus = trim($_POST['campus']);
    $course = trim($_POST['course'] ?? '');
    $department = trim($_POST['department'] ?? '');
    // Validation
    if(empty($name)) $errorFields['name'] = "Enter Full Name.";
    if(empty($email)) $errorFields['email'] = "Enter Email Address.";
    elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) $errorFields['email'] = "Invalid Email format.";
    if(empty($password)) $errorFields['password'] = "Enter Password.";
    elseif(strlen($password)<8) $errorFields['password'] = "Password must be at least 8 characters.";
    if(empty($role)) $errorFields['role'] = "Select Role.";
    if(empty($campus)) $errorFields['campus'] = "Enter Campus.";
    if($role==='student' && empty($course)) $errorFields['course'] = "Enter Course.";
    if($role==='teacher' && empty($department)) $errorFields['department'] = "Enter Department.";
    // If no errors, insert into DB
    if(empty($errorFields)){
        // Check if email exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s",$email);
        $stmt->execute();
        $res = $stmt->get_result();
        if($res->num_rows>0){
            $errorFields['email'] = "Email already registered!";
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (name,email,password,role,campus,course,department) VALUES (?,?,?,?,?,?,?)");
            $stmt->bind_param("sssssss",$name,$email,$hashedPassword,$role,$campus,$course,$department);
            if($stmt->execute()){
                $success = "Registration successful! <a href='login.php?role=$role'>Login now</a>";
                $old = ['name'=>'','email'=>'','role'=>'','campus'=>'','course'=>'','department'=>''];
            } else {
                $errorFields['general'] = "Registration failed. Try again.";
            }
        }
    }
}
// Retain old values
if(!isset($old)){
    $old = [
        'name'=>htmlspecialchars($_POST['name'] ?? ''),
        'email'=>htmlspecialchars($_POST['email'] ?? ''),
        'role'=>$_POST['role'] ?? '',
        'campus'=>htmlspecialchars($_POST['campus'] ?? ''),
        'course'=>htmlspecialchars($_POST['course'] ?? ''),
        'department'=>htmlspecialchars($_POST['department'] ?? '')
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register — Campus System</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="css/register.css">
</head>
<body>

<div class="container">

    <!-- LEFT PANEL -->
    <div class="left-panel">
        <div class="left-panel-grid"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>

        <h1>Welcome to <span>SPACIO</span></h1>
        <p class="left-panel-sub">Reserve classrooms, laboratories &amp; spaces with ease.</p>

        <!-- Carousel (auto-play only) -->
        <div class="carousel">
            <div class="carousel-track">
                <div class="carousel-slides">
                    <div class="carousel-slide">
                        <img src="images/classroom.jpg" alt="Classroom">
                        <p>Classroom <span class="plus"></span></p>
                    </div>
                    <div class="carousel-slide">
                        <img src="images/comp-lab2.webp" alt="Computer Lab">
                        <p>Computer Laboratory <span class="plus"></span></p>
                    </div>
                    <div class="carousel-slide">
                        <img src="images/sci-lab.jpg" alt="Science Lab">
                        <p>Science Laboratory <span class="plus"></span></p>
                    </div>
                    <div class="carousel-slide">
                        <img src="images/sci-lab2.webp" alt="Science Lab">
                        <p>Science Laboratory <span class="plus"></span></p>
                    </div>
                    <div class="carousel-slide">
                        <img src="images/comp-lab.jpg" alt="Science Lab">
                        <p>Computer Lab <span class="plus"></span></p>
                    </div>
                    <div class="carousel-slide">
                        <img src="images/classroom2.jpg" alt="Science Lab">
                        <p>Classroom <span class="plus"></span></p>
                    </div>
                </div>
            </div>
            <div class="carousel-progress"><div class="carousel-progress-bar"></div></div>
        </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
        <img src="images/logo.png" alt="SPACIO Logo" class="app-logo">
        <a href="index.php" class="back-btn">← Back</a>

        <div class="card">
            <div class="card-header">
                <h2>Create an account</h2>
                <p class="subtitle">Fill in your details to get started.</p>
            </div>

            <?php if(!empty($errorFields['general'])): ?>
                <div class="alert error"><?= $errorFields['general'] ?></div>
            <?php endif; ?>
            <?php if($success): ?>
                <div class="alert success"><?= $success ?></div>
            <?php endif; ?>

            <form id="regForm" method="POST" novalidate>

                <!-- Name -->
                <div class="field">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter Full Name"
                        value="<?= $old['name'] ?>"
                        class="<?= isset($errorFields['name']) ? 'invalid' : '' ?>">
                    <div class="field-hint"><?= $errorFields['name'] ?? '' ?></div>
                </div>

                <!-- Email -->
                <div class="field">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter Email"
                        value="<?= $old['email'] ?>"
                        class="<?= isset($errorFields['email']) ? 'invalid' : '' ?>">
                    <div class="field-hint"><?= $errorFields['email'] ?? '' ?></div>
                </div>

                <!-- Password -->
                <div class="field">
                    <label for="password">Password</label>
                    <div class="pw-wrap">
                        <input type="password" id="password" name="password" placeholder="Enter Password"
                            class="<?= isset($errorFields['password']) ? 'invalid' : '' ?>">
                        <button type="button" class="pw-toggle" id="pwToggle">Show</button>
                    </div>
                    <div class="strength-bar">
                        <div class="strength-seg"></div>
                        <div class="strength-seg"></div>
                        <div class="strength-seg"></div>
                        <div class="strength-seg"></div>
                    </div>
                    <div class="strength-label" id="strengthLabel">Strength level</div>
                    <div class="field-hint"><?= $errorFields['password'] ?? '' ?></div>
                </div>

                <!-- Role + Campus row -->
                <div class="field-row">
                    <div class="field">
                        <label for="role">Role</label>
                        <select id="role" name="role" class="<?= isset($errorFields['role']) ? 'invalid' : '' ?>">
                            <option value="">Select Role</option>
                            <option value="student" <?= $old['role']==='student'?'selected':'' ?>>Student</option>
                            <option value="teacher" <?= $old['role']==='teacher'?'selected':'' ?>>Teacher</option>
                            <option value="admin"   <?= $old['role']==='admin'  ?'selected':'' ?>>Admin</option>
                        </select>
                        <div class="field-hint"><?= $errorFields['role'] ?? '' ?></div>
                    </div>
                    <div class="field">
                        <label for="campus">Campus</label>
                        <input type="text" id="campus" name="campus" placeholder="Enter Campus"
                            value="<?= $old['campus'] ?>"
                            class="<?= isset($errorFields['campus']) ? 'invalid' : '' ?>">
                        <div class="field-hint"><?= $errorFields['campus'] ?? '' ?></div>
                    </div>
                </div>

                <!-- Course (Student) -->
                <div class="field" id="courseField" style="display:<?= $old['role']==='student'?'block':'none' ?>;">
                    <label for="course">Course</label>
                    <input type="text" id="course" name="course" placeholder="Enter Course"
                        value="<?= $old['course'] ?>"
                        class="<?= isset($errorFields['course']) ? 'invalid' : '' ?>">
                    <div class="field-hint"><?= $errorFields['course'] ?? '' ?></div>
                </div>

                <!-- Department (Teacher) -->
                <div class="field" id="departmentField" style="display:<?= $old['role']==='teacher'?'block':'none' ?>;">
                    <label for="department">Department</label>
                    <input type="text" id="department" name="department" placeholder="Enter Department"
                        value="<?= $old['department'] ?>"
                        class="<?= isset($errorFields['department']) ? 'invalid' : '' ?>">
                    <div class="field-hint"><?= $errorFields['department'] ?? '' ?></div>
                </div>

                <button type="submit" name="register" id="registerBtn">Create Account</button>
            </form>

            <div class="card-footer">
                Already have an account? <a href="login.php">Sign in here</a>
            </div>
        </div>
    </div>

</div>

<script src="js/register.js"></script>
<script src="js/carousel.js"></script>
</body>
</html>