<?php
session_start();
include("backend/config/database.php");

$role = isset($_GET['role']) ? $_GET['role'] : '';

if(isset($_POST['login'])){
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Fetch user by email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();

    if($res->num_rows > 0){
        $user = $res->fetch_assoc();

        // Verify password
        if(password_verify($password, $user['password'])){
            // Optional: check role matches
            if($role && $user['role'] != $role){
                $error = "Role mismatch!";
            } else {
                $_SESSION['user'] = $user;
                header("Location: dashboard.php");
                exit;
            }
        } else {
            $error = "Incorrect password!";
        }
    } else {
        $error = "Email not found!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — <?php echo ucfirst($role ?? 'User'); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --forest:   #1a3a1c;
            --moss:     #2c5f2e;
            --sage:     #4a7c4e;
            --leaf:     #6aab6e;
            --cream:    #f5f0e8;
            --gold:     #c9a84c;
            --charcoal: #1e1e1e;
            --error:    #c0392b;
            --error-bg: #fdf0ef;
        }

        body {
            font-family: 'DM Sans', sans-serif;
            background: var(--cream);
            color: var(--charcoal);
            min-height: 100vh;
            display: grid;
            grid-template-rows: auto 1fr auto;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image:
                radial-gradient(ellipse 80% 60% at 10% 20%, rgba(44,95,46,.08) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 90% 80%, rgba(106,171,110,.07) 0%, transparent 55%);
            pointer-events: none;
            z-index: 0;
        }

        /* ── Header ── */
        header {
            position: relative;
            background: var(--forest);
            overflow: hidden;
            padding: 28px 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }

        header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                -45deg,
                transparent, transparent 40px,
                rgba(255,255,255,.025) 40px, rgba(255,255,255,.025) 41px
            );
            pointer-events: none;
        }

        .header-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            position: relative;
        }

        .brand-mark {
            width: 36px; height: 36px;
            border-radius: 8px;
            background: var(--leaf);
            display: grid;
            place-items: center;
            font-size: 18px;
            flex-shrink: 0;
        }

        .brand-name {
            font-family: 'Playfair Display', serif;
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            line-height: 1.2;
        }

        .brand-name span { color: var(--leaf); }

        .header-back {
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255,255,255,.6);
            font-size: .82rem;
            font-weight: 400;
            text-decoration: none;
            transition: color .2s;
        }

        .header-back:hover { color: #fff; }
        .header-back::before { content: '←'; font-size: 1rem; }

        /* ── Main ── */
        main {
            position: relative;
            z-index: 1;
            display: grid;
            place-items: center;
            padding: 60px 20px;
        }

        .card {
            background: #fff;
            border: 1px solid rgba(44,95,46,.12);
            border-radius: 16px;
            padding: 52px 48px 44px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 4px 40px rgba(26,58,28,.08), 0 1px 4px rgba(0,0,0,.04);
            animation: rise .55s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Role pill ── */
        .role-pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: var(--cream);
            border: 1px solid rgba(44,95,46,.18);
            border-radius: 20px;
            padding: 5px 13px 5px 8px;
            font-size: .78rem;
            font-weight: 500;
            color: var(--moss);
            letter-spacing: .03em;
            margin-bottom: 18px;
        }

        .role-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: var(--leaf);
            flex-shrink: 0;
        }

        .card h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--forest);
            margin-bottom: 6px;
        }

        .card .subtitle {
            font-size: .875rem;
            color: #999;
            font-weight: 300;
            margin-bottom: 32px;
        }

        /* ── Error ── */
        .error-box {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: var(--error-bg);
            border: 1px solid rgba(192,57,43,.2);
            border-left: 3px solid var(--error);
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 24px;
            font-size: .85rem;
            color: var(--error);
            animation: shake .35s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(3px); }
            30%, 50%, 70% { transform: translateX(-3px); }
            40%, 60% { transform: translateX(3px); }
        }

        .error-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

        /* ── Form fields ── */
        .field {
            margin-bottom: 18px;
        }

        .field label {
            display: block;
            font-size: .8rem;
            font-weight: 500;
            color: var(--forest);
            letter-spacing: .04em;
            text-transform: uppercase;
            margin-bottom: 7px;
        }

        .field input {
            width: 100%;
            padding: 13px 15px;
            background: var(--cream);
            border: 1.5px solid rgba(44,95,46,.15);
            border-radius: 9px;
            font-family: 'DM Sans', sans-serif;
            font-size: .95rem;
            color: var(--charcoal);
            outline: none;
            transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .field input::placeholder { color: #bbb; font-weight: 300; }

        .field input:focus {
            border-color: var(--sage);
            background: #fff;
            box-shadow: 0 0 0 3px rgba(74,124,78,.12);
        }

        .field input.invalid {
            border-color: var(--error);
            box-shadow: 0 0 0 3px rgba(192,57,43,.1);
        }

        .field-hint {
            font-size: .75rem;
            color: var(--error);
            margin-top: 5px;
            display: none;
        }

        .field input.invalid + .field-hint { display: block; }

        /* ── Password wrapper ── */
        .pw-wrap { position: relative; }

        .pw-toggle {
            position: absolute;
            right: 13px; top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #aaa;
            font-size: .82rem;
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
            padding: 4px;
            transition: color .2s;
        }

        .pw-toggle:hover { color: var(--sage); }

        /* ── Submit ── */
        .submit-btn {
            width: 100%;
            padding: 15px;
            background: var(--forest);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: .95rem;
            font-weight: 500;
            letter-spacing: .04em;
            cursor: pointer;
            margin-top: 8px;
            transition: background .2s, transform .15s, box-shadow .2s;
        }

        .submit-btn:hover {
            background: var(--moss);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(26,58,28,.2);
        }

        .submit-btn:active { transform: translateY(0); }

        /* loading state */
        .submit-btn.loading {
            pointer-events: none;
            opacity: .7;
        }

        .submit-btn.loading::after {
            content: '';
            display: inline-block;
            width: 12px; height: 12px;
            border: 2px solid rgba(255,255,255,.4);
            border-top-color: #fff;
            border-radius: 50%;
            margin-left: 10px;
            vertical-align: middle;
            animation: spin .6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer note ── */
        .card-footer {
            text-align: center;
            margin-top: 24px;
            font-size: .82rem;
            color: #aaa;
        }

        .card-footer a {
            color: var(--sage);
            font-weight: 500;
            text-decoration: none;
        }

        .card-footer a:hover { color: var(--moss); text-decoration: underline; }

        /* ── Page footer ── */
        footer {
            position: relative;
            z-index: 1;
            background: var(--forest);
            color: rgba(255,255,255,.45);
            text-align: center;
            padding: 18px;
            font-size: .78rem;
            letter-spacing: .04em;
        }

        footer strong { color: var(--leaf); font-weight: 500; }

        @media (max-width: 480px) {
            .card { padding: 36px 24px 32px; }
        }
    </style>
</head>
<body>

<?php
$role = $_GET['role'] ?? 'user';
$validRoles = ['student', 'teacher', 'admin'];
if (!in_array($role, $validRoles)) $role = 'user';

$roleLabel = ucfirst($role);
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

<header>
    <a class="header-brand" href="index.php">
        <div class="brand-mark">🏫</div>
        <div class="brand-name">Campus <span>System</span></div>
    </a>
    <a class="header-back" href="index.php">Change role</a>
</header>

<main>
    <div class="card">

        <div class="role-pill">
            <div class="role-dot"></div>
            <?php echo $roleEmoji . ' ' . $roleLabel . ' Portal'; ?>
        </div>

        <h2>Sign in</h2>
        <p class="subtitle"><?php echo htmlspecialchars($roleDesc); ?></p>

        <?php if (isset($error) && $error): ?>
            <div class="error-box">
                <span class="error-icon">⚠</span>
                <span><?php echo htmlspecialchars($error); ?></span>
            </div>
        <?php endif; ?>

        <form id="loginForm" method="POST" novalidate>
            <input type="hidden" name="role" value="<?php echo htmlspecialchars($role); ?>">

            <div class="field">
                <label for="email">Email address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@campus.edu"
                    value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                    autocomplete="email"
                    required
                >
                <div class="field-hint">Please enter a valid email address.</div>
            </div>

            <div class="field">
                <label for="password">Password</label>
                <div class="pw-wrap">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                    >
                    <button type="button" class="pw-toggle" id="pwToggle" aria-label="Show password">Show</button>
                </div>
                <div class="field-hint">Password cannot be empty.</div>
            </div>

            <button class="submit-btn" name="login" type="submit" id="submitBtn">
                Sign in as <?php echo $roleLabel; ?>
            </button>
        </form>

        <div class="card-footer">
            Don't have an account? <a href="register.php">Register here</a>
        </div>

    </div>
</main>

<footer>
    &copy; 2026 <strong>Campus System</strong> &nbsp;·&nbsp; All rights reserved
</footer>

<script>
    // Password visibility toggle
    const pwToggle = document.getElementById('pwToggle');
    const pwInput  = document.getElementById('password');
    pwToggle.addEventListener('click', () => {
        const isHidden = pwInput.type === 'password';
        pwInput.type   = isHidden ? 'text' : 'password';
        pwToggle.textContent = isHidden ? 'Hide' : 'Show';
    });

    // Inline validation + loading state
    const form      = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');

    function validateField(input) {
        const empty = input.value.trim() === '';
        const badEmail = input.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        const invalid  = empty || badEmail;
        input.classList.toggle('invalid', invalid);
        return !invalid;
    }

    [emailInput, pwInput].forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });

    form.addEventListener('submit', function (e) {
        const emailOk = validateField(emailInput);
        const passOk  = validateField(pwInput);
        if (!emailOk || !passOk) {
            e.preventDefault();
            return;
        }
        submitBtn.textContent = 'Signing in';
        submitBtn.classList.add('loading');
    });
</script>

</body>
</html>