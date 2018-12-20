$(function() {
    addWorldNameList();
    addMinionSelectList();
    $('.loading').addClass('is-hide');

    if (!window.matchMedia('(max-width: 640px)').matches) {
        $('#freecompany').parents('li').show();
        $('#linkshell').parents('li').hide();
        $('#character').parents('li').hide();
    }
    $('.freecompany_title').hide();
    $('.linkshell_title').hide();

    $('input[name="means"]:radio').on('change', function(){
        switch ($(this).val()) {
            case 'fc':
                $('#freecompany').parents('li').show();
                $('#linkshell').parents('li').hide();
                $('#character').parents('li').hide();
                break;
            case 'ls':
                $('#freecompany').parents('li').hide();
                $('#linkshell').parents('li').show();
                $('#character').parents('li').hide();
                break;
            case 'cr':
                $('#freecompany').parents('li').hide();
                $('#linkshell').parents('li').hide();
                $('#character').parents('li').show();
                break;
        }
    });

    $('#minion .minion_search input[type="text"]').on('focusout', function(){
        var search_string = $(this).val();
        var $minion_select = $('#minion .minion_search .selectbox select[name="minion"]');
        var $searched_option = $('#minion .minion_search .selectbox .hidden_option .searched_option');
        $searched_option.find('option').appendTo($minion_select);
        $minion_select.find('option').filter(function(index){
            if (index !== 0) {
                var name = $(this).val();
                return !name.match(search_string);
            }
            return false;
        }).appendTo($searched_option);
        sortMinionByName();
    });

    $('#minion .minion_search .add.search_btn').on('click', function(){
        var selected = $('#minion .minion_search select[name="minion"]').val();
        if (selected == null || selected === '') {
            alert('ミニオン名を選択してください。');
            return false;
        }
        $('#minion .items').append('<div><input type="text" value="'+selected+'" readonly="readonly"><a href="javascript:void(0);" class="delete_btn button">×</a></div>');
        var $select = $('#minion .minion_search select[name="minion"]');
        var $selected_option = $('#minion .minion_search .selectbox .hidden_option .selected_option');
        $select.find('option[value="'+selected+'"]').appendTo($selected_option);
        $select.find('option').attr('selected', false);
        $($select.find('option')[0]).attr('selected', true)
    });

    $('#minion .items').on('click', '.delete_btn', function(){
        var $minion_select = $('#minion .minion_search select[name="minion"]');
        var $selected_option = $('#minion .minion_search .selectbox .hidden_option .selected_option');
        var value = $(this).parent('div').children('input[type="text"]').val();
        $minion_select.append($selected_option.find('option[value="'+value+'"]'));
        $(this).parent('div').remove();
        sortMinionByName();
    });

    $('#minion').on('click', '.search .search_btn', function(){
        $('.mount_image.list_item').remove();
        $('.chara_name.list_item').each(function(){
            var chara_id = $(this).attr('id').split('_')[2];
            var $content = $('#ldst_main_'+chara_id);

            var $minions = $('#minion').children('.items').find('input[type="text"]');
            var tooltips = new Array();
            var minions = new Array();
            $minions.each(function(index){
                if ($(this).val().indexOf('job:') === 0) {
                    var job_name = $(this).val().split(':')[1];
                    tooltips.push(job_name);
                    var $job_name = $content.find('.character__job__name[data-tooltip="'+job_name+'"]');
                    minions.push($job_name.siblings('.character__job__icon'));
                } else {
                    tooltips.push($(this).val());
                    minions.push($content.find('.character__item_icon[data-tooltip="'+$(this).val()+'"]'));
                }
            });

            var key_number = 4;
            for (var i = 0; i < minions.length; i++) {
                $('.list').append('<li id="mount'+i+'_'+chara_id+'" class="mount_image list_item" data-sortkey="'+(key_number++)+'"><span class="tooltip"><span class="text">'+tooltips[i]+'</span></span></li>');
                $('#mount'+i+'_'+chara_id).append('<span class="tooltip"><span class="text">'+tooltips[i]+'</span></span>');
                var $minion = $(minions[i]).clone();
                $minion.appendTo('#mount'+i+'_'+chara_id);
			}
            sortByCharacterName();
        });
    });

    $('#freecompany .search').on('click', '.freecompany_search.search_btn', function(){
        var freecompanyname = $('#freecompany .search_freecompany .freecompany_name').val();
        var worldname = $('#freecompany select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_freecompany');
        searchFreecompanyList($area, freecompanyname.trim(), worldname);
    });

    $('#freecompany .result').on('change', 'select[name="freecompanys"]', function(){
        var freecompany_id = $(this).val();
        if (!freecompany_id) {
            $(this).parents('.search_mean').find('.input_id').val('');
            return false;
        }
        $(this).parents('.search_mean').find('.input_id').val(freecompany_id);
    });

    $('#freecompany .search').on('click', '.character_search.search_btn', function(){
        var charactername = $('#freecompany .search_freecompany .character_name').val();
        var worldname = $('#freecompany select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_freecompany');
        searchCharacterList($area, charactername.trim(), worldname);
    });

    $('#freecompany .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        if (!character_id) {
            $('#freecompany_id').val('');
            return false;
        }
        getMyCharacterData(character_id);
    });

	$('#freecompany').on('click', '.fc_search.search_btn', function(){
		var freecompany_id = $('#freecompany_id').val();
		if (!freecompany_id) {
			alert('フリーカンパニーのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(freecompany_id)) {
			var index = freecompany_id.indexOf('/lodestone/freecompany/');
			var freecompany_path = freecompany_id.slice(index);
			freecompany_id = freecompany_path.split('/')[3];
		}
		if ($('.freecompany_title .freecompany_name').attr('data-id') == freecompany_id) {
			alert('現在表示しているフリーカンパニーです。');
			return false;
		}
		var chara_id_list = [];
		$.when(
			$.ajax({
				url: '/php/ldst_access.php?url='+LODESTONE_URL+'/freecompany/'+freecompany_id+'/member/',
				type: 'GET',
				dataType: 'json',
                loadingHide: function(data){}
			})
			.then(
				function(res){
                    if (!$.isEmptyObject('.list')) {
						if ($('.freecompany_title .freecompany_name').attr('data-id') != null || $('.linkshell_title .linkshell_name').attr('data-id') != null) {
                            if (!confirm('現在の一覧を消去してからフリーカンパニーを読み込みますがよろしいですか？')) {
                                return false;
                            }
						}
					}
					resetList();

					var $content = $(res.data);
					var freecompany_name = $content.find('.entry__freecompany__name').text();
                    var freecompany_crest = $content.find('.entry__freecompany__crest--position').html();
					$('.freecompany_title .freecompany_name').text(freecompany_name);
					$('.freecompany_title .freecompany_name').attr('data-id', freecompany_id);
                    $('.freecompany_title .crest').append(freecompany_crest);
                    $('.freecompany_title').show();

					$content.find('.entry__bg').each(function(index){
						var href = $(this).attr('href');
						var chara_id = href.split('/')[3];
						chara_id_list.push(chara_id);
					});
				},
				function(XMLHttpRequest, textStatus, errorThrown) {
					alert('フリーカンパニーの情報が取得できませんでした。');
					console.log("XMLHttpRequest: " + XMLHttpRequest.status);
					console.log("textStatus: " + textStatus);
					console.log("errorThrown: " + errorThrown.message);
				}
			)
		).done(function(){
            resetCharacterData();
            var deffered_list = [];
            var char_list_length = chara_id_list.length;
			for (var i = 0; i < char_list_length; i++) {
                var $ajax;
                (function(j){
                    var chara_id = chara_id_list[j];
                    $ajax = addCharaData(chara_id);
                })(i);
                deffered_list.push($ajax);
			}
            $.when.apply($, deffered_list).done(function(){
                sortByCharacterName();
                getCharacterData();
            });
		});
	});

    $('#linkshell .search').on('click', '.search_btn', function(){
        var linkshellname = $('#linkshell .search_name').val();
        var worldname = $('#linkshell select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean');
        searchLinkshellList($area, linkshellname.trim(), worldname);
    });

    $('#linkshell .result').on('change', 'select[name="linkshells"]', function(){
        var linkshell_id = $(this).parents('.search_mean').find('select[name="linkshells"]').val();
        if (!linkshell_id) {
            $(this).parents('.search_mean').find('.input_id').val('');
        }
        $(this).parents('.search_mean').find('.input_id').val(linkshell_id);
    });

	$('#linkshell').on('click', '.ls_search.search_btn', function(){
		var linkshell_id = $('#linkshell_id').val();
		if (!linkshell_id) {
			alert('リンクシェルのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(linkshell_id)) {
			var index = linkshell_id.indexOf('/lodestone/linkshell/');
			var linkshell_path = linkshell_id.slice(index);
			linkshell_id = linkshell_path.split('/')[3];
		}
		if ($('.linkshell_title .linkshell_name').attr('data-id') == linkshell_id) {
			alert('現在表示しているリンクシェルです。');
			return false;
		}
		var chara_id_list = [];
		$.when(
			$.ajax({
				url: '/php/ldst_access.php?url='+LODESTONE_URL+'/linkshell/'+linkshell_id,
				type: 'GET',
				dataType: 'json',
                loadingHide: function(data){}
			})
			.then(
				function(res){
					if (!$.isEmptyObject('.list')) {
						if ($('.freecompany_title .freecompany_name').attr('data-id') != null || $('.linkshell_title .linkshell_name').attr('data-id') != null) {
                            if (!confirm('現在の一覧を消去してからリンクシェルを読み込みますがよろしいですか？')) {
                                return false;
                            }
						}
					}
					resetList();

					var $content = $(res.data);
					var linkshell_name = $content.find('.heading__linkshell__name').text();
                    var linkshell_icon = $content.find('.heading__linkshell__icon').html()
					$('.linkshell_title .linkshell_name').text(linkshell_name);
					$('.linkshell_title .linkshell_name').attr('data-id', linkshell_id);
					$('.linkshell_title .icon').append(linkshell_icon);
                    $('.linkshell_title').show();

					$content.find('.entry__link').each(function(index){
						var href = $(this).attr('href');
						var chara_id = href.split('/')[3];
						chara_id_list.push(chara_id);
					});
				},
				function(XMLHttpRequest, textStatus, errorThrown) {
					alert('リンクシェルの情報が取得できませんでした。');
					console.log("XMLHttpRequest: " + XMLHttpRequest.status);
					console.log("textStatus: " + textStatus);
					console.log("errorThrown: " + errorThrown.message);
				}
			)
		).done(function(){
            resetCharacterData();
            var deffered_list = [];
            var char_list_length = chara_id_list.length;
			for (var i = 0; i < char_list_length; i++) {
                var $ajax;
                (function(j){
                    var chara_id = chara_id_list[j];
                    $ajax = addCharaData(chara_id);
                })(i);
                deffered_list.push($ajax);
			}
            $.when.apply($, deffered_list).done(function(){
                sortByCharacterName();
                getCharacterData();
            });
		});
	});

    $('#character .search').on('click', '.search_btn', function(){
        var charactername = $('#character .character_name').val();
        var worldname = $('#character select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_character');
        searchCharacterList($area, charactername.trim(), worldname);
    });

    $('#character .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        $(this).parents('.search_mean').find('.input_id').val(character_id);
    });

	$('#character').on('click', '.chara_search.search_btn', function(){
        var chara_id = $('#character').find('.input_id').val();
		if (!chara_id) {
			alert('キャラクターのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(chara_id)) {
			var index = chara_id.indexOf('/lodestone/character/');
			var chara_path = chara_id.slice(index);
			chara_id = chara_path.split('/')[3];
		}
        if (document.getElementById('chara_name_'+chara_id) != null) {
            alert('すでに一覧に表示しているキャラクターです。');
            return false;
        }
        $ajax = addCharaData(chara_id);
        $ajax.done(function(){
            getCharacterData();
        });
	});

	$('#reset').on('click', '.reset_btn', function(){
		if (confirm('現在の一覧を消去してよろしいですか？')) {
			resetList();
		}
	});

	$('#mount_list').on('click', '.list .delete_btn', function(){
		if (!$('#delete_confirm').prop('checked') || confirm('選択したキャラクターを一覧から削除しますか？')) {
			chara_id = $(this).attr('data-id');
			$('#break_'+chara_id).remove();
			$('#chara_face_'+chara_id).remove();
			$('#chara_name_'+chara_id).remove();
			for (var i = 0; i < 20; i++) {
				$('#mount'+i+'_'+chara_id).remove();
			}
			$(this).remove();
		}
	});
});

$(document).on('ajaxSend', function(e, jqXHR, obj){
    var $loading = $('.loading');
    $loading.removeClass('is-hide');
    setTimeout(function(){
        $.when(jqXHR)
        .done(function(data){
            $loading.addClass('is-hide');
            obj.loadingHide(data);
        })
        .fail(function(){
            $loading.addClass('is-hide');
        });
    }, 400);
});

function resetList() {
	$('.list').empty();
    $('.freecompany_title .crest').empty();
	$('.freecompany_title .freecompany_name').empty();
    $('.freecompany_title .freecompany_name').attr('data-id', '');
    $('.freecompany_title').hide();
    $('.linkshell_title .icon').empty();
	$('.linkshell_title .linkshell_name').empty();
    $('.linkshell_title .linkshell_name').attr('data-id', '');
    $('.linkshell_title').hide();
    $('.back_list').empty();
}

function addWorldNameList() {
    $.ajax({
        url: '/json/worldname.json',
        datatype: 'json',
        loadingHide: function(res){}
    })
    .then(
        function(worldnames){
            var $select_worldname = $('select[name="worldname"]');
            $.each(worldnames, function(label, option_list){
                $select_worldname.append('<optgroup label="'+label+'">');
                $.each(option_list, function(key, val){
                    $select_worldname.append('<option value="'+val+'">'+key+'</option>');
                });
                $select_worldname.append('</optgroup>');
            });
            //$('select[name="worldname"]').append(worldnames);
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
        }
    );
}

function addMinionSelectList() {
    $.ajax({
        url: '/json/minion.json',
        datatype: 'json',
        loadingHide: function(res){}
    })
    .then(
        function(minions){
            var $select_minion = $('select[name="minion"]');
            $.each(minions, function(key, val){
                var value = val['value'];
                var kana = val['kana'];
                $select_minion.append('<option value="'+value+'" data-kana="'+kana+'">'+key+'</option>');
            });
            sortMinionByName();
        },
        function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
        }
    );
}

var ldst = '';
function resetCharacterData() {
    ldst = '';
}

function addCharacterData(chara_data) {
    ldst += chara_data;
}

function getCharacterData() {
    $('.back_list').append(ldst);
    $('.back_list').hide();
}

function setDeleteButtonRightPosition() {
    if (window.matchMedia('(max-width: 640px)').matches) {
        var list_width = $('#mount_list').innerWidth();
        var delete_btn_right = (list_width % (2 + 40 + 2)) - (8 - 2);
        console.log(list_width);
        console.log(delete_btn_right);
        $('#mount_list .delete').css('right', delete_btn_right+'px');
    }
}

function sortMinionByName() {
    var $minion_select = $('#minion .minion_search select[name="minion"]');
    $minion_select.html(
        $minion_select.find('option').sort(function(a, b){
            if ($(a).attr('data-kana') > $(b).attr('data-kana')) return 1;
            if ($(a).attr('data-kana') < $(b).attr('data-kana')) return -1;
            return 0;
        })
    );
    $minion_select.find('option').attr('selected', false);
    $($minion_select.find('option')[0]).attr('selected', true)
}

function sortByCharacterName() {
    $('#mount_list .list').html(
        $('li.list_item').sort(function(a, b){
            var id_string_a = $(a).attr('id');
            var id_a_array = id_string_a.split('_');
            var id_a = id_a_array[id_a_array.length-1];
            var name_a = $('#chara_name_'+id_a).children('em').text();
            var world_a = $('#chara_name_'+id_a).children('.character_world').text();
            var first_name_a = name_a.split(' ')[0];
            var last_name_a = name_a.split(' ')[1];

            var id_string_b = $(b).attr('id');
            var id_b_array = id_string_b.split('_');
            var id_b = id_b_array[id_b_array.length-1];
            var name_b = $('#chara_name_'+id_b).children('em').text();
            var world_b = $('#chara_name_'+id_b).children('.character_world').text();
            var first_name_b = name_b.split(' ')[0];
            var last_name_b = name_b.split(' ')[1];

            if (first_name_a > first_name_b) return 1;
            if (first_name_a < first_name_b) return -1;
            if (last_name_a > last_name_b) return 1;
            if (last_name_a < last_name_b) return -1;
            if (world_a > world_b) return 1;
            if (world_a < world_b) return -1;
            if (Number($(a).attr('data-sortkey')) > Number($(b).attr('data-sortkey'))) return 1;
            if (Number($(a).attr('data-sortkey')) < Number($(b).attr('data-sortkey'))) return -1;
            return 0;
        })
    );
}

function searchFreecompanyList($area, name, world) {
    var name_string = name.replace(' ', '+');
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/freecompany/?q='+name_string+'&worldname='+world);
	$.ajax({
		url: '/php/ldst_access.php?url='+encoded_url,
		type: 'GET',
		dataType: 'json',
        loadingHide: function(data){}
	})
	.then(
		function(res){
			var $content = $(res.data);
            var $result = $area.find('.result').empty();
            var area_name = $area.find('.search_mean_name').attr('data-shortname');

            var freecompany_names = $content.find('.ldst__main').find('.entry__name');
            if (freecompany_names.length <= 0) {
                alert('フリーカンパニーが1件もみつかりませんでした。');
                return false;
            }

            var freecompany_ids = $content.find('.ldst__main').find('.entry__block');
            var freecompany_worlds = $content.find('.ldst__main').find('.entry__world');
            $result.append('<div class="selectbox move_in"><select name="freecompanys"><option value="">フリーカンパニーを選択</option></select></div>');
            $.each(freecompany_names, function(index, val){
                var id = $(freecompany_ids[index]).attr('href').split('/')[3];
                var name = $(val).text();
                var world = $(freecompany_worlds[index*2+1]).text();
                $result.find('select[name="freecompanys"]').append('<option value="'+id+'">'+name+' ('+world+')</option>');
            });
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('フリーカンパニーの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}

function searchLinkshellList($area, name, world) {
    var name_string = name.replace(' ', '+');
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/linkshell/?q='+name_string+'&worldname='+world);
	$.ajax({
		url: '/php/ldst_access.php?url='+encoded_url,
		type: 'GET',
		dataType: 'json',
        loadingHide: function(data){}
	})
	.then(
		function(res){
			var $content = $(res.data);
            var $result = $area.find('.result').empty();
            var area_name = $area.find('.search_mean_name').attr('data-shortname');

            var linkshell_names = $content.find('.ldst__main').find('.entry__name');
            if (linkshell_names.length <= 0) {
                alert('リンクシェルが1件もみつかりませんでした。');
                return false;
            }

            var linkshell_ids = $content.find('.ldst__main').find('.entry__link--line');
            var linkshell_worlds = $content.find('.ldst__main').find('.entry__world');
            $result.append('<div class="selectbox move_in"><select name="linkshells"><option value="">リンクシェルを選択</option></select></div>');
            $.each(linkshell_names, function(index, val){
                var id = $(linkshell_ids[index]).attr('href').split('/')[3];
                var name = $(val).text();
                var world = $(linkshell_worlds[index]).text();
                $result.find('select[name="linkshells"]').append('<option value="'+id+'">'+name+' ('+world+')</option>');
            });
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('リンクシェルの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}

function searchCharacterList($area, name, world) {
    var name_string = name.replace(' ', '+');
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/character/?q='+name_string+'&worldname='+world+'&blog_lang=ja');
	$.ajax({
		url: '/php/ldst_access.php?url='+encoded_url,
		type: 'GET',
		dataType: 'json',
        loadingHide: function(data){}
	})
	.then(
		function(res){
			var $content = $(res.data);
            var $result = $area.find('.result').empty();
            var area_name = $area.parents('.search_mean').find('.search_mean_name').attr('data-shortname');

            var character_names = $content.find('.ldst__main').find('.entry__name');
            if (character_names.length <= 0) {
                alert('キャラクターが1件もみつかりませんでした。');
                return false;
            }

            var character_ids = $content.find('.ldst__main').find('.entry__link');
            var character_worlds = $content.find('.ldst__main').find('.entry__world');
            $result.append('<div class="selectbox move_in"><select name="characters"><option value="">キャラクターを選択</option></select></div>');
            $.each(character_names, function(index, val){
                var id = $(character_ids[index]).attr('href').split('/')[3];
                var name = $(val).text();
                var world = $(character_worlds[index]).text();
                $result.find('select[name="characters"]').append('<option value="'+id+'">'+name+' ('+world+')</option>');
            });
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('キャラクターの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}

function getMyCharacterData(character_id) {
    $.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+character_id,
		type: 'GET',
		dataType: 'json',
        loadingHide: function(data){}
	})
	.then(
		function(res){
			$content = $(res.data);
            var freecompany_name = $content.find('.character__freecompany__name h4 a');
            //var linkshell_names = $content.find('.character__linkshell__name ul li a');

            /*
            $('#my_character .result').append('<select name="group">');
            $('#my_character .result select[name="group"]').append('<option value="'+$(freecompany_name).attr('href')+'">'+$(freecompany_name).text()+'</option>');
            $.each(linkshell_names, function(index, val){
                $('#my_character .result select[name="group"]').append('<option value="'+$(val).attr('href')+'">'+$(val).text()+'</option>');
            });
            $('#my_character .result').append('</select>');
            */
            var freecompany_path = $(freecompany_name).attr('href');
            if (freecompany_path == null) {
                alert('フリーカンパニー未所属のキャラクターです。');
                $('#freecompany_id').val('');
                return false;
            }
            var freecompany_id = freecompany_path.split('/')[3];
            $('#freecompany_id').val(freecompany_id);
        }
	);
}
