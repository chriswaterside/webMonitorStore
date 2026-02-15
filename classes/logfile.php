<?php

/**
 * Description of logfile
 *
 * @author Chris Vaughan
 */
class Logfile {

    private static $logfile = null;
    private static $noerrors = 0;
    private static $errors = [];
    private static $name = '';

    static function create($name) {
        self::$name = $name;

        // Ensure directory exists
        $dir = dirname($name);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $subname = date("YmdHis");
        $filename = $name . $subname . ".log";
        $logfile = fopen($filename, "w");

        if (!$logfile) {
            error_log("Logfile::create FAILED: $filename");
            return false;
        }

        self::$logfile = $logfile;
        self::writeWhen("Logfile {$subname}.log created");
        self::deleteOldFiles();
        self::$errors = [];
        return true;
    }

    static function deleteOldFiles() {
        if (empty(self::$name)) {
            return;
        }
        $today = date("Y-m-d");
        $date = new DateTime($today);
        $date->sub(new DateInterval('P3D'));
        $cutoff = $date->format('Ymd');  // Match filename format

        foreach (glob(self::$name . "*.log") as $filename) {
            $filedate = date("Ymd", filemtime($filename));
            if ($filedate < $cutoff) {
                unlink($filename);
                self::writeWhen("Old logfile deleted: " . basename($filename));
            }
        }
    }

    static function write($text) {
        if (self::$logfile) {
            fwrite(self::$logfile, $text . "\n");
        }
    }

    static function writeWhen($text) {
        $when = (new DateTime())->format('Y-m-d H:i:s');
        self::write($when . " " . $text);
    }

    static function writeError($text) {
        self::$noerrors++;
        self::writeWhen(" ERROR: " . $text);
        if (self::$noerrors <= 10) {
            self::$errors[] = $text;
        }
    }

    // getters
    static function getNoErrors() {
        return self::$noerrors;
    }

    static function getErrors() {
        return self::$errors;
    }

    static function resetNoErrors() {
        self::$noerrors = 0;
    }

    static function close() {
        if (self::$logfile) {
            fclose(self::$logfile);
            self::$logfile = null;
        }
    }
}
