                    <li id="menu__items">
                        <div class="link"><i></i>一覧に表示する項目を選択<i class="fa fa-chevron-down"></i></div>
                        <div class="submenu">
                            <div id="minion" class="acrodion subcontent">
<?php
if ($checker_kind == 'property') {
    include($webroot.'/tools/include/fellows_checker/items_job_class.php');
}
if ($checker_kind == 'property') {
    include($webroot.'/tools/include/fellows_checker/items_mount.php');
}
if ($checker_kind == 'property' || $checker_kind == 'minion') {
    include($webroot.'/tools/include/fellows_checker/items_minion.php');
}
?>
                                <ul class="items" data-title="表示したい項目を追加"></ul>
                                <div class="search"><a href="javascript:void(0);" class="search_btn button disable">追加した項目を一覧に表示</a></div>
                            </div>
                        </div>
                    </li>
