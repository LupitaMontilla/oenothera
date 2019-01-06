<?php
$webroot = $_SERVER['DOCUMENT_ROOT'];
$page_title = 'FRIENDLIST+';
$page_title2 = 'Friendlist+';
$checker_kind = 'property';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <title><?php echo $page_title2 ?></title>
    <meta name="description" content="">
    <meta name="keywords" content="FF14,FFXIV">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=yes, maximum-scale=1.0, minimum-scale=1.0">
    <link href="/css/common.css" rel="stylesheet" type="text/css">
    <link href="/css/pc.css" rel="stylesheet" type="text/css">
    <link href="/css/sp.css" rel="stylesheet" type="text/css">
    <script src="/js/jquery-3.3.1.min.js"></script>
    <script src="/js/const.js"></script>
    <script src="/js/function.js"></script>
    <script src="/js/friendlist.js"></script>
    <script src="/js/acordion.js"></script>
</head>
<body>
<?php include($webroot.'/tools/include/header_friendlist.php'); ?>
    <div class="loading">
        <div class="loading_icon"></div>
    </div>
    <div class="bg colorless">
        <div class="main nowrap">
            <div id="character" style="display:none;">
                <div class="search_character">
                    <div class="search">
                        <input type="text" id="character_name" class="character_name" placeholder="キャラクター名を入力">
                        <div class="selectbox">
                            <select id="character_worldname" name="worldname">
                                <option value="">DC/ワールドを選択</option>
                            </select>
                        </div>
                        <button type="button" class="character_search search_btn button">キャラクターを検索</button>
                    </div>
                    <div class="result">
                        <input type="text" id="character_id" class="input_id" placeholder="キャラクターのID、またはURLを直接入力">
                    </div>
                </div>
                <div class="view">
                    <button type="button" class="chara_search search_btn button disable">キャラクターを一覧に追加</button>
                </div>
            </div>
            <div id="other" style="display:none;">
                <label for="delete_confirm"><input type="checkbox" id="delete_confirm" checked="checked">キャラクターを一覧から消す際に確認を表示する</label>
            </div>

            <div id="my_character_list">
                <ul class="list"></ul>
            </div>
            <!--
            <div id="character_list">
                <ul class="list"></ul>
            </div>
            -->
            <div id="searched__my_character_list">
                <ul class="list"></ul>
            </div>

            <div class="modal_wrap hide">
                <div id="my_character_back" class="modal_back"></div>
                <div id="my_character" class="modal">
                    <div class="search_character modal_content">
                        <h4>自キャラクターの追加</h4>
                        <div class="search">
                            <input type="text" id="my_character_name" class="character_name" placeholder="キャラクター名を入力">
                            <div class="selectbox">
                                <select id="my_character_worldname" name="worldname">
                                    <option value="">DC/ワールドを選択</option>
                                </select>
                            </div>
                            <button type="button" class="character_search search_btn button">キャラクターを検索</button>
                        </div>
                        <div class="result">
                            <input type="text" id="my_character_id" class="input_id" placeholder="キャラクターのID、またはURLを直接入力">
                        </div>
                    </div>
                    <div class="view">
                        <button type="button" id="search_friend_list" class="chara_search search_btn button disable">キャラクターを一覧に追加</button>
                    </div>
                </div>
            </div>

            <div class="modal_wrap hide">
                <div id="items_back" class="modal_back"></div>
                <div id="items" class="modal">
                    <div class="modal_content">
                        <h4>項目の追加</h4>
                        <input type="text" id="input__item_name"><button type="button" id="button__add_item" class="button">項目を追加</button>
                        <div>
                            <ul id="list__items" class="list">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
<?php include($webroot.'/tools/include/fellows_checker/'.$checker_kind.'/notes.php'); ?>
<?php include($webroot.'/tools/include/fellows_checker/'.$checker_kind.'/changelog.php'); ?>
    </div>
<?php include($webroot.'/tools/include/footer.php'); ?>
</body>
</html>
