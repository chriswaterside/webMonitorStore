<?php

/*
 * Copyright (C) 2024 Chris Vaughan
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */



ini_set('log_errors', 1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_log("STORE start");
error_reporting(E_ALL);
error_log("=== storejson.php STARTED ===" . date('c'));
error_reporting(E_ALL);
ini_set('display_errors', 1);

// set current directory to current run directory
$exepath = dirname(__FILE__);
define('BASE_PATH', dirname(realpath(dirname(__FILE__))));

chdir($exepath);
error_log("STORE autoload");
require('classes/autoload.php');
spl_autoload_register('autoload');
Logfile::create("logfiles/storeData");
if (file_exists('config.php')) {
    require('config.php');
} else {
    require('config_master.php');
}
$config = new configuration();

$opts = new Options();
$error = false;

if (version_compare(PHP_VERSION, '8.2.0') < 0) {
    Logfile::writeError('You MUST be running on PHP version 8.2.0 or higher, running version: ' . \PHP_VERSION . "\n");
    $error = true;
}

$domain = $opts->posts("domain");
$key = $opts->posts("key");
$json_string = $opts->posts('json');
if ($domain == NULL || $key == NULL || $json_string == NULL) {
    Logfile::writeError("Missing required fields");
    $error = true;
} else {
    if (is_base64_string($json_string)) {
        $json_raw = base64_decode($json_string);      // Keep raw string
    } else {
        $json_raw = $json_string;
    }
    $json = json_decode($json_raw, true);
}
Logfile::writeWhen("Domain: " . $domain ?? 'NULL');
Logfile::writeWhen("Key: " . $key ?? 'NULL');
Logfile::writeWhen("Json keys: " . count($json ?? []));

if (!$error && $key !== $config->getKey($domain, $json_raw)) {  // json_raw!
    Logfile::writeError("Invalid key");
    $error = true;
}

if (!$error) {
    $file = 'wmstore/sitestatus.' . strtolower($domain) . '.json';
    $result = file_put_contents($file, $json_raw);
    Logfile::writeWhen("Filename: " . $file);
    $error = $result === false;
}

header("Access-Control-Allow-Origin: *");
if ($error) {
    Logfile::writeWhen("File write failed");
    http_response_code(400);
    header("Content-Type: application/json");
    echo '{"status": false}';
} else {
    Logfile::writeWhen("File written");
    header("Content-Type: application/json");
    echo '{"status": true}';
}
Logfile::writeWhen("Close");
Logfile::close();

function is_base64_string(string $s): bool
{
    // Empty string is not considered base64 here; adjust if you want otherwise
    if ($s === '') {
        return false;
    }

    // Length must be a multiple of 4
    if (strlen($s) % 4 !== 0) {
        return false;
    }

    // Only valid Base64 chars plus up to two '=' padding chars
    if (!preg_match('/^[A-Za-z0-9\/+]+={0,2}$/', $s)) {
        return false;
    }

    // Decode in strict mode; false means invalid chars or bad padding
    $decoded = base64_decode($s, true);
    if ($decoded === false) {
        return false;
    }

    // Re‑encode and compare to ensure it’s a canonical Base64 string
    return base64_encode($decoded) === $s;
}
