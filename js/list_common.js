$(function() {
    addWorldNameList();
    $('.loading').addClass('is-hide');

    $('#freecompany').show();
    $('#linkshell').hide();
    $('#character').hide();

    $('input[name="means"]:radio').on('change', function(){
        switch ($(this).val()) {
            case 'fc':
                $('#freecompany').show();
                $('#linkshell').hide();
                $('#character').hide();
                break;
            case 'ls':
                $('#freecompany').hide();
                $('#linkshell').show();
                $('#character').hide();
                break;
            case 'cr':
                $('#freecompany').hide();
                $('#linkshell').hide();
                $('#character').show();
                break;
        }
    });

    $('#freecompany .search').on('click', '.freecompany_search.search_btn', function(){
        var freecompanyname = $('#freecompany .search_freecompany .freecompany_name').val();
        var worldname = $('#freecompany select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_freecompany');
        searchFreecompanyList($area, freecompanyname, worldname);
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
        searchCharacterList($area, charactername, worldname);
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
		if ($('#freecompany_name').attr('data-id') == freecompany_id) {
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
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('現在の一覧を消去してからフリーカンパニーを読み込みますがよろしいですか？')) {
							return false;
						}
					}
					resetList();

					$content = $(res.data);
					var freecompany_name = $content.find('.entry__freecompany__name').text();
					$('#freecompany_name').text(freecompany_name);
					$('#freecompany_name').attr('data-id', freecompany_id);

					$content.find('.entry__bg').each(function(index){
						href = $(this).attr('href');
						chara_id = href.split('/')[3];
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
			for (var i = 0; i < chara_id_list.length; i++) {
				addCharaData(chara_id_list[i]);
			}
		});
	});

    $('#linkshell .search').on('click', '.search_btn', function(){
        var linkshellname = $('#linkshell .search_name').val();
        var worldname = $('#linkshell select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean');
        searchLinkshellList($area, linkshellname, worldname);
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
		if ($('#linkshell_name').attr('data-id') == linkshell_id) {
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
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('現在の一覧を消去してからリンクシェルを読み込みますがよろしいですか？')) {
							return false;
						}
					}
					resetList();

					$content = $(res.data);
					var linkshell_name = $content.find('.heading__linkshell__name').text();
					$('#linkshell_name').text(linkshell_name);
					$('#linkshell_name').attr('data-id', linkshell_id);
					$('#linkshell .icon').append($content.find('.heading__linkshell__icon').html());

					$content.find('.entry__link').each(function(index){
						href = $(this).attr('href');
						chara_id = href.split('/')[3];
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
			for (var i = 0; i < chara_id_list.length; i++) {
				addCharaData(chara_id_list[i]);
			}
		});
	});

    $('#character .search').on('click', '.search_btn', function(){
        var charactername = $('#character .character_name').val();
        var worldname = $('#character select[name="worldname"]').val();
        var $area = $(this).parents('.search_mean').find('.search_character');
        searchCharacterList($area, charactername, worldname);
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
		addCharaData(chara_id);
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

function resetList() {
	$('.list').empty();
	$('#freecompany_name').empty();
    $('#freecompany_name').attr('data-id', '');
	$('#linkshell_name').empty();
	$('#linkshell .icon').empty();
    $('#linkshell_name').attr('data-id', '');
}

function addWorldNameList() {
    var worldnames = {
        'データセンター': {
            'Elemental': '_dc_Elemental',
            'Gaia': '_dc_Gaia',
            'Mana': '_dc_Mana',
            'Aether': '_dc_Aether',
            'Primal': '_dc_Primal',
            'Chaos': '_dc_Chaos'
        },
        'ワールド': {
            'Adamantoise': 'Adamantoise',
            'Aegis': 'Aegis',
            'Alexander': 'Alexander',
            'Anima': 'Anima',
            'Asura': 'Asura',
            'Atomos': 'Atomos',
            'Bahamut': 'Bahamut',
            'Balmung': 'Balmung',
            'Behemoth': 'Behemoth',
            'Belias': 'Belias',
            'Brynhildr': 'Brynhildr',
            'Cactuar': 'Cactuar',
            'Carbuncle': 'Carbuncle',
            'Cerberus': 'Cerberus',
            'Chocobo': 'Chocobo',
            'Coeurl': 'Coeurl',
            'Diabolos': 'Diabolos',
            'Durandal': 'Durandal',
            'Excalibur': 'Excalibur',
            'Exodus': 'Exodus',
            'Faerie': 'Faerie',
            'Famfrit': 'Famfrit',
            'Fenrir': 'Fenrir',
            'Garuda': 'Garuda',
            'Gilgamesh': 'Gilgamesh',
            'Goblin': 'Goblin',
            'Gungnir': 'Gungnir',
            'Hades': 'Hades',
            'Hyperion': 'Hyperion',
            'Ifrit': 'Ifrit',
            'Ixion': 'Ixion',
            'Jenova': 'Jenova',
            'Kujata': 'Kujata',
            'Lamia': 'Lamia',
            'Leviathan': 'Leviathan',
            'Lich': 'Lich',
            'Louisoix': 'Louisoix',
            'Malboro': 'Malboro',
            'Mandragora': 'Mandragora',
            'Masamune': 'Masamune',
            'Mateus': 'Mateus',
            'Midgardsormr': 'Midgardsormr',
            'Moogle': 'Moogle',
            'Odin': 'Odin',
            'Omega': 'Omega',
            'Pandaemonium': 'Pandaemonium',
            'Phoenix': 'Phoenix',
            'Ragnarok': 'Ragnarok',
            'Ramuh': 'Ramuh',
            'Ridill': 'Ridill',
            'Sargatanas': 'Sargatanas',
            'Shinryu': 'Shinryu',
            'Shiva': 'Shiva',
            'Siren': 'Siren',
            'Tiamat': 'Tiamat',
            'Titan': 'Titan',
            'Tonberry': 'Tonberry',
            'Typhon': 'Typhon',
            'Ultima': 'Ultima',
            'Ultros': 'Ultros',
            'Unicorn': 'Unicorn',
            'Valefor': 'Valefor',
            'Yojimbo': 'Yojimbo',
            'Zalera': 'Zalera',
            'Zeromus': 'Zeromus'
        }
    };

    var $select_worldname = $('select[name="worldname"]');
    $.each(worldnames, function(label, option_list){
        $select_worldname.append('<optgroup label="'+label+'">');
        $.each(option_list, function(key, val){
            $select_worldname.append('<option value="'+val+'">'+key+'</option>');
        });
        $select_worldname.append('</optgroup>');
    });
    $('select[name="worldname"]').append(worldnames);
}

$(document).on('ajaxSend', function(e, jqXHR, obj){
    console.log(new Date());
    var $loading = $('.loading');
    $loading.removeClass('is-hide');
    setTimeout(function(){
        $.when(jqXHR).done(function(data){
            $loading.addClass('is-hide');
            obj.loadingHide(data);
        });
    }, 400);
});

function searchFreecompanyList($area, name, world) {
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/freecompany/?q='+name+'&worldname='+world);
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
            $result.append('<div class="selectbox"><select name="freecompanys"><option value="">フリーカンパニーを選択</option></select></div>');
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
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/linkshell/?q='+name+'&worldname='+world);
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
            $result.append('<div class="selectbox"><select name="linkshells"><option value="">リンクシェルを選択</option></select></div>');
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
            $result.append('<div class="selectbox"><select name="characters"><option value="">キャラクターを選択</option></select></div>');
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
