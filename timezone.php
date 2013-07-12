<?php

$lat = $_GET['latitude'];
$lon = $_GET['longitude'];

$content = file_get_contents('https://maps.googleapis.com/maps/api/timezone/json?location=' .
                             $lat . ',' . $lon .
                             '&timestamp=1331161200&sensor=false&language=en');
if( $content !== FALSE ) {
  echo $content;
}
else {
  echo "error";
}
