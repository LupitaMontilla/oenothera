$(function() {
    addWorldNameList();
    addMinionSelectList();
    addMountSelectList();
    addJobSelectList();
    $('.loading').addClass('is-hide');

    if (!window.matchMedia('(max-width: 640px)').matches) {
        $('#freecompany').parents('li').show();
        $('#linkshell').parents('li').hide();
        $('#character').parents('li').hide();
    }
    $('.freecompany_title').hide();
    $('.linkshell_title').hide();

    var x;
    var y;

    var mdn = function(e) {
        var drag_menu = $(this).parent('.drag_menu');
        $(drag_menu).addClass('drag');
        x = event.pageX - $(drag_menu).offset().left;
        y = event.pageY - $(drag_menu).offset().top;

        $('body').on('mousemove touchmove', mmv);
    }

    var mmv = function(e) {
        var drag = $('.drag')[0];
        if (drag == null) {
            return false;
        };

        e.preventDefault();

        drag.style.top = event.pageY - y + 'px';
        drag.style.left = event.pageX - x + 'px';

        $(drag).on('mouseup touchend', mup);
        $('body').on('mouseleave touchleave', mup);
    }

    var mup = function() {
        var drag = $('.drag')[0];
        if (drag == null) {
            return false;
        };
        $('body').off('mousemove touchmove', mmv);
        $(drag).off('mouseup touchend', mup);

        $(drag).removeClass('drag');
    }

    $('#menu__items .link').on('mousedown touchstart', mdn);

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

    $('#menu_1').on('change', function(){
        $('html').toggleClass('scroll-prevent');
    });

    $('#search_means input[name="means"]').on('change', function(){
        $('#freecompany').find('.move_in').removeClass('move_in');
        $('#linkshell').find('.move_in').removeClass('move_in');
        $('#character').find('.move_in').removeClass('move_in');
    });

    $('#minion__item_select').on('change', function(){
        var selected = $(this).val();
        if (selected === '') {
            return false;
        }
        $('#minion .items').append('<li class="item tag_minion move_in"><div class="tag" data-text="'+selected+'">'+selected+'</div><a href="javascript:void(0);" class="delete_btn button">×</a></li>');
        $('#minion .search .search_btn').removeClass('disable');
        $(this).find('option[value="'+selected+'"]').appendTo('#minion__selected_options');
        $(this).find('option').attr('selected', false);
        $($(this).find('option')[0]).attr('selected', true);
    });

    $('#minion__item_search').on('focusout', function(){
        var search_string = $(this).val();
        var $minion_item_select = $('#minion__item_select');
        var $minion_searched_options = $('#minion__searched_options');
        $minion_searched_options.find('option').appendTo($minion_item_select);
        $minion_item_select.find('option').filter(function(index){
            if (index !== 0) {
                var name = $(this).val();
                return !name.match(search_string);
            }
            return false;
        }).appendTo($minion_searched_options);
        sortMinionByName();
    });

    $('#mount__item_select').on('change', function(){
        var selected = $(this).val();
        if (selected === '') {
            return false;
        }
        $('#minion .items').append('<li class="item tag_mount move_in"><div class="tag" data-text="'+selected+'">'+selected+'</div><a href="javascript:void(0);" class="delete_btn button">×</a></li>');
        $('#minion .search .search_btn').removeClass('disable');
        $(this).find('option[value="'+selected+'"]').appendTo('#mount__selected_options');
        $(this).find('option').attr('selected', false);
        $($(this).find('option')[0]).attr('selected', true);
    });

    $('#mount__item_search').on('focusout', function(){
        var search_string = $(this).val();
        var $mount_item_select = $('#mount__item_select');
        var $mount_searched_options = $('#mount__searched_options');
        $mount_searched_options.find('option').appendTo($mount_item_select);
        $mount_item_select.find('option').filter(function(index){
            if (index !== 0) {
                var name = $(this).val();
                return !name.match(search_string);
            }
            return false;
        }).appendTo($mount_searched_options);
        sortMinionByName();
    });

    //$('#minion .job_search select[name="job_class"]').on('change', function(){
    $('#job_class__item_select').on('change', function(){
        var selected = $(this).val();
        if (selected == null || selected === '') {
            return false;
        }
        var selected_text = $(this).find('option:selected').text();
        $('#minion .items').append('<li class="item tag_job_class move_in"><div class="tag" data-text="'+selected+'">'+selected_text+'</div><a href="javascript:void(0);" class="delete_btn button">×</a></li>');
        $('#minion .search .search_btn').removeClass('disable');
        $(this).find('option[value="'+selected+'"]').appendTo('#job_class__selected_options');
        $(this).find('option').attr('selected', false);
        $($(this).find('option')[0]).attr('selected', true);
    });

    $('#minion .items').on('click', '.delete_btn', function(){
        var item_name = $(this).siblings('.tag').attr('data-text');
        $('#minion__item_select').append($('#minion__selected_options').find('option[value="'+item_name+'"]'));
        $('#mount__item_select').append($('#mount__selected_options').find('option[value="'+item_name+'"]'));
        $('#job_class__item_select').append($('#job_class__selected_options').find('option[value="'+item_name+'"]'));
        $(this).parent('.item').addClass('move_out');
        $('.move_out').on('webkitAnimationEnd', function(){
            $(this).remove();
            if (!$('#minion .items .item').length) {
                $('#minion .search .search_btn').addClass('disable');
            }
        });
        sortMinionByName();
        sortMountByName();
        sortJobClassByOrder();
    });

    $('#minion').on('click', '.search .search_btn', function(){
        if (!$('#minion .items .item').length) {
            alert('リストが空です。');
            return false;
        }
        if (!$('#mount_list .list .character_info').length) {
            alert('キャラクターがいません。');
            return false;
        }
        $('.mount_image.list_item').remove();
        $('.job_icon.list_item').remove();
        $('.job_level.list_item').remove();
        $('.chara_name.list_item').each(function(){
            var chara_id = $(this).attr('id').split('_')[2];
            var $content = $('#ldst_main_'+chara_id);
            var key_number = 4;
            addListItems($content, chara_id, key_number);
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
        if (freecompany_id === '') {
            $('#freecompany .view .fc_search').addClass('disable');
        } else {
            $(this).parents('.search_mean').find('.input_id').val('');
            $('#freecompany .view .fc_search').removeClass('disable');
        }
        $(this).parents('.search_mean').find('.input_id').val(freecompany_id);
    });

    $('#freecompany .search').on('click', '.character_search.search_btn', function(){
        var charactername = $('#freecompany .search_freecompany .character_name').val();
        var worldname = $('#freecompany select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_freecompany');
        var option_text = ' の FC';
        searchCharacterList($area, charactername.trim(), worldname, option_text);
    });

    $('#freecompany .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        if (character_id === '') {
            $('#freecompany_id').val('');
            $('#freecompany .view .fc_search').addClass('disable');
        } else {
            getMyCharacterData(character_id);
            $('#freecompany .view .fc_search').removeClass('disable');
        }
    });

    $('#freecompany_id').on('focusout', function(){
        if ($(this).val() === '') {
            $('#freecompany .view .fc_search').addClass('disable');
        } else {
            $('#freecompany .view .fc_search').removeClass('disable');
        }
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
        if (linkshell_id === '') {
            $('#linkshell .view .ls_search').addClass('disable');
        } else {
            $('#linkshell .view .ls_search').removeClass('disable');
        }
        $(this).parents('.search_mean').find('.input_id').val(linkshell_id);
    });

    $('#linkshell_id').on('focusout', function(){
        if ($(this).val() === '') {
            $('#linkshell .view .ls_search').addClass('disable');
        } else {
            $('#linkshell .view .ls_search').removeClass('disable');
        }
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
        searchCharacterList($area, charactername.trim(), worldname, '');
    });

    $('#character .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        $(this).parents('.search_mean').find('.input_id').val(character_id);
        if (character_id === '') {
            $('#character .view .chara_search').addClass('disable');
        } else {
            $('#character .view .chara_search').removeClass('disable');
        }
    });

    $('#character_id').on('focusout', function(){
        if ($(this).val() === '') {
            $('#character .view .chara_search').addClass('disable');
        } else {
            $('#character .view .chara_search').removeClass('disable');
        }
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
            sortByCharacterName();
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
            /*
			$('#break_'+chara_id).remove();
			$('#chara_face_'+chara_id).remove();
			$('#chara_name_'+chara_id).remove();
			for (var i = 0; i < 20; i++) {
				$('#mount'+i+'_'+chara_id).remove();
			}
			$(this).remove();
            */
            $('#character_'+chara_id).remove();
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
                    $select_worldname.children('optgroup[label="'+label+'"]').append('<option value="'+val+'">'+key+'</option>');
                });
            });
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

function addMountSelectList() {
    $.ajax({
        url: '/json/mount.json',
        datatype: 'json',
        loadingHide: function(res){}
    })
    .then(
        function(minions){
            var $select_minion = $('select[name="mount"]');
            $.each(minions, function(key, val){
                $select_minion.append('<option value="'+val+'">'+val+'</option>');
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

function addJobSelectList() {
    $.ajax({
        url: '/json/job_class.json',
        datatype: 'json',
        loadingHide: function(res){}
    })
    .then(
        function(jobs){
            var $select_job_class = $('select[name="job_class"]');
            var index = 0;
            $.each(jobs, function(label, option_list){
                $select_job_class.append('<optgroup label="'+label+'" data-groupkey="'+index+'">');
                $.each(option_list, function(key, val){
                    $select_job_class.children('optgroup[label="'+label+'"]').append('<option value="job:'+val+'" data-groupkey="'+index+'" data-sortkey="'+key+'">'+val+'</option>');
                });
                index++;
            });
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
        $('#mount_list .delete').css('right', delete_btn_right+'px');
    }
}

function sortMinionByName() {
    var $minion_item_select = $('#minion__item_select');
    $minion_item_select.html(
        $minion_item_select.find('option').sort(function(a, b){
            if ($(a).attr('data-kana') > $(b).attr('data-kana')) return 1;
            if ($(a).attr('data-kana') < $(b).attr('data-kana')) return -1;
            return 0;
        })
    );
    $minion_item_select.find('option').attr('selected', false);
    $($minion_item_select.find('option')[0]).attr('selected', true)
}

function sortMountByName() {
    var $mount_item_select = $('#mount__item_select');
    /*
    $mount_item_select.html(
        $mount_item_select.find('option').sort(function(a, b){
            if ($(a).attr('data-kana') > $(b).attr('data-kana')) return 1;
            if ($(a).attr('data-kana') < $(b).attr('data-kana')) return -1;
            return 0;
        })
    );
    */
    $mount_item_select.find('option').attr('selected', false);
    $($mount_item_select.find('option')[0]).attr('selected', true)
}

function sortJobClassByOrder() {
    var $job_class_item_select = $('#job_class__item_select');
    $job_class_item_select.find('optgroup').each(function(){
        var groupkey = $(this).attr('data-groupkey');
        $(this).html(
            $job_class_item_select.find('option[data-groupkey="'+groupkey+'"]').sort(function(a, b){
                if ($(a).attr('data-sortkey') > $(b).attr('data-sortkey')) return 1;
                if ($(a).attr('data-sortkey') < $(b).attr('data-sortkey')) return -1;
                return 0;
            })
        );
    });
    $job_class_item_select.find('option').attr('selected', false);
    $($job_class_item_select.find('option')[0]).attr('selected', true)
}

function sortByCharacterName() {
    $('#mount_list .list').html(
        $('li.character_info').sort(function(a, b){
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
            //var $result = $area.find('.result').empty();
            var $result = $area.find('.result');
            var area_name = $area.find('.search_mean_name').attr('data-shortname');
            $result.children('.selectbox').remove();

            var freecompany_names = $content.find('.ldst__main').find('.entry__name');
            if (freecompany_names.length <= 0) {
                alert('フリーカンパニーが1件もみつかりませんでした。');
                return false;
            }

            var freecompany_ids = $content.find('.ldst__main').find('.entry__block');
            var freecompany_worlds = $content.find('.ldst__main').find('.entry__world');
            //$result.append('<div class="selectbox move_in"><select name="freecompanys"><option value="">フリーカンパニーを選択</option></select></div>');
            $result.prepend('<div class="selectbox move_in"><select name="freecompanys"><option value="">フリーカンパニーを選択</option></select></div>');
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
            //var $result = $area.find('.result').empty();
            var $result = $area.find('.result');
            var area_name = $area.find('.search_mean_name').attr('data-shortname');
            $result.children('.selectbox').remove();

            var linkshell_names = $content.find('.ldst__main').find('.entry__name');
            if (linkshell_names.length <= 0) {
                alert('リンクシェルが1件もみつかりませんでした。');
                return false;
            }

            var linkshell_ids = $content.find('.ldst__main').find('.entry__link--line');
            var linkshell_worlds = $content.find('.ldst__main').find('.entry__world');
            //$result.append('<div class="selectbox move_in"><select name="linkshells"><option value="">リンクシェルを選択</option></select></div>');
            $result.prepend('<div class="selectbox move_in"><select name="linkshells"><option value="">リンクシェルを選択</option></select></div>');
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

function searchCharacterList($area, name, world, option_text) {
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
            //var $result = $area.find('.result').empty();
            var $result = $area.find('.result');
            var area_name = $area.parents('.search_mean').find('.search_mean_name').attr('data-shortname');
            $result.children('.selectbox').remove();

            var character_names = $content.find('.ldst__main').find('.entry__name');
            if (character_names.length <= 0) {
                alert('キャラクターが1件もみつかりませんでした。');
                return false;
            }

            var character_ids = $content.find('.ldst__main').find('.entry__link');
            var character_worlds = $content.find('.ldst__main').find('.entry__world');
            //$result.append('<div class="selectbox move_in"><select name="characters"><option value="">キャラクターを選択</option></select></div>');
            $result.prepend('<div class="selectbox move_in"><select name="characters"><option value="">キャラクターを選択</option></select></div>');
            $.each(character_names, function(index, val){
                var id = $(character_ids[index]).attr('href').split('/')[3];
                var name = $(val).text();
                var world = $(character_worlds[index]).text();
                $result.find('select[name="characters"]').append('<option value="'+id+'">'+name+' ('+world+')'+option_text+'</option>');
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

function addCharaData(chara_id) {
	return $.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+chara_id,
		type: 'GET',
		dataType: 'json',
		loadingHide: function(res){}
	})
	.then(
		function(res){
			$content = $(res.data);

			var key_number = 0;
            $('.list').append('<li id="character_'+chara_id+'" class="character_info"><div class="character_profile"></div></li>');
            $('#character_'+chara_id+' .character_profile').append('<li id="break_'+chara_id+'" class="break list_item" data-sortkey="'+(key_number++)+'"></li>');
			$('#character_'+chara_id+' .character_profile').append('<li id="delete_'+chara_id+'" class="delete list_item" data-sortkey="'+(key_number++)+'"><a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a></li>');
			$('#character_'+chara_id+' .character_profile').append('<li id="chara_face_'+chara_id+'" class="chara_face list_item" data-sortkey="'+(key_number++)+'"></li><li id="chara_name_'+chara_id+'" class="chara_name list_item" data-sortkey="'+(key_number++)+'"></li>');
            $('#character_'+chara_id).append('<div class="icon_list"></div>');

			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			var user_world_text = $content.find('.frame__chara__world').text();

			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append('<em>'+user_name_text+'</em>');
			$('#chara_name_'+chara_id).append('<span class="character_world">'+user_world_text+'</span>');

			addListItems($content, chara_id, key_number);

			$content.find('script').remove();
			var chara_data = '<li id="ldst_main_'+chara_id+'" class="ldst_main" data-sortkey="">'+$content.find('.ldst__main').html()+'</li>';
			setDeleteButtonRightPosition();
			addCharacterData(chara_data);
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('キャラクターの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}

function addListItems($content, chara_id, key_number) {
	//var $items = $('#minion .items').find('input[readonly="readonly"]');
    var $items = $('#minion .items').find('.tag');
	var tooltips = new Array();
	var minions = new Array();
	$items.each(function(index){
		//if ($(this).val().indexOf('job:') === 0) {
        if ($(this).attr('data-text').indexOf('job:') === 0) {
			var job_name;
			//var job_names = $(this).val().split(':')[1].split(' / ');
            //var job_names = $(this).attr('data-text').split(':')[1].split(' / ');
            var job_names = $(this).text().split(' / ');
			var $job_name;
			for (var i = 0; i < job_names.length; i++) {
				var $job = $content.find('.character__job__name:contains("'+job_names[i]+'")');
				if ($job.length) {
					job_name = job_names[i];
					$job_name = $job;
				}
			}
			var $job_icon = $job_name.siblings('.character__job__icon');
			var $job_level = $job_name.siblings('.character__job__level');
            var text_meister = $job_name.hasClass('character__job__name--meister') ? '<br>(マイスター)' : '';
            var class_meister = $job_name.hasClass('character__job__name--meister') ? 'meister' : '';
			tooltips.push(job_name+text_meister);
			minions.push($job_icon);
			tooltips.push(class_meister);
			minions.push($job_level);
		} else {
			//tooltips.push($(this).val());
            tooltips.push($(this).text());
			minions.push($content.find('.character__item_icon[data-tooltip="'+$(this).text()+'"]'));
		}
	});

    for (var i = 0; i < minions.length; i++) {
        var $minion = $(minions[i]).clone();
        var item_type = 'mount_image icon';
        if ($minion.attr('class') === 'character__job__icon') {
            item_type = 'job_icon icon';
        }
        if ($minion.attr('class') === 'character__job__level') {
            item_type = 'job_level';
        }
        if (item_type === 'job_icon icon') {
            $('#character_'+chara_id+' .icon_list').append('<div class="job_info"><li id="mount'+i+'_'+chara_id+'" class="'+item_type+' list_item" data-sortkey="'+(key_number++)+'"></li></div>');
        } else if (item_type === 'job_level') {
            var class_meister = '';
            if (tooltips[i] === 'meister') {
                class_meister = ' meister';
                tooltips[i] = '';
            }
            $('#character_'+chara_id+' .icon_list .job_info:last-child').append('<li id="mount'+i+'_'+chara_id+'" class="'+item_type+class_meister+' list_item" data-sortkey="'+(key_number++)+'"></li>');
        } else {
            $('#character_'+chara_id+' .icon_list').append('<li id="mount'+i+'_'+chara_id+'" class="'+item_type+' list_item" data-sortkey="'+(key_number++)+'"></li>');
        }
        if (tooltips[i] !== '') {
            $('#mount'+i+'_'+chara_id).append('<span class="tooltip"><span class="text">'+tooltips[i]+'</span></span>');
        }
        $minion.appendTo('#mount'+i+'_'+chara_id);
    }
}
