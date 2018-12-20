function addCharaData(chara_id) {
	return $.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+chara_id,
		type: 'GET',
		dataType: 'json',
		loadingHide: function(data){
			sortByCharacterName();
		}
	})
	.then(
		function(res){
			$content = $(res.data);

			var mounts = new Array();
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/03/03a9b9d5084a9353772b50e68af4c05ed3aa1687.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/ff/ffd24aab7d32f782d0708261d17800e6c976acb3.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/37/37a677e48eac36221ac7f8371f191afb1bea35a9.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/b8/b8543d08e74b5675612166f77e8105fcc593f699.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/23/23f4f069e9e78636065b946ab77f6defb5e75600.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/ab/abf2781ef3b771006dc5278b8d79ce4f302184dc.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/6c/6cc1a05792e76a255f1af9ddf2b4d010fd437f01.png?4.45"]'));

			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/e7/e71eab42ebeaeb9e57f684fc7b88ab25f3f52c65.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/09/09021b148c97ea3839b4672f8e86e23f40e74453.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/17/179963a6ed3e2ff75795a7654c9634c78096e9f6.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/b3/b3dc797fde3f4fb9dd7ad8fcbb30608b808e11a5.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/09/09958624f9c4703f069bf6400993c7766141bfb6.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/5b/5b22520b9e8d2b4a49b9e82f42f9bf6ea9f831ce.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/7a/7acb1f99237d79e5d3cf0cf6a9b7f59bc52757e5.png?4.45"]'));

			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/3d/3d4e245528fa07e4f5785f703fc8d647e03fa3ef.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/70/7094a55fba5330dc81cbfa16a68ade6efbcedaf6.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/3c/3c081acc6aca07e4a1f6792747a32e2b8288d021.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/d2/d2b048a57d25a4362b773449021ce381ebb329bf.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/b8/b8162fc27d4aa1a539afd5358e14d671be138971.png?4.45"]'));
			mounts.push($content.find('img[src="'+LODESTONE_ITEMICON_URL+'/ef/ef7fc4300a14c306e3aef0ee9a8bf434df54410c.png?4.45"]'));

			var mount_names = new Array();
			for (var i = 0; i < mounts.length; i++) {
				mount_names.push($(mounts[i]).parent('.character__item_icon.js__tooltip').attr('data-tooltip'));
			}

			var key_number = 0;
			$('.list').append('<li id="break_'+chara_id+'" class="break list_item" data-sortkey="'+(key_number++)+'"></li>');
			$('.list').append('<li id="delete_'+chara_id+'" class="delete list_item" data-sortkey="'+(key_number++)+'"><a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a></li>');
			$('.list').append('<li id="chara_face_'+chara_id+'" class="chara_face list_item" data-sortkey="'+(key_number++)+'"></li><li id="chara_name_'+chara_id+'" class="chara_name list_item" data-sortkey="'+(key_number++)+'"></li>');
			for (i = 0; i < mounts.length; i++) {
				$('.list').append('<li id="mount'+i+'_'+chara_id+'" class="mount_image list_item" data-sortkey="'+(key_number++)+'"><span class="tooltip"><span class="text">'+mount_names[i]+'</span></span></li>');
			}

			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			var user_world_text = $content.find('.frame__chara__world').text();

			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append('<em>'+user_name_text+'</em>');
			$('#chara_name_'+chara_id).append('<span class="character_world">'+user_world_text+'</span>');

			for (i = 0; i < mounts.length; i++) {
				$('#mount'+i+'_'+chara_id).append(mounts[i]);
			}

			$content.find('script').remove();
			var cahara_data = '<li id="ldst_main_'+chara_id+'" class="ldst_main" data-sortkey="">'+$content.find('.ldst__main').html()+'</li>';
			setDeleteButtonRightPosition()
			addCharacterData(cahara_data);
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('キャラクターの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}
