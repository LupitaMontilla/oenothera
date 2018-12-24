<?php
$webroot = $_SERVER['DOCUMENT_ROOT'];
$page_title = 'FELLOWS PRIMALSMOUNT CHECKER';
$checker_kind = 'primalsmount';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <title>みんなあの極蛮神マウントとれた？</title>
    <meta name="description" content="">
    <meta name="keywords" content="FF14,FFXIV">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=yes, maximum-scale=1.0, minimum-scale=1.0">
    <link href="/css/common.css" rel="stylesheet" type="text/css">
    <link href="/css/pc.css" rel="stylesheet" type="text/css">
    <link href="/css/sp.css" rel="stylesheet" type="text/css">
    <script src="/js/jquery-3.3.1.min.js"></script>
    <script src="/js/const.js"></script>
    <script src="/js/list_common.js"></script>
    <script src="/js/acordion.js"></script>
</head>
<body>
<?php include($webroot.'/tools/include/header.php'); ?>
    <div class="loading">
        <div class="loading_icon"></div>
    </div>
    <div class="bg">
        <div class="main">
<?php include($webroot.'/tools/include/fellows_checker/menu.php'); ?>
<?php include($webroot.'/tools/include/fellows_checker/list.php'); ?>
        </div>
<?php include($webroot.'/tools/include/fellows_checker/'.$checker_kind.'/notes.php'); ?>
<?php include($webroot.'/tools/include/fellows_checker/'.$checker_kind.'/changelog.php'); ?>
    </div>
<?php include($webroot.'/tools/include/footer.php'); ?>
</body>
</html>
