<?php

// POST TEST using YOUR Logfile class - Save as test-logpost.php
header('Content-Type: text/plain; charset=utf-8');
// set current directory to current run directory
$exepath = dirname(__FILE__);
define('BASE_PATH', dirname(realpath(dirname(__FILE__))));
chdir($exepath);

// Initialize YOUR logging FIRST (minimal)
require('classes/autoload.php');
spl_autoload_register('autoload');
Logfile::create("logfiles/serverTest");  // Your existing log
// Log server headers
Logfile::writeWhen("=== POST TEST START ===");
Logfile::writeWhen("METHOD: " . ($_SERVER['REQUEST_METHOD'] ?? 'NOT SET'));
Logfile::writeWhen("CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
Logfile::writeWhen("CONTENT_LENGTH: " . ($_SERVER['CONTENT_LENGTH'] ?? '0'));

// Log RAW input
$rawInput = file_get_contents('php://input');
Logfile::writeWhen("RAW INPUT (" . strlen($rawInput) . " bytes)");
Logfile::writeWhen(substr($rawInput, 0, 500) . (strlen($rawInput) > 500 ? '...' : ''));

// Log $_POST array
Logfile::writeWhen("POST ARRAY: " . print_r($_POST, true));

// Log your specific fields
Logfile::writeWhen("Domain: '" . ($_POST['domain'] ?? 'MISSING') . "'");
Logfile::writeWhen("Key: '" . ($_POST['key'] ?? 'MISSING') . "'");
Logfile::writeWhen("JSON length: " . (isset($_POST['json']) ? strlen($_POST['json']) : 'MISSING'));

// Test JSON decode
if (isset($_POST['json'])) {
    $jsonRaw = base64_decode($_POST['json']);
    $jsonDecoded = json_decode($jsonRaw, true);
    Logfile::writeWhen("JSON decode: " . (json_last_error() === JSON_ERROR_NONE ? 'SUCCESS' : 'FAILED'));
}

// Browser output too
echo "Check logfiles/store/ - POST data logged\n";
echo "Domain: " . ($_POST['domain'] ?? 'MISSING') . "\n";
echo "Data logged to your Logfile system\n";

Logfile::close();
?>

