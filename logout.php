<?php
include($_SERVER['DOCUMENT_ROOT'] . '/spacio/backend/config/auth.php');
session_start();
session_unset();
session_destroy();
header("Location: /spacio/index.php");
exit;
?>