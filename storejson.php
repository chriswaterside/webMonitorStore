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

// define('TEST', true);
define('TEST', false);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// set current directory to current run directory
$exepath = dirname(__FILE__);
define('BASE_PATH', dirname(realpath(dirname(__FILE__))));
chdir($exepath);
require('classes/autoload.php');
spl_autoload_register('autoload');
Logfile::create("logfiles/");
if (file_exists('config.php')) {
    require('config.php');
} else {
    require('config_master.php');
}
$config=new configuration();

$opts = new Options();
$error = false;

if (version_compare(PHP_VERSION, '8.2.0') < 0) {
    Logfile::writeError('You MUST be running on PHP version 8.2.0 or higher, running version: ' . \PHP_VERSION . "\n");
    $error = true;
}
if (TEST) {
    $domain = 'altonramblers.org.uk';
    $key = md5($domain);
    $json = file_get_contents('wmstore/webstatus.' . $domain . '.json.log');
} else {
    $domain = $opts->posts("domain");
    $key = $opts->posts("key");
    $json = $opts->posts("json");
}
Logfile::writeWhen("Domain: " . $domain);
Logfile::writeWhen("Key: " . $key);
Logfile::writeWhen("Json: " . $json);

if ($domain == NULL) {
    Logfile::writeError("Invalid options - no Domain specified");
    $error = true;
}
if ($key == NULL) {
    Logfile::writeError("Invalid options - no Key specified");
    $error = true;
}
if ($key <> $config->getKey($domain, $json)) {
    Logfile::writeError("Invalid options - invalid Key defined");
    $error = true;
}
if ($json == NULL) {
    Logfile::writeError("Invalid options - no JSON specified");
    $error = true;
}
if (!$error) {
    $datacontent = html_entity_decode($json);
    $file = 'wmstore/sitestatus.' . strtolower($domain) . '.json';
    $result = file_put_contents($file, $datacontent);
} else {
    $result = false;
}

header("Access-Control-Allow-Origin: *");

If ($result === false) {
    header("Content-type: application/json", TRUE, 400);
    echo '{"status": false}';
} else {
    header("Content-type: application/json");
    echo '{"status": true}';
}
Logfile::close();

