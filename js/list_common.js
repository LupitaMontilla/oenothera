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
        $(this).on('mouseup touchend', mup);
    }

    var mmv = function(e) {
        var drag = $('.drag')[0];
        if (drag == null) {
            return false;
        };

        e.preventDefault();

        var scrollTop = $(window).scrollTop();
        var scrollLeft = $(window).scrollLeft();

        drag.style.top = event.pageY - scrollTop - y + 'px';
        drag.style.left = event.pageX - scrollLeft - x + 'px';

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
        var $result_area = $area.find('.result');
        var option_text = ' の FC';
        searchCharacterList($result_area, charactername.trim(), worldname, option_text);
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
        //var charactername = $('#character .character_name').val();
        var charactername = $('#character_name').val();
        //var worldname = $('#character select[name="worldname"]').val();
        var worldname = $('#character_worldname').val();
        //var $area = $(this).parents('.search_mean').find('.search_character');
        //var $result_area = $area.find('.result');
        var $result_area = $('#character').find('.search_character').children('.result');
        searchCharacterList($result_area, charactername.trim(), worldname, '');
    });

    $('#character .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        //$(this).parents('.search_mean').find('.input_id').val(character_id);
        $('#character_id').val(character_id);
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
