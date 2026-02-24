<?php
session_start();
if(isset($_SESSION['user'])){
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Laboratory & Classroom Management System</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --forest:   #1a3a1c;
            --moss:     #2c5f2e;
            --sage:     #4a7c4e;
            --leaf:     #6aab6e;
            --mint:     #c8e6c9;
            --cream:    #f5f0e8;
            --gold:     #c9a84c;
            --charcoal: #1e1e1e;
        }

        body {
            font-family: 'DM Sans', sans-serif;
            background: var(--cream);
            color: var(--charcoal);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }

        /* ── Background texture ── */
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
            padding: 64px 40px 56px;
            text-align: center;
        }

        header::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 40px,
                    rgba(255,255,255,.025) 40px,
                    rgba(255,255,255,.025) 41px
                );
        }

        .header-badge {
            display: inline-block;
            background: var(--gold);
            color: var(--forest);
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .14em;
            text-transform: uppercase;
            padding: 5px 14px;
            border-radius: 2px;
            margin-bottom: 20px;
            position: relative;
        }

        header h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 4vw, 3.2rem);
            font-weight: 900;
            color: #fff;
            line-height: 1.15;
            max-width: 700px;
            margin: 0 auto 16px;
            position: relative;
        }

        header h1 span {
            color: var(--leaf);
        }

        header p {
            color: rgba(255,255,255,.65);
            font-size: 1rem;
            font-weight: 300;
            letter-spacing: .02em;
            position: relative;
        }

        /* decorative circle */
        header::after {
            content: '';
            position: absolute;
            width: 340px; height: 340px;
            border-radius: 50%;
            border: 1px solid rgba(106,171,110,.18);
            right: -80px; top: -100px;
            pointer-events: none;
        }

        /* ── Main ── */
        main {
            flex: 1;
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
            max-width: 480px;
            width: 100%;
            box-shadow: 0 4px 40px rgba(26,58,28,.08), 0 1px 4px rgba(0,0,0,.04);
            animation: rise .55s cubic-bezier(.22,1,.36,1) both;
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .card-header {
            margin-bottom: 36px;
            text-align: center;
        }

        .card-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.7rem;
            font-weight: 700;
            color: var(--forest);
            margin-bottom: 6px;
        }

        .card-header p {
            font-size: .88rem;
            color: #888;
            font-weight: 300;
        }

        /* ── Role buttons ── */
        .role-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 28px;
        }

        .role-btn {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            background: var(--cream);
            border: 1.5px solid rgba(44,95,46,.15);
            border-radius: 10px;
            cursor: pointer;
            text-align: left;
            transition: border-color .2s, background .2s, transform .15s, box-shadow .2s;
            text-decoration: none;
            color: inherit;
        }

        .role-btn:hover {
            border-color: var(--sage);
            background: rgba(200,230,201,.25);
            transform: translateX(4px);
            box-shadow: -3px 0 0 var(--sage);
        }

        .role-icon {
            width: 44px; height: 44px;
            border-radius: 10px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            font-size: 20px;
        }

        .role-btn[data-role="student"] .role-icon { background: #e8f5e9; }
        .role-btn[data-role="teacher"] .role-icon { background: #e3f2fd; }
        .role-btn[data-role="admin"]   .role-icon { background: #fff3e0; }

        .role-label { flex: 1; }
        .role-label strong {
            display: block;
            font-size: .95rem;
            font-weight: 500;
            color: var(--forest);
            margin-bottom: 2px;
        }
        .role-label span {
            font-size: .78rem;
            color: #999;
            font-weight: 300;
        }

        .role-arrow {
            color: var(--sage);
            font-size: 18px;
            opacity: 0;
            transform: translateX(-4px);
            transition: opacity .2s, transform .2s;
        }

        .role-btn:hover .role-arrow {
            opacity: 1;
            transform: translateX(0);
        }

        /* ── Divider ── */
        .divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }
        .divider hr { flex: 1; border: none; border-top: 1px solid #e8e8e8; }
        .divider span { font-size: .75rem; color: #bbb; letter-spacing: .06em; text-transform: uppercase; }

        /* ── Register button ── */
        .register-btn {
            display: block;
            width: 100%;
            padding: 15px;
            text-align: center;
            background: var(--forest);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: .92rem;
            font-weight: 500;
            letter-spacing: .04em;
            text-decoration: none;
            cursor: pointer;
            transition: background .2s, transform .15s;
        }

        .register-btn:hover {
            background: var(--moss);
            transform: translateY(-1px);
        }

        /* ── Footer ── */
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
        @media (max-width: 520px) {
            .card { padding: 36px 24px 32px; }
        }
    </style>
</head>
<body>

<header>
    <div class="header-badge">Est. 2026</div>
    <h1>Campus <span>Lab &amp; Classroom</span> Management</h1>
    <p>Reserve resources, track inventory, and report issues — across both campuses.</p>
</header>

<main>
    <div class="card">
        <div class="card-header">
            <h2>Welcome back</h2>
            <p>Select your role to continue</p>
        </div>

        <div class="role-group">
            <a class="role-btn" data-role="student" href="login.php?role=student">
                <div class="role-icon">🎓</div>
                <div class="role-label">
                    <strong>Student</strong>
                    <span>Reserve equipment, computers &amp; lab time</span>
                </div>
                <div class="role-arrow">›</div>
            </a>

            <a class="role-btn" data-role="teacher" href="login.php?role=teacher">
                <div class="role-icon">📋</div>
                <div class="role-label">
                    <strong>Teacher</strong>
                    <span>Monitor lab usage &amp; report classroom issues</span>
                </div>
                <div class="role-arrow">›</div>
            </a>

            <a class="role-btn" data-role="admin" href="login.php?role=admin">
                <div class="role-icon">🔧</div>
                <div class="role-label">
                    <strong>Admin / Staff</strong>
                    <span>Manage inventory &amp; generate campus reports</span>
                </div>
                <div class="role-arrow">›</div>
            </a>
        </div>

        <div class="divider">
            <hr><span>New here?</span><hr>
        </div>

        <a class="register-btn" href="register.php">Create an Account</a>
    </div>
</main>

<footer>
    &copy; 2026 <strong>Campus System</strong> &nbsp;·&nbsp; All rights reserved
</footer>

</body>
</html>