function addCharaData(chara_id) {
	$.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+chara_id,
		type: 'GET',
		dataType: 'json'
	})
	.then(
		function(res){
			$content = $(res.data);

            var target_name = $('#minion').children('div').find('input[type="text"]');
            var tooltips = new Array();

            var minions = new Array();
            $(target_name).each(function(index){
                tooltips.push($(this).val());
                minions.push($content.find('.character__item_icon[data-tooltip="'+$(this).val()+'"]'));
            });

			$('.list').append('<br id="break_'+chara_id+'">');
			$('.list').append('<a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a>');
			$('.list').append('<li id="chara_face_'+chara_id+'" class="chara_face"></li><li id="chara_name_'+chara_id+'" class="chara_name"></li>');
			for (i = 0; i < minions.length; i++) {
				$('.list').append('<li id="mount'+i+'_'+chara_id+'" class="mount_image"><span class="tooltip"><span class="text">'+tooltips[i]+'</span></span></li>');
			}

			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			var user_world_text = $content.find('.frame__chara__world').text();

			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append(user_name_text);
			$('#chara_name_'+chara_id).append('<span class="character_world">'+user_world_text+'</span>');

			for (i = 0; i < minions.length; i++) {
				$('#mount'+i+'_'+chara_id).append(minions[i]);
			}
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('キャラクターの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}
