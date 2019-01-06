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

function searchFriendList($result, id) {
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/character/'+id+'/friend/');
	return $.ajax({
		url: '/php/ldst_access.php?url='+encoded_url,
		type: 'GET',
		dataType: 'json',
        loadingHide: function(data){}
	})
	.then(
		function(res){
			var $content = $(res.data);
            $result.children('.selectbox').remove();

            addMyCharacter(id);

            var friends = $content.find('.ldst__main').find('.entry');
            if (friends.length <= 0) {
                alert('フレンドが1人もいません。');
                return false;
            }

            $.each(friends, function(index, val){
                var $friend = $(friends[index]);
                var chara_id = $friend.find('.entry__link').attr('href').split('/')[3];
                var name = $friend.find('.entry__name').text();
                var world = $friend.find('.entry__world').text();
                var face = $friend.find('.entry__chara__face').children('img').attr('src');
                var fc_name = $friend.find('.entry__freecompany__link span').text();
                var nickname = '';

                $('#character_list_'+id+' .list').append('<li id="character_'+chara_id+'" class="character_info"><div class="character_profile"></div></li>');
                //$('#character_'+chara_id+' .character_profile').append('<li id="break_'+chara_id+'" class="break list_item"></li>');
                //$('#character_'+chara_id+' .character_profile').append('<li id="delete_'+chara_id+'" class="delete list_item"><a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a></li>');
                $('#character_'+chara_id+' .character_profile').append('<li id="chara_face_'+chara_id+'" class="chara_face list_item"><img src="'+face+'" width="40" height="40"></li>');
                $('#character_'+chara_id+' .character_profile').append('<li id="chara_name_'+chara_id+'" class="chara_name list_item"><em>'+name+'</em><span class="character_world">'+world+'</span></li>');
                $('#character_'+chara_id+' .character_profile').append('<li id="fc_name_'+chara_id+'" class="fc_name list_item">'+fc_name+'</li>');
                //$('#character_'+chara_id).append('<div id="nickname_'+chara_id+'"><label>nickname:<input type="text" value="'+nickname+'"></label></div>');
                //$('#character_'+chara_id).append('<div id="save_'+chara_id+'" class="save"><button type="button" class="button" data-id="'+chara_id+'">保存</button></div>');
            });
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('フレンドリストが非公開のため情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);

            addMyCharacter(id);
		}
    );
}

function addMyCharacter(id) {
    var $my_character = $('searched__my_character_'+id);
    var my_chara_id = id;
    var my_name = $('#searched__my_name_'+id).text();
    var my_face = $('#searched__my_face_'+id).text();
    var my_fc_name = $('#searched__my_fc_name_'+id).text();
    var my_world = $('#searched__my_world_'+id).text();

    $('#my_character_list').children('.list').append('<li id="my_character_'+my_chara_id+'" class="character_info"><div class="character_profile"></div></li>');
    $('#my_character_'+my_chara_id+' .character_profile').append('<div id="break_'+my_chara_id+'" class="break list_item"></div>');
    $('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_chara_face_'+my_chara_id+'" class="chara_face list_item"><img src="'+my_face+'" width="40" height="40"></div>');
    $('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_chara_name_'+my_chara_id+'" class="chara_name list_item"><em>'+my_name+'</em><span class="character_world">'+my_world+'</span></div>');
    $('#my_character_'+my_chara_id+' .character_profile').append('<div id="my_fc_name_'+my_chara_id+'" class="fc_name list_item">'+my_fc_name+'</div>');
    $('#my_character_'+my_chara_id).append('<div id="character_list_'+my_chara_id+'" class="character_list"><ul class="list"></ul></div>');
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
            var $result = $area.find('.result');
            $result.children('.selectbox').remove();

            var freecompany_names = $content.find('.ldst__main').find('.entry__name');
            if (freecompany_names.length <= 0) {
                alert('フリーカンパニーが1件もみつかりませんでした。');
                return false;
            }

            var freecompany_ids = $content.find('.ldst__main').find('.entry__block');
            var freecompany_worlds = $content.find('.ldst__main').find('.entry__world');
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
            var $result = $area.find('.result');
            $result.children('.selectbox').remove();

            var linkshell_names = $content.find('.ldst__main').find('.entry__name');
            if (linkshell_names.length <= 0) {
                alert('リンクシェルが1件もみつかりませんでした。');
                return false;
            }

            var linkshell_ids = $content.find('.ldst__main').find('.entry__link--line');
            var linkshell_worlds = $content.find('.ldst__main').find('.entry__world');
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

function searchCharacterList($result, name, world, option_text) {
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
            $result.children('.selectbox').remove();

            var characters = $content.find('.ldst__main .entry');
            if (characters.length <= 0) {
                alert('キャラクターが1件もみつかりませんでした。');
                return false;
            }

            $result.prepend('<div class="selectbox move_in"><select name="characters"><option value="">キャラクターを選択</option></select></div>');
            $.each(characters, function(index, val){
                var $character = $(val);
                var id = $character.find('.entry__link').attr('href').split('/')[3];
                var name = $(val).text();
                var name = $character.find('.entry__name').text();
                var world = $character.find('.entry__world').text();
                var fc_name = $character.find('.entry__freecompany__link span').text();
                var face = $character.find('.entry__chara__face img').attr('src');
                $result.find('select[name="characters"]').append('<option value="'+id+'">'+name+' ('+world+')'+option_text+'</option>');

                $('#searched__my_character_list').append('<li id="searched__my_character_'+id+'"></li>');
                $('#searched__my_character_'+id).append('<div id="searched__my_name_'+id+'">'+name+'</div>');
                $('#searched__my_character_'+id).append('<div id="searched__my_world_'+id+'">'+world+'</div>');
                $('#searched__my_character_'+id).append('<div id="searched__my_face_'+id+'">'+face+'</div>');
                $('#searched__my_character_'+id).append('<div id="searched__my_fc_name_'+id+'">'+fc_name+'</div>');
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
    var $items = $('#minion .items').find('.tag');
	var tooltips = new Array();
	var minions = new Array();
	$items.each(function(index){
        if ($(this).attr('data-text').indexOf('job:') === 0) {
			var job_name;
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
