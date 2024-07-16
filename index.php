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
Logfile::create("logfiles/logfile");
if (file_exists('config.php')) {
    require('config.php');
} else {
    require('config_master.php');
}
$config = new configuration();
// retrieve all json files 
$wmdata = getWebSiteData("wmstore");
// retrieve list of domains if provided
if (property_exists($config, "domainListUrl")) {
    $domains = getDomainList($config->domainListUrl);
} else {
    $domains = [];
}
$data = (object) [
            'wmData' => $wmdata,
            'domains' => $domains
];
// create json/script output to browser
$options = setOption();
$scripts = addScript($options, $data);
// create web site with data and JS scripts to process data.
$template = file_get_contents("template/template.html");

$template = str_replace(" <!-- [DATA} -->", $scripts, $template);

echo $template;

function getWebSiteData($path) {
    $result = [];
    $files = array_diff(scandir($path), array('.', '..'));
    foreach ($files as $file) {
        if (str_starts_with($file, "sitestatus.")) {
            $contents = file_get_contents($path . "/" . $file);
            array_push($result, json_decode($contents));
        }
    }
    return $result;
}

function getDomainList($url) {
    if ($url === "") {
        return [];
    }
    if ($url === null) {
        return [];
    }
    $data = file_get_contents($url);
    $domains = json_decode($data);
    return $domains;
}

function setOption() {
    $options = (object) [
                'divId' => "12345",
                'base' => "",
                'bing' => null,
                'bingkey' => null
    ];
    return $options;
}

function addScript($options, $data) {
    $script = "<script>window.addEventListener('load', function () {\n" .
            "var data='<DATA>';\n" .
            "var options='<OPTIONS>';\n" .
            "ra.bootstrapper('{}','wm.loader',options,data);});\n</script>";
    // $data = null;
    $script = str_replace("<DATA>", addslashes(json_encode($data)), $script);
    $script = str_replace("<OPTIONS>", addslashes(json_encode($options)), $script);
    return $script;
}
