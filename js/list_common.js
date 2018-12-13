$(function() {
    $('#my_character').on('click', '.search_btn', function(){
        var my_character_name = $('#my_character_name').val();;
        getMyCharacterData(my_character_name);
    });
    
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
			})
			.then(
				function(res){
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('���݂̈ꗗ���������Ă���t���[�J���p�j�[��ǂݍ��݂܂�����낵���ł����H')) {
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
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('���݂̈ꗗ���������Ă��烊���N�V�F����ǂݍ��݂܂�����낵���ł����H')) {
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
		if (confirm('���݂̈ꗗ���������Ă�낵���ł����H')) {
			resetList();
		}
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
    $('#freecompany_name').attr('data-id', '');
	$('#linkshell_name').empty();
	$('#linkshell .icon').empty();
    $('#linkshell_name').attr('data-id', '');
}

function getMyCharacterData(name) {
	$.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/?q='+name+'&worldname=Typhon&blog_lang=ja',
		type: 'GET',
		dataType: 'json'
	})
	.then(
		function(res){
			$content = $(res.data);
            
            var character_name = $content.find('.entry__name').text();
            console.log(character_name);
			
            /*
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
            */
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('�L�����N�^�[�̏�񂪎擾�ł��܂���ł����B');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}
