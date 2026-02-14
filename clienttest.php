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

// set current directory to current run directory
$exepath = dirname(__FILE__);
define('BASE_PATH', dirname(realpath(dirname(__FILE__))));
chdir($exepath);
require('classes/autoload.php');
spl_autoload_register('autoload');
Logfile::create("logfiles/clientTest");
$domain = 'test.org.uk';
$json = file_get_contents('wmstore/sitestatus.altonramblers.org.uk.json');
$storeUrl = 'http://localhost/webMonitorStore/storejson.php';
//$storeUrl = 'http://localhost/webMonitorStore/servertest.php';
//$storeUrl = 'https://webmonitorstore.theramblers.org.uk/storejson.php';
$storeKey = md5("ra-" . $domain);
if ($storeUrl === null) {
    return;
}
if ($storeKey === null) {
    return;
}

$url = $storeUrl;
$data = [];
$data['domain'] = $domain;
$data['key'] = $storeKey;
$data['json'] = base64_encode($json);

Logfile::writeWhen($url);
Logfile::writeWhen($domain);
Logfile::writeWhen($storeKey);
Logfile::writeWhen($json);

$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_HEADER => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($data), // This AUTOMATICALLY sets correct Content-Type
    CURLINFO_HEADER_OUT => true,
    CURLOPT_TIMEOUT => 60, // Total timeout
    CURLOPT_CONNECTTIMEOUT => 30, // Connection timeout  
    CURLOPT_SSLVERSION => CURL_SSLVERSION_TLSv1_2, // Force TLS 1.2
    CURLOPT_SSL_VERIFYPEER => false, // TEMP for testing
    CURLOPT_SSL_VERIFYHOST => false, // TEMP for testing
    CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; WebMonitor/1.0)',
]);

$json_response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($status != 200) {
    $msg = "Error: call to URL $url failed with status $status, response $json_response, curl_error: " . curl_error($curl) . ", curl_errno: " . curl_errno($curl);
    Logfile::writeError($msg);
    echo $msg;
} else {
    $msg = "Log file copied to central server";
    Logfile::writeWhen($msg);
    echo $msg;
}
    