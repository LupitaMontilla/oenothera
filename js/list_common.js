$(function() {
    addWorldNameList();

    $('#freecompany').show();
    $('#linkshell').hide();
    $('#character').hide();

    $('input[name="means"]:radio').on('change', function(){
        console.log($(this).val());
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

    $('#freecompany .search').on('click', '.search_btn', function(){
        var my_charactername = $('#my_character_name').val();
        var my_worldname = $('select[name="worldname"]').val();
        getCharacterData(my_charactername, my_worldname);
    });

    $('#freecompany .result').on('click', '.search_btn', function(){
        var character_id = $('select[name="characters"]').val();
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

	$('#linkshell').on('click', '.search_btn', function(){
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
				dataType: 'json'
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

	$('#character').on('click', '.search_btn', function(){
		chara_id = $(this).prev().val();
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

function getCharacterData(name, world) {
    var name_string = name.replace(' ', '+');
    var encoded_url = encodeURIComponent(LODESTONE_URL+'/character/?q='+name_string+'&worldname='+world+'&blog_lang=ja');
	$.ajax({
		url: '/php/ldst_access.php?url='+encoded_url,
		type: 'GET',
		dataType: 'json'
	})
	.then(
		function(res){
            $('#freecompany .result').empty();

			$content = $(res.data);

            var character_names = $content.find('.ldst__main').find('.entry__name');
            var character_id = $content.find('.ldst__main').find('.entry__link');
            var character_world = $content.find('.ldst__main').find('.entry__world');;
            $('#freecompany .result').append('<div class="selectbox"><select name="characters"></select></div>');
            $.each(character_names, function(index, val){
                var id = $(character_id[index]).attr('href').split('/')[3];
                var name = $(val).text();
                var world = $(character_world[index]).text();
                $('#freecompany .result').find('select[name="characters"]').append('<option value="'+id+'">'+name+' ('+world+')</option>');
            });
            $('#freecompany .result').append('<a href="javascript:void(0);" class="search_btn button">FCのIDを取得</a>');
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
		dataType: 'json'
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
            var freecompany_id = $(freecompany_name).attr('href').split('/')[3];
            //$('#freecompany .acordion_tree').append('<input id="freecompany_id" type="text" value="'+freecompany_id+'"><a href="javascript:void(0);" class="search_btn button">FCのIDで一覧を表示</a>');
            $('#freecompany_id').val(freecompany_id);
        }
	);
}
