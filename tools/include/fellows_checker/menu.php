            <div class="menu_wrap">
                <input type="checkbox" id="menu_1">
                <label for="menu_1" data-text="MENU" data-text2="*"><span></span></label>
                <ul id="accordion" class="menu">
<?php
if ($checker_kind == 'primalsmount') {
    include($webroot.'/tools/include/fellows_checker/primalsmount/items.php');
} else {
    include($webroot.'/tools/include/fellows_checker/menu_items.php');
}
?>
                    <div id="search_means" class="hidden_menu">
                        <div class="enclosure tabmenu">
                            <div class="caption">一覧の表示方法</div>
                            <label for="means0"><input type="radio" name="means" value="fc" id="means0" checked="checked"><em>フリーカンパニーで一覧を表示</em></label>
                            <label for="means1"><input type="radio" name="means" value="ls" id="means1"><em>リンクシェルで一覧を表示</em></label>
                            <label for="means2"><input type="radio" name="means" value="cr" id="means2"><em>キャラクターを一覧に追加</em></label>
                        </div>
                    </div>
                    <li class="group freecompany">
                        <div class="link"><i></i>フリーカンパニーで一覧を表示<i class="fa fa-chevron-down"></i></div>
                        <div class="submenu">
                            <div id="freecompany" class="search_mean acordion subcontent">
                                <div class="acordion_tree">
                                    <div class="search_freecompany">
                                        <div class="search">
                                            <input type="text" class="freecompany_name character_name" placeholder="FC名、または所属キャラ名を入力">
                                            <div class="selectbox">
                                                <select name="worldname">
                                                    <option value="">DC/ワールドを選択</option>
                                                </select>
                                            </div>
                                            <div class="buttons">
                                                <a href="javascript:void(0);" class="freecompany_search search_btn button">FCを検索</a>
                                                <a href="javascript:void(0);" class="character_search search_btn button">キャラクターを検索</a>
                                            </div>
                                        </div>
                                        <div class="result">
                                            <input type="text" id="freecompany_id" class="input_id" placeholder="FCのID、またはURLを直接入力">
                                        </div>
                                    </div>
                                    <div class="view">
                                        <a href="javascript:void(0);" class="fc_search search_btn button disable">フリーカンパニーで一覧を表示</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="group linkshell">
                        <div class="link"><i></i>リンクシェルで一覧を表示<i class="fa fa-chevron-down"></i></div>
                        <div class="submenu">
                            <div id="linkshell" class="search_mean acordion subcontent">
                                <div class="acordion_tree">
                                    <div class="search_linkshell">
                                        <div class="search">
                                            <input type="text" class="search_name" placeholder="取得したいLS名を入力">
                                            <div class="selectbox">
                                                <select name="worldname">
                                                    <option value="">DC/ワールドを選択</option>
                                                </select>
                                            </div>
                                            <a href="javascript:void(0);" class="search_btn button">LSを検索</a>
                                        </div>
                                        <div class="result">
                                            <input type="text" id="linkshell_id" class="input_id" placeholder="LSのID、またはURLを直接入力">
                                        </div>
                                    </div>
                                    <div class="view">
                                        <a href="javascript:void(0);" class="ls_search search_btn button disable">リンクシェルで一覧を表示</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="group character">
                        <div class="link"><i class=""></i>キャラクターを一覧に追加<i class="fa fa-chevron-down"></i></div>
                        <div class="submenu">
                            <div id="character" class="search_mean acordion subcontent">
                                <div class="acordion_tree">
                                    <div class="search_character">
                                        <div class="search">
                                            <input type="text" class="character_name" placeholder="IDを取得したいキャラクター名を入力">
                                            <div class="selectbox">
                                                <select name="worldname">
                                                    <option value="">DC/ワールドを選択</option>
                                                </select>
                                            </div>
                                            <a href="javascript:void(0);" class="character_search search_btn button">キャラクターを検索</a>
                                        </div>
                                        <div class="result">
                                            <input type="text" id="character_id" class="input_id" placeholder="キャラクターのID、またはURLを直接入力">
                                        </div>
                                    </div>
                                    <div class="view">
                                        <a href="javascript:void(0);" class="chara_search search_btn button disable">キャラクターを一覧に追加</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <div id="reset">
                        <a href="javascript:void(0);" class="reset_btn button">一覧をリセット</a>
                    </div>
                    <div id="other">
                        <label for="delete_confirm"><input type="checkbox" id="delete_confirm" checked="checked">キャラクターを一覧から消す際に確認を表示する</label>
                    </div>
                </ul>
            </div>
