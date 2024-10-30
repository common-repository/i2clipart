<?php
// search i2clipart.com for images
$limit	= $_GET['limit'];
$page	= $_GET['page'];
$query	= $_GET['query'];
$key	= $_GET['key'];
$url	= $_GET['url'];

$Response = file_get_contents("http://www.i2clipart.com/api/tinymce?limit=$limit&page=$page&query=$query&key=$key&url=$url");
echo $Response;
?>