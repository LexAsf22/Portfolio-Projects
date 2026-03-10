<?php
session_start();

function checkLogin() {
    if(!isset($_SESSION['user'])){
        header("Location: ../../login.php");
        exit;
    }
}

function checkRole($role) {

    checkLogin();

    if($_SESSION['user']['role'] !== $role){
        header("Location: ../../login.php");
        exit;
    }

}
?>