<?php
// backend/config/auth.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Only declare functions if they don't exist
if (!function_exists('requireRole')) {
    function requireRole($role){
        if(!isset($_SESSION['user_id']) || $_SESSION['role'] !== $role){
            header("Location: ../../index.php");
            exit;
        }
    }
}

if (!function_exists('user')) {
    function user(){
        if(isset($_SESSION['user_id'])){
            return [
                'id' => $_SESSION['user_id'],
                'role' => $_SESSION['role'] ?? '',
                'name' => $_SESSION['name'] ?? '',
                'campus' => $_SESSION['campus'] ?? ''
            ];
        }
        return null;
    }
}

if (!function_exists('isLoggedIn')) {
    function isLoggedIn(){
        return isset($_SESSION['user_id']);
    }
}