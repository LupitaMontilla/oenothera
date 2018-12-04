<?php
if(isset($_GET["url"])) {
	$content = file_get_contents($_GET["url"]);
	$json = array('result' => 'ok', 'data' => $content);
	header("Content-Type: text/javascript; charset=utf-8");
	echo json_encode($json, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
	exit();
}
?>
