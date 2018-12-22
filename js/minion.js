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

			var target_name = $('#minion').find('input[readonly="readonly"]');
            var tooltips = new Array();

            var minions = new Array();
            $(target_name).each(function(index){
                tooltips.push($(this).val());
                minions.push($content.find('.character__item_icon[data-tooltip="'+$(this).val()+'"]'));
            });

			var key_number = 0;
			$('.list').append('<li id="break_'+chara_id+'" class="break list_item" data-sortkey="'+(key_number++)+'"></li>');
			$('.list').append('<li id="delete_'+chara_id+'" class="delete list_item" data-sortkey="'+(key_number++)+'"><a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a></li>');
			$('.list').append('<li id="chara_face_'+chara_id+'" class="chara_face list_item" data-sortkey="'+(key_number++)+'"></li><li id="chara_name_'+chara_id+'" class="chara_name list_item" data-sortkey="'+(key_number++)+'"></li>');
			for (i = 0; i < minions.length; i++) {
				$('.list').append('<li id="mount'+i+'_'+chara_id+'" class="mount_image list_item" data-sortkey="'+(key_number++)+'"><span class="tooltip"><span class="text">'+tooltips[i]+'</span></span></li>');
			}

			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			var user_world_text = $content.find('.frame__chara__world').text();

			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append('<em>'+user_name_text+'</em>');
			$('#chara_name_'+chara_id).append('<span class="character_world">'+user_world_text+'</span>');

			for (i = 0; i < minions.length; i++) {
				var $minion = $(minions[i]).clone();
				$minion.appendTo('#mount'+i+'_'+chara_id);
			}

			$content.find('script').remove();
			var chara_data = '<li id="ldst_main_'+chara_id+'" class="ldst_main" data-sortkey="">'+$content.find('.ldst__main').html()+'</li>';
			setDeleteButtonRightPosition()
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
