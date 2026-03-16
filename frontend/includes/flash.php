<?php
// frontend/includes/flash.php

function setFlash(string $message, string $type = 'success'): void {
    $_SESSION['flash'] = [
        'message' => $message,
        'type'    => $type,
    ];
}

function getFlash(): string {
    if (!isset($_SESSION['flash'])) return '';

    $flash   = $_SESSION['flash'];
    $message = htmlspecialchars($flash['message']);
    $type    = $flash['type'];

    unset($_SESSION['flash']);

    $bg    = $type === 'success' ? '#d4edda' : '#f8d7da';
    $color = $type === 'success' ? '#155724' : '#721c24';
    $border= $type === 'success' ? '#c3e6cb' : '#f5c6cb';

    return "
        <div style='
            background:{$bg};
            color:{$color};
            border:1px solid {$border};
            padding:12px 16px;
            border-radius:5px;
            margin-bottom:15px;
        '>
            {$message}
        </div>
    ";
}