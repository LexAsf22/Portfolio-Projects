<?php
// backend/config/helpers.php

// Format date
function formatDate($date) {
    return date("F d, Y", strtotime($date));
}

// Flash messages (store in session)
function setFlash($message, $type="success") {
    $_SESSION['flash'] = ['message'=>$message, 'type'=>$type];
}

function getFlash() {
    if(isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return "<div class='{$flash['type']}'>{$flash['message']}</div>";
    }
    return "";
}

// Get user by ID
function getUser($conn, $id) {
    $res = $conn->query("SELECT * FROM users WHERE id=$id");
    return $res->fetch_assoc();
}

// Redirect helper
function redirect($url) {
    header("Location: $url");
    exit;
}
?>