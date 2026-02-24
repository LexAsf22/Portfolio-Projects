    <?php
    session_start();
    include("backend/config/database.php");
    include("backend/config/helpers.php");

    if(isset($_POST['register'])){
        $name = trim($_POST['name']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $role = $_POST['role'];
        $campus = $_POST['campus'];

        // Check if email exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $res = $stmt->get_result();

        if($res->num_rows > 0){
            $error = "Email already registered!";
        } else {
            // Securely hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insert user
            $stmt = $conn->prepare("INSERT INTO users (name,email,password,role,campus) VALUES (?,?,?,?,?)");
            $stmt->bind_param("sssss", $name, $email, $hashedPassword, $role, $campus);
            $stmt->execute();

            // Correct success message with HTML link inside double quotes
            $success = "Registration successful! <a href='login.php?role=$role'>Login now</a>";        }
    }
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — Campus System</title>
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
            --success:  #1a6b3a;
            --success-bg: #edf7f1;
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
            padding: 52px 20px;
        }

        .card {
            background: #fff;
            border: 1px solid rgba(44,95,46,.12);
            border-radius: 16px;
            padding: 52px 48px 44px;
            max-width: 480px;
            width: 100%;
            box-shadow: 0 4px 40px rgba(26,58,28,.08), 0 1px 4px rgba(0,0,0,.04);
            animation: rise .55s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .card-top {
            margin-bottom: 32px;
        }

        .badge {
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

        .badge-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: var(--gold);
        }

        .card-top h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--forest);
            margin-bottom: 6px;
        }

        .card-top p {
            font-size: .875rem;
            color: #999;
            font-weight: 300;
        }

        /* ── Alerts ── */
        .alert {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            border-radius: 8px;
            padding: 12px 14px;
            margin-bottom: 24px;
            font-size: .85rem;
        }

        .alert-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

        .alert-error {
            background: var(--error-bg);
            border: 1px solid rgba(192,57,43,.2);
            border-left: 3px solid var(--error);
            color: var(--error);
            animation: shake .35s cubic-bezier(.36,.07,.19,.97) both;
        }

        .alert-success {
            background: var(--success-bg);
            border: 1px solid rgba(26,107,58,.2);
            border-left: 3px solid var(--success);
            color: var(--success);
        }

        @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(3px); }
            30%, 50%, 70% { transform: translateX(-3px); }
            40%, 60% { transform: translateX(3px); }
        }

        /* ── Form row (2-col) ── */
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        /* ── Fields ── */
        .field {
            margin-bottom: 18px;
        }

        .field label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: .78rem;
            font-weight: 500;
            color: var(--forest);
            letter-spacing: .05em;
            text-transform: uppercase;
            margin-bottom: 7px;
        }

        .label-required {
            color: var(--error);
            font-size: .9em;
        }

        .field input,
        .field select {
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
            appearance: none;
            -webkit-appearance: none;
        }

        .field input::placeholder { color: #bbb; font-weight: 300; }

        .field input:focus,
        .field select:focus {
            border-color: var(--sage);
            background: #fff;
            box-shadow: 0 0 0 3px rgba(74,124,78,.12);
        }

        .field input.invalid,
        .field select.invalid {
            border-color: var(--error);
            box-shadow: 0 0 0 3px rgba(192,57,43,.1);
        }

        /* Select arrow */
        .select-wrap {
            position: relative;
        }

        .select-wrap::after {
            content: '▾';
            position: absolute;
            right: 14px; top: 50%;
            transform: translateY(-50%);
            color: var(--sage);
            font-size: .8rem;
            pointer-events: none;
        }

        /* Password wrapper */
        .pw-wrap { position: relative; }

        .pw-toggle {
            position: absolute;
            right: 13px; top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #aaa;
            font-size: .8rem;
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
            padding: 4px;
            transition: color .2s;
        }

        .pw-toggle:hover { color: var(--sage); }

        /* Hint text */
        .field-hint {
            font-size: .74rem;
            color: #aaa;
            margin-top: 5px;
        }

        .field-hint.error-hint {
            color: var(--error);
            display: none;
        }

        .field input.invalid ~ .error-hint,
        .field select.invalid ~ .error-hint,
        .field input.invalid + .pw-toggle + .error-hint {
            display: block;
        }

        /* Password strength */
        .strength-bar {
            display: flex;
            gap: 4px;
            margin-top: 8px;
        }

        .strength-seg {
            flex: 1;
            height: 3px;
            border-radius: 2px;
            background: #e8e8e8;
            transition: background .3s;
        }

        .strength-label {
            font-size: .72rem;
            margin-top: 4px;
            color: #aaa;
            transition: color .3s;
        }

        /* ── Divider ── */
        .section-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 4px 0 18px;
        }

        .section-divider hr {
            flex: 1;
            border: none;
            border-top: 1px solid #ececec;
        }

        .section-divider span {
            font-size: .72rem;
            color: #ccc;
            letter-spacing: .07em;
            text-transform: uppercase;
            white-space: nowrap;
        }

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
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .submit-btn:hover {
            background: var(--moss);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(26,58,28,.2);
        }

        .submit-btn:active { transform: translateY(0); }

        .submit-btn.loading {
            pointer-events: none;
            opacity: .75;
        }

        .spinner {
            display: none;
            width: 13px; height: 13px;
            border: 2px solid rgba(255,255,255,.35);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin .6s linear infinite;
        }

        .submit-btn.loading .spinner { display: block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer note ── */
        .card-footer {
            text-align: center;
            margin-top: 22px;
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

        /* ── Responsive ── */
        @media (max-width: 500px) {
            .card { padding: 36px 22px 30px; }
            .form-row { grid-template-columns: 1fr; gap: 0; }
        }
    </style>
</head>
<body>

<?php
$error   = $error   ?? null;
$success = $success ?? null;
$old     = [
    'name'   => htmlspecialchars($_POST['name']   ?? ''),
    'email'  => htmlspecialchars($_POST['email']  ?? ''),
    'role'   => $_POST['role']   ?? '',
    'campus' => $_POST['campus'] ?? '',
];
?>

<header>
    <a class="header-brand" href="index.php">
        <div class="brand-mark">🏫</div>
        <div class="brand-name">Campus <span>System</span></div>
    </a>
    <a class="header-back" href="index.php">Back to home</a>
</header>

<main>
    <div class="card">

        <div class="card-top">
            <div class="badge">
                <div class="badge-dot"></div>
                New Account
            </div>
            <h2>Create an account</h2>
            <p>Join the Campus Lab &amp; Classroom Management System</p>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-error">
                <span class="alert-icon">⚠</span>
                <span><?php echo htmlspecialchars($error); ?></span>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success">
                <span class="alert-icon">✓</span>
                <span><?php echo htmlspecialchars($success); ?></span>
            </div>
        <?php endif; ?>

        <form id="regForm" method="POST" novalidate>

            <!-- Name -->
            <div class="field">
                <label for="name">Full Name <span class="label-required">*</span></label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Maria Santos"
                    value="<?php echo $old['name']; ?>"
                    autocomplete="name"
                    required
                >
                <div class="field-hint error-hint">Please enter your full name.</div>
            </div>

            <!-- Email -->
            <div class="field">
                <label for="email">Email Address <span class="label-required">*</span></label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@campus.edu"
                    value="<?php echo $old['email']; ?>"
                    autocomplete="email"
                    required
                >
                <div class="field-hint error-hint">Please enter a valid email address.</div>
            </div>

            <!-- Password -->
            <div class="field">
                <label for="password">Password <span class="label-required">*</span></label>
                <div class="pw-wrap">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Min. 8 characters"
                        autocomplete="new-password"
                        required
                    >
                    <button type="button" class="pw-toggle" id="pwToggle">Show</button>
                </div>
                <div class="strength-bar" id="strengthBar">
                    <div class="strength-seg" id="s1"></div>
                    <div class="strength-seg" id="s2"></div>
                    <div class="strength-seg" id="s3"></div>
                    <div class="strength-seg" id="s4"></div>
                </div>
                <div class="strength-label" id="strengthLabel">Enter a password</div>
                <div class="field-hint error-hint" id="pwHint">Password must be at least 8 characters.</div>
            </div>

            <div class="section-divider">
                <hr><span>Account details</span><hr>
            </div>

            <!-- Role + Campus -->
            <div class="form-row">
                <div class="field">
                    <label for="role">Role <span class="label-required">*</span></label>
                    <div class="select-wrap">
                        <select id="role" name="role" required>
                            <option value="" disabled <?php echo !$old['role'] ? 'selected' : ''; ?>>Select role</option>
                            <option value="student" <?php echo $old['role']==='student' ? 'selected' : ''; ?>>🎓 Student</option>
                            <option value="teacher" <?php echo $old['role']==='teacher' ? 'selected' : ''; ?>>📋 Teacher</option>
                            <option value="admin"   <?php echo $old['role']==='admin'   ? 'selected' : ''; ?>>🔧 Admin</option>
                        </select>
                    </div>
                    <div class="field-hint error-hint">Please select a role.</div>
                </div>

                <div class="field">
                    <label for="campus">Campus <span class="label-required">*</span></label>
                    <div class="select-wrap">
                        <select id="campus" name="campus" required>
                            <option value="" disabled <?php echo !$old['campus'] ? 'selected' : ''; ?>>Select campus</option>
                            <option value="Campus A" <?php echo $old['campus']==='Campus A' ? 'selected' : ''; ?>>Campus A</option>
                            <option value="Campus B" <?php echo $old['campus']==='Campus B' ? 'selected' : ''; ?>>Campus B</option>
                        </select>
                    </div>
                    <div class="field-hint error-hint">Please select a campus.</div>
                </div>
            </div>

            <button class="submit-btn" name="register" type="submit" id="submitBtn">
                <span class="spinner" id="spinner"></span>
                <span id="btnLabel">Create Account</span>
            </button>

        </form>

        <div class="card-footer">
            Already have an account? <a href="login.php">Sign in here</a>
        </div>

    </div>
</main>

<footer>
    &copy; 2026 <strong>Campus System</strong> &nbsp;·&nbsp; All rights reserved
</footer>

<script>
    /* ── Password toggle ── */
    const pwInput  = document.getElementById('password');
    const pwToggle = document.getElementById('pwToggle');

    pwToggle.addEventListener('click', () => {
        const show = pwInput.type === 'password';
        pwInput.type = show ? 'text' : 'password';
        pwToggle.textContent = show ? 'Hide' : 'Show';
    });

    /* ── Password strength ── */
    const segs   = [s1, s2, s3, s4];
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    function scorePassword(pw) {
        let score = 0;
        if (pw.length >= 8)  score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return Math.min(4, score);
    }

    const strengthLabel = document.getElementById('strengthLabel');

    pwInput.addEventListener('input', () => {
        const pw    = pwInput.value;
        const score = pw.length === 0 ? 0 : scorePassword(pw);
        segs.forEach((seg, i) => {
            seg.style.background = i < score ? colors[score - 1] : '#e8e8e8';
        });
        strengthLabel.textContent = pw.length === 0 ? 'Enter a password' : labels[score - 1] || 'Weak';
        strengthLabel.style.color = pw.length === 0 ? '#aaa' : colors[score - 1];
        if (pwInput.classList.contains('invalid') && pw.length >= 8) {
            pwInput.classList.remove('invalid');
        }
    });

    /* ── Field validation ── */
    function validateField(el) {
        const empty = el.value.trim() === '';
        const badEmail = el.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
        const badPw    = el.id === 'password' && el.value.length < 8 && !empty;
        const invalid  = empty || badEmail || badPw;
        el.classList.toggle('invalid', invalid);
        return !invalid;
    }

    const fields = ['name', 'email', 'password', 'role', 'campus'].map(id => document.getElementById(id));

    fields.forEach(el => {
        el.addEventListener('blur',  () => validateField(el));
        el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateField(el); });
        el.addEventListener('change',() => { if (el.classList.contains('invalid')) validateField(el); });
    });

    /* ── Submit ── */
    document.getElementById('regForm').addEventListener('submit', function (e) {
        let allValid = true;
        fields.forEach(el => { if (!validateField(el)) allValid = false; });

        if (!allValid) {
            e.preventDefault();
            const first = fields.find(el => el.classList.contains('invalid'));
            if (first) first.focus();
            return;
        }

        const btn = document.getElementById('submitBtn');
        btn.classList.add('loading');
        document.getElementById('btnLabel').textContent = 'Creating account…';
    });
</script>

</body>
</html>