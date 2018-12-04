const LODESTONE_URL = 'https://jp.finalfantasyxiv.com/lodestone';
const LODESTONE_ITEMICON_URL = 'https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon';

$(function() {
	$('#freecompany').on('click', '.search_btn', function(){
		var freecompany_id = $('#freecompany_id').val();
		if (!freecompany_id) {
			alert('�t���[�J���p�j�[��ID�A�܂���URL����͂��Ă��������B');
			return false;
		}
		if (isNaN(freecompany_id)) {
			var index = freecompany_id.indexOf('/lodestone/freecompany/');
			var freecompany_path = freecompany_id.slice(index);
			freecompany_id = freecompany_path.split('/')[3];
		}
		if ($('#freecompany_name').attr('data-id') == freecompany_id) {
			alert('���ݕ\�����Ă���t���[�J���p�j�[�ł��B');
			return false;
		}
		var chara_id_list = [];
		$.when(
			$.ajax({
				url: '/php/ldst_access.php?url='+LODESTONE_URL+'/freecompany/'+freecompany_id+'/member/',
				type: 'GET',
				dataType: 'json',
				async: true
			})
			.then(
				function(res){
					if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('���݂̈ꗗ���������Ă���t���[�J���p�j�[��ǂݍ��݂܂�����낵���ł����H')) {
						return false;
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
					alert('�t���[�J���p�j�[�̏�񂪎擾�ł��܂���ł����B');
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
			alert('�����N�V�F����ID�A�܂���URL����͂��Ă��������B');
			return false;
		}
		if (isNaN(linkshell_id)) {
			var index = linkshell_id.indexOf('/lodestone/linkshell/');
			var linkshell_path = linkshell_id.slice(index);
			linkshell_id = linkshell_path.split('/')[3];
		}
		if ($('#linkshell_name').attr('data-id') == linkshell_id) {
			alert('���ݕ\�����Ă��郊���N�V�F���ł��B');
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
					if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('���݂̈ꗗ���������Ă��烊���N�V�F����ǂݍ��݂܂�����낵���ł����H')) {
						return false;
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
					alert('�����N�V�F���̏�񂪎擾�ł��܂���ł����B');
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
			alert('�L�����N�^�[��ID�A�܂���URL����͂��Ă��������B');
			return false;
		}
		if (isNaN(chara_id)) {
			var index = chara_id.indexOf('/lodestone/character/');
			var chara_path = chara_id.slice(index);
			chara_id = chara_path.split('/')[3];
		}
        if (document.getElementById('chara_name_'+chara_id) != null) {
            alert('���łɈꗗ�ɕ\�����Ă���L�����N�^�[�ł��B');
            return false;
        }
		addCharaData(chara_id);
	});
	
	$('#reset').on('click', '.reset_btn', function(){
		resetList();
	});
	
	$('#mount_list').on('click', '.list .delete_btn', function(){
		if (!$('#delete_confirm').prop('checked') || confirm('�I�������L�����N�^�[���ꗗ����폜���܂����H')) {
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
	$('#linkshell_name').empty();
	$('#linkshell .icon').empty();
}

function addCharaData(chara_id) {
	$.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+chara_id,
		type: 'GET',
		dataType: 'json'
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
			
			$('.list').append('<br id="break_'+chara_id+'">');
			$('.list').append('<a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">�ꗗ�������</a>');
			$('.list').append('<li id="chara_face_'+chara_id+'" class="chara_face"></li><li id="chara_name_'+chara_id+'" class="chara_name"></li>');
			for (i = 0; i < mounts.length; i++) {
				$('.list').append('<li id="mount'+i+'_'+chara_id+'" class="mount_image"><span class="tooltip"><span class="text">'+mount_names[i]+'</span></span></li>');
			}
			
			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			
			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append(user_name_text);

			for (i = 0; i < mounts.length; i++) {
				$('#mount'+i+'_'+chara_id).append(mounts[i]);
			}
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('�L�����N�^�[�̏�񂪎擾�ł��܂���ł����B');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}
