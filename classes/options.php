<?php

/**
 * Class to find out command line, get and put options
 *
 * @author Chris Vaughan
 */
class Options {

    private $gets = array();
    private $posts = array();
 
   public function __construct() {
        foreach ($_GET as $key => $value) {
            $this->gets[$key] = $value;
        }
        foreach ($_POST as $key => $value) {
            $this->posts[$key] = $value;
        }
    }
    public function posts($name) {
        return $this->posts[$name] ?? null;  
    }
    public function gets($name) {
        return $this->gets[$name] ?? null;  
    } 
}