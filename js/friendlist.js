$(function() {
    addWorldNameList();
    $('.loading').addClass('is-hide');

    if (!window.matchMedia('(max-width: 640px)').matches) {
        $('#freecompany').parents('li').show();
        $('#linkshell').parents('li').hide();
        $('#character').parents('li').hide();
    }

    var friendlist = JSON.parse(localStorage.getItem('friendlist'));
    for (var my_chara_id in friendlist) {
        if (isNaN(my_chara_id)) {
            break;
        }
        var my_character = friendlist[my_chara_id];
        var characters = my_character['characters'];

        var my_name = my_character['name'];
        var my_face = my_character['face'];
        var my_fc_name = my_character['fc_name'];
        var my_world = my_character['world'];
        var characters_length = Object.keys(characters).length;

        $('#my_character_list').children('.list').append('<li id="my_character_'+my_chara_id+'" class="character_info"><div class="character_profile"></div></li>');
        $('#my_character_'+my_chara_id).append('<input type="checkbox" checked="checked" id="list_visibility_'+my_chara_id+'" class="list_visibility"><label for="list_visibility_'+my_chara_id+'" class="list_visibility_label"></label>');
        $('#my_character_'+my_chara_id).append('<div id="my_friends_count_'+my_chara_id+'" class="my_friends_count">'+characters_length+'</div>');
        $('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_chara_face_'+my_chara_id+'" class="chara_face list_item"><img src="'+my_face+'" width="50" height="50"></div>');
        $('#my_character_'+my_chara_id+' .character_profile').append('<div class="chara_name_wrap"></div>');
        //$('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_chara_name_'+my_chara_id+'" class="chara_name list_item"><em>'+my_name+'</em><span class="character_world">'+my_world+'</span></div>');
        $('#my_character_'+my_chara_id+' .character_profile .chara_name_wrap').append('<div id="my_chara_name_'+my_chara_id+'" class="chara_name list_item"><span class="online_icon"></span><em>'+my_name+'</em></div>');
        $('#my_character_'+my_chara_id+' .character_profile .chara_name_wrap').append('<div class="chara_info_wrap"></div>');
        $('#my_character_'+my_chara_id+' .character_profile .chara_name_wrap .chara_info_wrap').append('<div id="my_chara_world_'+my_chara_id+'" class="character_world list_item">'+my_world+'</div>');
        //$('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_fc_name_'+my_chara_id+'" class="fc_name list_item">'+my_fc_name+'</div>');
        $('#my_character_'+my_chara_id+' .character_profile .chara_name_wrap .chara_info_wrap').append('<div id="my_fc_name_'+my_chara_id+'" class="fc_name list_item">'+my_fc_name+'</div>');
        $('#my_character_'+my_chara_id).append('<div id="character_list_'+my_chara_id+'" class="character_list"><ul class="list"></ul></div>');

        for (var chara_id in characters) {
            var friend = characters[chara_id];
            var name = friend['name'];
            var world = friend['world'];
            var face = friend['face'];
            var fc_name = friend['fc_name'];
            //var nickname = friend['nickname'];
            //nickname = nickname != null ? nickname : '';

            $('#character_list_'+my_chara_id+' .list').append('<li id="character_'+chara_id+'" class="character_info"><div class="character_profile"></div></li>');
            $('#character_'+chara_id+' .character_profile').append('<div id="chara_face_'+chara_id+'" class="chara_face list_item"><img src="'+face+'" width="50" height="50"></div>');
            $('#character_'+chara_id+' .character_profile').append('<div class="chara_name_wrap"></div>');
            $('#character_'+chara_id+' .character_profile .chara_name_wrap').append('<div id="chara_name_'+chara_id+'" class="chara_name list_item"><em>'+name+'</em></div>');
            $('#character_'+chara_id+' .character_profile .chara_name_wrap').append('<div class="chara_info_wrap"></div>');
            $('#character_'+chara_id+' .character_profile .chara_name_wrap .chara_info_wrap').append('<div id="chara_world_'+chara_id+'" class="character_world list_item">'+world+'</div>');
            $('#character_'+chara_id+' .character_profile .chara_name_wrap .chara_info_wrap').append('<div id="fc_name_'+my_chara_id+'" class="fc_name list_item">'+fc_name+'</div>');
            $('#character_'+chara_id).append('<div id="items_'+chara_id+'" class="character_items"></div>');
        }
    }
    //sortByCharacterName();
    var items = friendlist['items'];
    for (var i = 0; i < items.length; i++) {
        var item_name = items[i];
        $('#list__items').append('<li><input type="text" value="'+item_name+'"></li>');
        $('.character_items').append('<div class="character_item item_'+i+'"><label class="label__character_item">'+item_name+':<input type="text" class="input__character_item"></label></div>');
    }

    $('#button__add_my_character').on('click', function(){
        $('#my_character').parents('.modal_wrap').removeClass('hide');
    });

    $('#my_character_back').on('click', function(){
        $(this).parents('.modal_wrap').addClass('hide');
    });

    $('#my_character .search').on('click', '.search_btn', function(){
        var charactername = $('#my_character_name').val();
        var worldname = $('#my_character_worldname').val();
        var $result_area = $('#my_character').find('.search_character').children('.result');
        searchCharacterList($result_area, charactername.trim(), worldname, '');
    });

    $('#my_character .result').on('change', 'select[name="characters"]', function(){
        var character_id = $(this).val();
        //$(this).parents('.search_mean').find('.input_id').val(character_id);
        $('#my_character_id').val(character_id);
        if (character_id === '') {
            $('#my_character .view .chara_search').addClass('disable');
        } else {
            $('#my_character .view .chara_search').removeClass('disable');
        }
    });

    $('#search_friend_list').on('click', function(){
        var my_character_id = $('#my_character_id').val();
        var $result_area = $('#character').find('.search_character').children('.result');
        var $ajax = searchFriendList($result_area, my_character_id);
        $ajax.always(function(){
            var friendlist = JSON.parse(localStorage.getItem('friendlist'));

            var friends = {};
            var my_character = {};
            var characters = {};
            if (friendlist != null) {
                friends = friendlist;
                my_character_info = friends[my_character_id];
                if (my_character_info != null && Object.keys(my_character_info).length > 0) {
                    my_character = my_character_info;
                }
                if (my_character['characters'] != null) {
                    characters_info = my_character['characters'];
                    if (Object.keys(characters_info).length > 0) {
                        characters = characters_info;
                    }
                }
            }

            if (Object.keys(my_character).length <= 0) {
                my_character['name'] = $('#searched__my_name_'+my_character_id).text();
                my_character['world'] = $('#searched__my_world_'+my_character_id).text();
                my_character['face'] = $('#searched__my_face_'+my_character_id).text();
                my_character['fc_name'] = $('#searched__my_fc_name_'+my_character_id).text();
            }

            var character_list = $('#character_list_'+my_character_id+' .list').children('li');
            $(character_list).each(function(index, element){
                var character = {};
                var chara_id = $(element).attr('id').split('_')[1];
                character['name'] = $('#chara_name_'+chara_id).children('em').text();
                character['world'] = $('#chara_name_'+chara_id).children('.character_world').text();
                character['face'] = $('#chara_face_'+chara_id).children('img').attr('src');
                character['fc_name'] = $('#fc_name_'+chara_id).text();
                //character['nickname'] = $('#nickname_'+chara_id).children('input[type="text"]').val();
                characters[chara_id] = character;
            });

            my_character['characters'] = characters;
            friends[my_character_id] = my_character;

            localStorage.setItem('friendlist', JSON.stringify(friends));
        });
    });

    $('#button__add_items').on('click', function(){
        $('#items').parents('.modal_wrap').removeClass('hide');
    });

    $('#items_back').on('click', function(){
        $(this).parents('.modal_wrap').addClass('hide');
    });

    $('#button__add_item').on('click', function(){
        var item_name = $('#input__item_name').val();
        if (item_name == null || item_name == '') {
            alert('項目名を入力してください。');
            return false;
        }
        $('#input__item_name').val('');
        $('#list__items').append('<li><input type="text" value="'+item_name+'"></li>');

        var friendlist = JSON.parse(localStorage.getItem('friendlist'));
        var friends = {};
        var items = [];

        if (friendlist != null) {
            friends = friendlist;
            var items_info = friends['items'];
            if (items_info != null) {
                items = items_info;
            }
        }

        items.push(item_name);
        friends['items'] = items;

        localStorage.setItem('friendlist', JSON.stringify(friends));
    });

    $('.save').on('click', function(){
        var my_chara_id = '';
        var chara_id = $(this).children('button').attr('data-id');
        save_friend(my_chara_id, chara_id);
    });

    $('#character .search').on('click', '.search_btn', function(){
        var charactername = $('#character_name').val();
        var worldname = $('#character_worldname').val();
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
            //sortByCharacterName();
            //getCharacterData();
            var my_chara_id = '';
            save_friend(my_chara_id, chara_id);
        });
	});

	$('#character_list').on('click', '.list .delete_btn', function(){
		if (!$('#delete_confirm').prop('checked') || confirm('選択したキャラクターを一覧から削除しますか？')) {
			chara_id = $(this).attr('data-id');
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

function save_friend(my_chara_id, chara_id) {
    var friendlist = JSON.parse(localStorage.getItem('friendlist'));
    var friends = {};
    var characters = {};
    var character = {};

    if (friendlist != null) {
        friends = friendlist;
        characters = friends[my_chara_id];
    }

    character.name = $('#chara_name_'+chara_id).children('em').text();
    character.world = $('#chara_name_'+chara_id).children('.character_world').text();
    character.face = $('#chara_face_'+chara_id).children('img').attr('src');
    character.nickname = $('#nickname_'+chara_id).children('input[type="text"]').val();

    characters[chara_id] = character;
    friends[my_chara_id] = characters;

    localStorage.setItem('friendlist', JSON.stringify(friends));
}
